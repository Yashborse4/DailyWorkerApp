package com.workerdemo.dto.chat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    private String chatId;
    @NotBlank(message = "Message content is required")
    @Size(max = 4000, message = "Message content cannot exceed 4000 characters")
    private String content;
    private Long recipientId;
}
