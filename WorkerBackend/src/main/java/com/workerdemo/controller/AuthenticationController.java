package com.workerdemo.controller;

import com.workerdemo.aspect.AuditLog;
import com.workerdemo.dto.*;
import com.workerdemo.ratelimit.RateLimit;
import com.workerdemo.service.AuthenticationService;
import com.workerdemo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication and registration endpoints")
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final UserService userService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    @RateLimit(capacity = 5, tokensPerPeriod = 5, periodInSeconds = 3600, key = "auth_register")
    @AuditLog(action = "USER_REGISTRATION")
    public ResponseEntity<AuthenticationResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/authenticate")
    @Operation(summary = "Authenticate a user and return tokens")
    @RateLimit(capacity = 10, tokensPerPeriod = 10, periodInSeconds = 60, key = "auth_login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @Valid @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @PostMapping("/unlock/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Unlock a locked user account (Admin only)")
    @AuditLog(action = "USER_UNLOCK")
    public ResponseEntity<String> unlock(@PathVariable String username) {
        userService.unlockUser(username);
        return ResponseEntity.ok("User unlocked successfully");
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh an access token")
    @RateLimit(capacity = 20, tokensPerPeriod = 20, periodInSeconds = 60, key = "auth_refresh")
    public ResponseEntity<AuthenticationResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authenticationService.refreshToken(request.getRefreshToken()));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user and invalidate token")
    public ResponseEntity<Void> logout() {
        // This method will be intercepted by Spring Security's logout filter
        return ResponseEntity.ok().build();
    }
}
