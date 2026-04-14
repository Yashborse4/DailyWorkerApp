package com.workerdemo.websocket;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RedisChatMessage {
    private String type;
    private Long chatRoomId;
    private Object payload;
}
