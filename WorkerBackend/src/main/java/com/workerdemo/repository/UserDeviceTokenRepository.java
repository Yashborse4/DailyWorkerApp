package com.workerdemo.repository;

import com.workerdemo.entity.User;
import com.workerdemo.entity.UserDeviceToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserDeviceTokenRepository extends JpaRepository<UserDeviceToken, Long> {
    List<UserDeviceToken> findByUser(User user);
    Optional<UserDeviceToken> findByToken(String token);
    void deleteByToken(String token);
}
