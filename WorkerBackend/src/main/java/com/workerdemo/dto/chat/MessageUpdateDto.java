package com.workerdemo.dto.chat;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageUpdateDto {
    private String action; // EDIT, DELETE
    private ChatMessageDto message;
    private java.time.LocalDateTime timestamp;
    private Long messageId;
}
