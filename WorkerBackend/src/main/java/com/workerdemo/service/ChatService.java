package com.workerdemo.service;

import com.workerdemo.dto.chat.ChatMessageDto;
import com.workerdemo.dto.chat.ChatRoomResponse;
import com.workerdemo.dto.chat.ParticipantDto;
import com.workerdemo.dto.chat.UnreadCountResponse;
import com.workerdemo.entity.ChatMessage;
import com.workerdemo.entity.ChatRoom;
import com.workerdemo.entity.User;
import com.workerdemo.repository.ChatMessageRepository;
import com.workerdemo.repository.ChatRoomRepository;
import com.workerdemo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    public List<ChatRoomResponse> getUserRooms(User user) {
        return chatRoomRepository.findByWorkerOrHirer(user, user).stream()
                .map(room -> {
                    User other = room.getWorker().equals(user) ? room.getHirer() : room.getWorker();
                    List<ChatMessage> messages = chatMessageRepository.findByChatRoomOrderByTimestampAsc(room);
                    ChatMessage last = messages.isEmpty() ? null : messages.get(messages.size() - 1);
                    return ChatRoomResponse.builder()
                            .id(room.getId())
                            .workerId(room.getWorker().getId())
                            .hirerId(room.getHirer().getId())
                            .otherUserName(other.getDisplayName())
                            .lastMessage(last != null ? last.getContent() : null)
                            .lastMessageTimestamp(last != null ? last.getTimestamp() : null)
                            .unreadCount(chatMessageRepository.countByChatRoomAndSenderNotAndIsReadFalse(room, user))
                            .build();
                })
                .collect(Collectors.toList());
    }

    public List<ChatMessageDto> getRoomMessages(Long roomId, User user) {
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
        
        List<ChatMessage> messages = chatMessageRepository.findByChatRoomOrderByTimestampAsc(room);
        
        // Mark as read
        messages.stream()
                .filter(m -> !m.getSender().equals(user) && !m.isRead())
                .forEach(m -> m.setRead(true));
        chatMessageRepository.saveAll(messages);

        return messages.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ChatRoom getOrCreateRoom(Long userId1, Long userId2) {
        User user1 = userRepository.findById(userId1).orElseThrow();
        User user2 = userRepository.findById(userId2).orElseThrow();

        return chatRoomRepository.findByParticipants(user1, user2)
                .orElseGet(() -> chatRoomRepository.save(ChatRoom.builder()
                        .worker(user1.getRole().name().equals("WORKER") ? user1 : user2)
                        .hirer(user1.getRole().name().equals("HIRER") ? user1 : user2)
                        .build()));
    }

    @Transactional
    public ChatMessageDto saveMessage(Long chatRoomId, Long userId, String content) {
        ChatRoom room = chatRoomRepository.findById(chatRoomId).orElseThrow();
        User sender = userRepository.findById(userId).orElseThrow();

        ChatMessage message = ChatMessage.builder()
                .chatRoom(room)
                .sender(sender)
                .content(content)
                .build();

        return mapToDto(chatMessageRepository.save(message));
    }

    public ChatRoom getChatRoom(Long roomId, Long userId) {
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
        
        if (!room.getWorker().getId().equals(userId) && !room.getHirer().getId().equals(userId)) {
            throw new RuntimeException("User is not a participant in this chat room");
        }
        return room;
    }

    public ChatMessageDto getChatMessage(Long messageId, Long userId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        // Ensure user is part of the chat room
        getChatRoom(message.getChatRoom().getId(), userId);
        
        return mapToDto(message);
    }

    @Transactional
    public ChatMessageDto editMessage(Long messageId, Long userId, String content) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        if (!message.getSender().getId().equals(userId)) {
            throw new SecurityException("Unauthorized to edit this message");
        }
        
        message.setContent(content);
        return mapToDto(chatMessageRepository.save(message));
    }

    @Transactional
    public void deleteMessage(Long messageId, Long userId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        if (!message.getSender().getId().equals(userId)) {
            throw new SecurityException("Unauthorized to delete this message");
        }
        
        chatMessageRepository.delete(message);
    }

    @Transactional
    public void markMessagesAsRead(Long chatRoomId, List<Long> messageIds, Long userId) {
        List<ChatMessage> messages = chatMessageRepository.findAllById(messageIds);
        messages.stream()
                .filter(m -> m.getChatRoom().getId().equals(chatRoomId) && !m.getSender().getId().equals(userId))
                .forEach(m -> m.setRead(true));
        chatMessageRepository.saveAll(messages);
    }

    public List<ParticipantDto> getAllChatRoomParticipants(Long chatRoomId, Long senderId) {
        ChatRoom room = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
        
        return List.of(
                ParticipantDto.builder()
                        .userId(room.getWorker().getId())
                        .username(room.getWorker().getUsername())
                        .build(),
                ParticipantDto.builder()
                        .userId(room.getHirer().getId())
                        .username(room.getHirer().getUsername())
                        .build()
        );
    }

    private ChatMessageDto mapToDto(ChatMessage m) {

        return ChatMessageDto.builder()
                .id(String.valueOf(m.getId()))
                .chatRoomId(m.getChatRoom().getId())
                .content(m.getContent())
                .senderId(m.getSender().getId())
                .timestamp(m.getTimestamp())
                .status(m.isRead() ? ChatMessageDto.MessageStatus.READ : ChatMessageDto.MessageStatus.SENT)
                .build();
    }

    public void sendTypingIndicator(Long chatRoomId, Long userId, boolean isTyping) {
        log.debug("User {} typing in room {}: {}", userId, chatRoomId, isTyping);
    }

    public UnreadCountResponse getUnreadMessageCount(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        long count = chatRoomRepository.findByWorkerOrHirer(user, user).stream()
                .mapToLong(room -> chatMessageRepository.countByChatRoomAndSenderNotAndIsReadFalse(room, user))
                .sum();
        return UnreadCountResponse.builder().count((int) count).build();
    }
}
