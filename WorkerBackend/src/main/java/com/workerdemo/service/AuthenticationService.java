package com.workerdemo.service;

import com.workerdemo.dto.AuthenticationRequest;
import com.workerdemo.dto.AuthenticationResponse;
import com.workerdemo.dto.RegisterRequest;
import com.workerdemo.entity.Role;
import com.workerdemo.entity.User;
import com.workerdemo.exception.BusinessException;
import com.workerdemo.exception.ErrorCode;
import com.workerdemo.security.jwt.JwtTokenProvider;
import com.workerdemo.security.jwt.TokenBlacklistService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthenticationResponse register(RegisterRequest request) {
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .displayName(request.getDisplayName())
                .role(request.getRole() != null ? request.getRole() : Role.USER)
                .build();
        userService.save(user);
        var accessToken = jwtTokenProvider.generateAccessToken(user);
        var refreshToken = jwtTokenProvider.generateRefreshToken(user);
        user.setRefreshToken(refreshToken);
        userService.save(user);
        
        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(mapToUserDto(user))
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        User user = userService.findByUsername(request.getUsername());
        var accessToken = jwtTokenProvider.generateAccessToken(user);
        var refreshToken = jwtTokenProvider.generateRefreshToken(user);
        user.setRefreshToken(refreshToken);
        userService.save(user);
        
        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(mapToUserDto(user))
                .build();
    }

    public AuthenticationResponse refreshToken(String refreshToken) {
        if (tokenBlacklistService.isBlacklisted(refreshToken)) {
            throw new BusinessException(ErrorCode.BAD_CREDENTIALS, "Refresh token has been revoked");
        }

        if (!jwtTokenProvider.validateRefreshToken(refreshToken)) {
            throw new BusinessException(ErrorCode.BAD_CREDENTIALS, "Invalid Refresh Token");
        }
        
        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        User user = userService.findByUsername(username);
        
        if (refreshToken.equals(user.getRefreshToken())) {
            var newAccessToken = jwtTokenProvider.generateAccessToken(user);
            var newRefreshToken = jwtTokenProvider.generateRefreshToken(user);
            user.setRefreshToken(newRefreshToken);
            userService.save(user);

            // Blacklist the old refresh token to enforce single-use token rotation
            long remainingMs = jwtTokenProvider.getRemainingExpiration(refreshToken);
            tokenBlacklistService.blacklistToken(refreshToken, remainingMs);
            
            return AuthenticationResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .user(mapToUserDto(user))
                    .build();
        }
        throw new BusinessException(ErrorCode.BAD_CREDENTIALS, "Refresh Token mismatch");
    }

    private com.workerdemo.dto.UserDto mapToUserDto(User user) {
        return com.workerdemo.dto.UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .role(user.getRole())
                .isEmailVerified(user.isEmailVerified())
                .isDealerVerified(user.isDealerVerified())
                .build();
    }
}
