package com.workerdemo.dto.chat;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReadReceiptDto {
    private Long chatId;
    private Long userId;
    private java.util.List<Long> messageIds;
    private java.time.LocalDateTime timestamp;
}
