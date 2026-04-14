package com.workerdemo.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisMessageSubscriber implements MessageListener {

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            RedisChatMessage chatMessage = objectMapper.readValue(message.getBody(), RedisChatMessage.class);
            log.debug("Received Redis message of type: {}", chatMessage.getType());

            switch (chatMessage.getType()) {
                case "MESSAGE":
                    messagingTemplate.convertAndSend("/topic/chat/" + chatMessage.getChatRoomId() + "/messages", chatMessage.getPayload());
                    break;
                case "UPDATE":
                    messagingTemplate.convertAndSend("/topic/chat/" + chatMessage.getChatRoomId() + "/updates", chatMessage.getPayload());
                    break;
                case "TYPING":
                    messagingTemplate.convertAndSend("/topic/chat/" + chatMessage.getChatRoomId() + "/typing", chatMessage.getPayload());
                    break;
                case "READ":
                    messagingTemplate.convertAndSend("/topic/chat/" + chatMessage.getChatRoomId() + "/read", chatMessage.getPayload());
                    break;
                case "UNREAD_COUNT":
                    // For UNREAD_COUNT, payload should contain userId
                    // This is usually sent to a specific user queue
                    break;
            }
        } catch (Exception e) {
            log.error("Failed to process Redis message: {}", e.getMessage());
        }
    }
}
