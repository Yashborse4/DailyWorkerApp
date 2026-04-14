package com.workerdemo.websocket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class WebSocketSessionManager {

    // Map of userId -> Set of sessionId
    private final Map<Long, Set<String>> userSessions = new ConcurrentHashMap<>();
    
    // Map of sessionId -> userId
    private final Map<String, Long> sessionToUser = new ConcurrentHashMap<>();

    // Map of userId -> Set of chatRoomId
    private final Map<Long, Set<Long>> userChatRooms = new ConcurrentHashMap<>();

    public void addUserSession(Long userId, String sessionId) {
        userSessions.computeIfAbsent(userId, k -> Collections.newSetFromMap(new ConcurrentHashMap<>())).add(sessionId);
        sessionToUser.put(sessionId, userId);
        log.debug("Added session {} for user {}", sessionId, userId);
    }

    public void removeSession(String sessionId) {
        Long userId = sessionToUser.remove(sessionId);
        if (userId != null) {
            Set<String> sessions = userSessions.get(userId);
            if (sessions != null) {
                sessions.remove(sessionId);
                if (sessions.isEmpty()) {
                    userSessions.remove(userId);
                    userChatRooms.remove(userId);
                    log.debug("User {} is now offline", userId);
                }
            }
        }
    }

    public void addUserToChat(Long userId, Long chatRoomId) {
        // Registration logic...
    }

    public void setUserOnline(Long userId) {
        // Presence logic...
    }

    public boolean isUserOnline(Long userId) {
        return userSessions.containsKey(userId);
    }
}
