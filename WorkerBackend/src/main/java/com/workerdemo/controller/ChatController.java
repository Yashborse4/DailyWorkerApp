package com.workerdemo.controller;

import com.workerdemo.dto.chat.ChatMessageDto;
import com.workerdemo.dto.chat.ChatRoomResponse;
import com.workerdemo.dto.chat.UnreadCountResponse;
import com.workerdemo.entity.ChatRoom;
import com.workerdemo.entity.User;
import com.workerdemo.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
@Tag(name = "Chat", description = "Chat and messaging endpoints")
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/rooms")
    @Operation(summary = "Get all chat rooms for the current user")
    public ResponseEntity<List<ChatRoomResponse>> getChatRooms(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(chatService.getUserRooms(user));
    }

    @GetMapping("/rooms/{roomId}/messages")
    @Operation(summary = "Get message history for a chat room")
    public ResponseEntity<List<ChatMessageDto>> getChatMessages(
            @PathVariable Long roomId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(chatService.getRoomMessages(roomId, user));
    }

    @PostMapping("/rooms")
    @Operation(summary = "Get or create a chat room with a specific user")
    public ResponseEntity<ChatRoom> getOrCreateRoom(
            @RequestParam Long targetUserId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(chatService.getOrCreateRoom(user.getId(), targetUserId));
    }

    @PostMapping("/rooms/{roomId}/messages")
    @Operation(summary = "Send a message to a chat room")
    public ResponseEntity<ChatMessageDto> sendMessage(
            @PathVariable Long roomId,
            @RequestBody String content,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(chatService.saveMessage(roomId, user.getId(), content));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get total unread message count for the current user")
    public ResponseEntity<UnreadCountResponse> getUnreadCount(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(chatService.getUnreadMessageCount(user.getId()));
    }

    @PostMapping("/rooms/{roomId}/typing")
    @Operation(summary = "Send typing indicator")
    public ResponseEntity<Void> sendTypingIndicator(
            @PathVariable Long roomId,
            @RequestParam boolean isTyping,
            @AuthenticationPrincipal User user
    ) {
        chatService.sendTypingIndicator(roomId, user.getId(), isTyping);
        return ResponseEntity.ok().build();
    }
}
