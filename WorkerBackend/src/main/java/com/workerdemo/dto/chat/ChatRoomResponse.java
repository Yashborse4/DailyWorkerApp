package com.workerdemo.dto.chat;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomResponse {
    private Long id;
    private Long workerId;
    private Long hirerId;
    private String otherUserName;
    private String lastMessage;
    private LocalDateTime lastMessageTimestamp;
    private Long unreadCount;
}
