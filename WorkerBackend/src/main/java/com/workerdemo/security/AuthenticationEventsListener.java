package com.workerdemo.security;

import com.workerdemo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AbstractAuthenticationEvent;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Listener to handle authentication success and failure events.
 * Primarily used for account locking logic.
 */
@Component
@RequiredArgsConstructor
public class AuthenticationEventsListener implements ApplicationListener<AbstractAuthenticationEvent> {

    private final UserRepository userRepository;
    private static final int MAX_FAILED_ATTEMPTS = 5;

    @Override
    @Transactional
    public void onApplicationEvent(AbstractAuthenticationEvent event) {
        if (event instanceof AuthenticationSuccessEvent) {
            String username = event.getAuthentication().getName();
            userRepository.findByUsername(username).ifPresent(user -> {
                if (user.getFailedLoginAttempts() > 0) {
                    user.setFailedLoginAttempts(0);
                    userRepository.save(user);
                }
            });
        } else if (event instanceof AuthenticationFailureBadCredentialsEvent) {
            String username = event.getAuthentication().getName();
            userRepository.findByUsername(username).ifPresent(user -> {
                int newAttempts = user.getFailedLoginAttempts() + 1;
                user.setFailedLoginAttempts(newAttempts);
                
                if (newAttempts >= MAX_FAILED_ATTEMPTS) {
                    user.setAccountNonLocked(false);
                    user.setLockTime(LocalDateTime.now());
                }
                userRepository.save(user);
            });
        }
    }
}
