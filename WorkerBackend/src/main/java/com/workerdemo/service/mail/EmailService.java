package com.workerdemo.service.mail;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {
    public void sendEmail(String to, String subject, String body) {
        log.info("Sending email to {}: {}", to, subject);
    }
}
