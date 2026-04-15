package com.workerdemo.repository;

import com.workerdemo.entity.ChatMessage;
import com.workerdemo.entity.ChatRoom;
import com.workerdemo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatRoomOrderByTimestampAsc(ChatRoom chatRoom);
    long countByChatRoomAndSenderNotAndIsReadFalse(ChatRoom chatRoom, User sender);
}
