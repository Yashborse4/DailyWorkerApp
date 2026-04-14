package com.workerdemo.dto.chat;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarkMessagesReadRequest {
    private String chatId;
    private java.util.List<Long> messageIds;
}
