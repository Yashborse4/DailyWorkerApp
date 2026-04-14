package com.workerdemo.dto.chat;

import com.workerdemo.dto.UserDto;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {
    private String id;
    private Long chatRoomId; // Renamed from chatId, and type changed to Long to match existing chatRoomId
    private Long senderId;   // Added for compatibility with controller
    private UserDto sender;
    private String content;
    private LocalDateTime timestamp;
    private MessageStatus status;

    public enum MessageStatus {
        SENT, DELIVERED, READ
    }
}
