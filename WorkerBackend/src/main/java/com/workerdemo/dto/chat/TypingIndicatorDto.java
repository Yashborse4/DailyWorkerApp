package com.workerdemo.dto.chat;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TypingIndicatorDto {
    private Long chatId;
    private Long userId;
    private String userName;
    private boolean isTyping;
    private java.time.LocalDateTime timestamp;
}
