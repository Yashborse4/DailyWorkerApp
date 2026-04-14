package com.workerdemo.service.mail;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class MobileOtpService {
    public void sendOtp(String mobileNumber, String otp) {
        log.info("Sending OTP {} to {}", otp, mobileNumber);
    }
}
