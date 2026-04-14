package com.workerdemo.dto.chat;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    private String chatId;
    private String content;
    private Long recipientId;
}
