package com.workerdemo.websocket;

import com.workerdemo.dto.chat.*;
import com.workerdemo.security.UserPrincipal;
import com.workerdemo.service.ChatService;
import com.workerdemo.service.UserService;
import com.workerdemo.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;

import java.util.Map;

/**
 * WebSocket Controller for real-time chat functionality
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketController {

    private final ChatService chatService;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;
    private final WebSocketSessionManager sessionManager;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ChannelTopic chatTopic;

    // ========================= MESSAGE HANDLING =========================

    /**
     * Handle sending a new message to a chat room
     */
    @MessageMapping("/chat/{chatRoomId}/send")
    public void sendMessage(@DestinationVariable Long chatRoomId, 
                           @Payload SendMessageRequest messageRequest, 
                           Authentication authentication) {
        try {
            UserPrincipal userPrincipal = resolveUser(authentication);
            if (userPrincipal == null) {
                return;
            }

            Long userId = userPrincipal.getId();
            
            // Save message to database
            ChatMessageDto savedMessage = chatService.saveMessage(chatRoomId, userId, messageRequest.getContent());

            // Broadcast message via Redis Pub/Sub (for multi-node support)
            broadcastMessageToChatRoom(chatRoomId, savedMessage);

            // Update unread counts for other participants
            updateUnreadCountsForParticipants(chatRoomId, userId);

        } catch (Exception e) {
            log.error("Error handling WebSocket message: {}", e.getMessage(), e);
            UserPrincipal userPrincipal = resolveUser(authentication);
            if (userPrincipal != null) {
                sendErrorToUser(userPrincipal.getUsername(), "Failed to send message: " + e.getMessage());
            }
        }
    }

    /**
     * Handle editing an existing message
     */
    @MessageMapping("/chat/{chatRoomId}/edit/{messageId}")
    public void editMessage(@DestinationVariable Long chatRoomId,
                           @DestinationVariable Long messageId,
                           @Payload EditMessageRequest editRequest,
                           Authentication authentication) {
        try {
            UserPrincipal userPrincipal = resolveUser(authentication);
            if (userPrincipal == null) {
                return;
            }

            Long userId = userPrincipal.getId();
            
            // Update message in database
            ChatMessageDto updatedMessage = chatService.editMessage(messageId, userId, editRequest.getContent());

            // Create message update DTO
            MessageUpdateDto updateDto = MessageUpdateDto.builder()
                    .action("EDIT")
                    .message(updatedMessage)
                    .timestamp(java.time.LocalDateTime.now())
                    .build();

            // Broadcast update via Redis Pub/Sub
            broadcastMessageUpdateToChatRoom(chatRoomId, updateDto);

        } catch (SecurityException e) {
            log.warn("Unauthorized edit attempt");
            UserPrincipal userPrincipal = resolveUser(authentication);
            if (userPrincipal != null) {
                sendErrorToUser(userPrincipal.getUsername(), "You are not authorized to edit this message.");
            }
        } catch (Exception e) {
            log.error("Error editing WebSocket message: {}", e.getMessage(), e);
            UserPrincipal userPrincipal = resolveUser(authentication);
            if (userPrincipal != null) {
                sendErrorToUser(userPrincipal.getUsername(), "Failed to edit message: " + e.getMessage());
            }
        }
    }

    /**
     * Handle deleting a message
     */
    @MessageMapping("/chat/{chatRoomId}/delete/{messageId}")
    public void deleteMessage(@DestinationVariable Long chatRoomId,
                             @DestinationVariable Long messageId,
                             Authentication authentication) {
        try {
            UserPrincipal userPrincipal = resolveUser(authentication);
            if (userPrincipal == null) {
                return;
            }

            Long userId = userPrincipal.getId();

            // Get message details Before deletion
            ChatMessageDto messageToDelete = chatService.getChatMessage(messageId, userId);
            Long chatRoomIdFromDb = messageToDelete.getChatRoomId();

            // Delete the message
            chatService.deleteMessage(messageId, userId);

            // Create message update DTO
            MessageUpdateDto updateDto = MessageUpdateDto.builder()
                    .action("DELETE")
                    .message(null) // No message content for delete
                    .timestamp(java.time.LocalDateTime.now())
                    .messageId(messageId)
                    .build();

            // Broadcast deletion via Redis Pub/Sub
            broadcastMessageUpdateToChatRoom(chatRoomIdFromDb, updateDto);

        } catch (SecurityException e) {
            log.warn("Unauthorized deletion attempt");
            UserPrincipal userPrincipal = resolveUser(authentication);
            if (userPrincipal != null) {
                sendErrorToUser(userPrincipal.getUsername(), "You are not authorized to delete this message.");
            }
        } catch (Exception e) {
            log.error("Unexpected error deleting WebSocket message: {}", e.getMessage(), e);
            UserPrincipal userPrincipal = resolveUser(authentication);
            if (userPrincipal != null) {
                sendErrorToUser(userPrincipal.getUsername(), "An error occurred: " + e.getMessage());
            }
        }
    }

    /**
     * Handle typing indicators
     */
    @MessageMapping("/chat/{chatRoomId}/typing")
    public void handleTyping(@DestinationVariable Long chatRoomId,
                            @Payload boolean isTyping,
                            Authentication authentication) {
        try {
            UserPrincipal userPrincipal = resolveUser(authentication);
            if (userPrincipal == null) {
                return;
            }

            Long userId = userPrincipal.getId();
            
            // Notify other participants (Redis handles cross-node)
            chatService.sendTypingIndicator(chatRoomId, userId, isTyping);

            // Get User details
            User user = userService.findById(userId);

            // Create typing indicator DTO
            TypingIndicatorDto typingIndicator = TypingIndicatorDto.builder()
                    .chatId(chatRoomId)
                    .userId(userId)
                    .userName(user.getDisplayName())
                    .isTyping(isTyping)
                    .timestamp(java.time.LocalDateTime.now())
                    .build();

            // Broadcast via Redis
            publishToRedis("TYPING", chatRoomId, typingIndicator);

        } catch (Exception e) {
            log.error("Error handling typing indicator: {}", e.getMessage());
        }
    }

    /**
     * Mark messages as read
     */
    @MessageMapping("/chat/{chatRoomId}/read")
    public void markMessagesAsRead(@DestinationVariable Long chatRoomId,
            @Payload MarkMessagesReadRequest readRequest,
            Authentication authentication) {
        try {
            UserPrincipal userPrincipal = resolveUser(authentication);
            if (userPrincipal == null) {
                return;
            }

            Long userId = userPrincipal.getId();
            chatService.markMessagesAsRead(chatRoomId, readRequest.getMessageIds(), userId);

            // Broadcast read receipts to other participants
            ReadReceiptDto readReceipt = ReadReceiptDto.builder()
                    .chatId(chatRoomId)
                    .userId(userId)
                    .messageIds(readRequest.getMessageIds())
                    .timestamp(java.time.LocalDateTime.now())
                    .build();

            // Broadcast read receipts via Redis Pub/Sub
            publishToRedis("READ", chatRoomId, readReceipt);

            // Update unread counts for the User
            sendUnreadCountUpdate(userId);

        } catch (Exception e) {
            log.error("Error marking messages as read: {}", e.getMessage(), e);
            UserPrincipal userPrincipal = resolveUser(authentication);
            if (userPrincipal != null) {
                sendErrorToUser(userPrincipal.getUsername(), "Failed to mark messages as read: " + e.getMessage());
            }
        }
    }

    // ========================= SUBSCRIPTION HANDLING =========================

    /**
     * Handle chat room subscriptions
     */
    @SubscribeMapping("/topic/chat/{chatRoomId}")
    public void subscribeToChat(@DestinationVariable Long chatRoomId, Authentication authentication) {
        try {
            UserPrincipal userPrincipal = resolveUser(authentication);
            if (userPrincipal == null) {
                return;
            }

            Long userId = userPrincipal.getId();

            // Verify User has access to this chat room
            chatService.getChatRoom(chatRoomId, userId);

            // Register User session for this chat room
            sessionManager.addUserToChat(userId, chatRoomId);

            log.debug("User {} subscribed to chat room {}", userId, chatRoomId);

        } catch (Exception e) {
            log.error("Error subscribing to chat room: {}", e.getMessage(), e);
            UserPrincipal userPrincipal = resolveUser(authentication);
            if (userPrincipal != null) {
                sendErrorToUser(userPrincipal.getUsername(), "Failed to subscribe to chat room");
            }
        }
    }

    /**
     * Handle User presence subscriptions
     */
    @SubscribeMapping("/User/queue/presence")
    public void subscribeToPresence(Authentication authentication) {
        try {
            UserPrincipal userPrincipal = resolveUser(authentication);
            if (userPrincipal == null) {
                return;
            }

            Long userId = userPrincipal.getId();
            sessionManager.setUserOnline(userId);

            log.debug("User {} subscribed to presence updates", userId);

        } catch (Exception e) {
            log.error("Error subscribing to presence: {}", e.getMessage(), e);
        }
    }

    private UserPrincipal resolveUser(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return (UserPrincipal) authentication.getPrincipal();
        }
        return null;
    }

    // ========================= UTILITY METHODS =========================

    /**
     * Broadcast message to all participants in a chat room via Redis Pub/Sub
     */
    private void broadcastMessageToChatRoom(Long chatRoomId, ChatMessageDto message) {
        publishToRedis("MESSAGE", chatRoomId, message);
        log.debug("Published message {} to Redis for chat room {}", message.getId(), chatRoomId);
    }

    /**
     * Broadcast message updates (edit/delete) to chat room via Redis Pub/Sub
     */
    private void broadcastMessageUpdateToChatRoom(Long chatRoomId, MessageUpdateDto updateDto) {
        publishToRedis("UPDATE", chatRoomId, updateDto);
        log.debug("Published message update to Redis for chat room {}", chatRoomId);
    }

    /**
     * Helper to publish any chat event to Redis
     */
    private void publishToRedis(String type, Long chatRoomId, Object payload) {
        try {
            RedisChatMessage redisMessage = RedisChatMessage.builder()
                    .type(type)
                    .chatRoomId(chatRoomId)
                    .payload(payload)
                    .build();
            
            redisTemplate.convertAndSend(chatTopic.getTopic(), redisMessage);
        } catch (Exception e) {
            log.warn("Redis Pub/Sub is OFFLINE: {}. System is falling back to Local Node delivery (Degraded Mode).", e.getMessage());
            if ("MESSAGE".equals(type)) {
                messagingTemplate.convertAndSend("/topic/chat/" + chatRoomId + "/messages", payload);
            }
        }
    }

    /**
     * Update unread counts for all participants except sender
     */
    private void updateUnreadCountsForParticipants(Long chatRoomId, Long senderId) {
        try {
            var participants = chatService.getAllChatRoomParticipants(chatRoomId, senderId);
            participants.stream()
                    .filter(p -> !p.getUserId().equals(senderId))
                    .forEach(participant -> sendUnreadCountUpdate(participant.getUserId()));

        } catch (Exception e) {
            log.error("Error updating unread counts: {}", e.getMessage());
        }
    }

    /**
     * Send unread count update to specific User
     */
    private void sendUnreadCountUpdate(Long userId) {
        try {
            UnreadCountResponse unreadCount = chatService.getUnreadMessageCount(userId);
            
            publishToRedis("UNREAD_COUNT", null, Map.of(
                    "userId", userId,
                    "unreadCount", unreadCount
            ));
        } catch (Exception e) {
            log.error("Error sending unread count update to User {}: {}", userId, e.getMessage());
        }
    }

    /**
     * Send error message to specific User
     */
    private void sendErrorToUser(String userId, String errorMessage) {
        messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/errors",
                Map.of("error", errorMessage, "Timestamp", System.currentTimeMillis()));
    }
}
