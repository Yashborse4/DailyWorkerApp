package com.workerdemo.dto.chat;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnreadCountResponse {
    private int count;
    private int totalUnreadCount; // For compatibility
}
