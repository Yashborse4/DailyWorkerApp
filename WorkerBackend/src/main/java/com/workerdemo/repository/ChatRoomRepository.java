package com.workerdemo.repository;

import com.workerdemo.entity.ChatRoom;
import com.workerdemo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    List<ChatRoom> findByWorkerOrHirer(User worker, User hirer);
    
    @Query("SELECT cr FROM ChatRoom cr WHERE (cr.worker = :user1 AND cr.hirer = :user2) OR (cr.worker = :user2 AND cr.hirer = :user1)")
    Optional<ChatRoom> findByParticipants(@Param("user1") User user1, @Param("user2") User user2);
}
