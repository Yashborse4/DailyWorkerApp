package com.workerdemo.service;

import com.workerdemo.dto.chat.ChatMessageDto;
import com.workerdemo.dto.chat.ParticipantDto;
import com.workerdemo.dto.chat.UnreadCountResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    public ChatMessageDto saveMessage(Long chatRoomId, Long userId, String content) {
        log.info("Saving message in chat {}: {}", chatRoomId, content);
        return ChatMessageDto.builder()
                .id("temp-id")
                .chatRoomId(chatRoomId)
                .status(ChatMessageDto.MessageStatus.SENT)
                .build();
    }

    public ChatMessageDto editMessage(Long messageId, Long userId, String content) {
        return ChatMessageDto.builder().id(String.valueOf(messageId)).content(content).build();
    }

    public void deleteMessage(Long messageId, Long userId) {
        log.info("Deleting message {}", messageId);
    }

    public ChatMessageDto getChatMessage(Long messageId, Long userId) {
        return ChatMessageDto.builder().id(String.valueOf(messageId)).chatRoomId(1L).build();
    }

    public void sendTypingIndicator(Long chatRoomId, Long userId, boolean isTyping) {
        log.debug("User {} typing in room {}: {}", userId, chatRoomId, isTyping);
    }

    public void markMessagesAsRead(Long chatRoomId, List<Long> messageIds, Long userId) {
        log.info("Marking {} messages as read in room {} for user {}", messageIds.size(), chatRoomId, userId);
    }

    public void getChatRoom(Long chatRoomId, Long userId) {
        // Validation logic
    }

    public List<ParticipantDto> getAllChatRoomParticipants(Long chatRoomId, Long senderId) {
        return Collections.emptyList();
    }

    public UnreadCountResponse getUnreadMessageCount(Long userId) {
        return UnreadCountResponse.builder().count(0).build();
    }
}
