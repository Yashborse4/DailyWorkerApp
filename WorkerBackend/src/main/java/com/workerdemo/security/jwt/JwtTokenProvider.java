package com.workerdemo.security.jwt;

import com.workerdemo.security.UserPrincipal;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Component
@Slf4j
public class JwtTokenProvider {
    
    public static final String TOKEN_TYPE_CLAIM = "tokenType";
    public static final String TYPE_ACCESS = "ACCESS";
    public static final String TYPE_REFRESH = "REFRESH";


    @Value("${application.security.jwt.secret-key}")
    private String jwtSecret;

    @Value("${application.security.jwt.expiration}")
    private long jwtExpirationInMs;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpirationInMs;

    public String generateAccessToken(Authentication authentication) {
        if (authentication.getPrincipal() instanceof UserPrincipal userPrincipal) {
            return generateAccessToken(userPrincipal);
        }
        return generateToken(authentication.getName(), null, jwtExpirationInMs, TYPE_ACCESS);
    }


    public String generateAccessToken(UserPrincipal userPrincipal) {
        return generateToken(userPrincipal.getUsername(), userPrincipal.getId(), jwtExpirationInMs, TYPE_ACCESS);
    }


    public String generateAccessToken(org.springframework.security.core.userdetails.UserDetails userDetails) {
        Long userId = null;
        if (userDetails instanceof UserPrincipal up) {
            userId = up.getId();
        } else if (userDetails instanceof com.workerdemo.entity.User u) {
            userId = u.getId();
        }
        return generateToken(userDetails.getUsername(), userId, jwtExpirationInMs, TYPE_ACCESS);
    }


    public String generateRefreshToken(Authentication authentication) {
        if (authentication.getPrincipal() instanceof UserPrincipal userPrincipal) {
            return generateRefreshToken(userPrincipal);
        }
        return generateToken(authentication.getName(), null, refreshExpirationInMs, TYPE_REFRESH);
    }


    public String generateRefreshToken(UserPrincipal userPrincipal) {
        return generateToken(userPrincipal.getUsername(), userPrincipal.getId(), refreshExpirationInMs, TYPE_REFRESH);
    }


    public String generateRefreshToken(org.springframework.security.core.userdetails.UserDetails userDetails) {
        Long userId = null;
        if (userDetails instanceof UserPrincipal up) {
            userId = up.getId();
        } else if (userDetails instanceof com.workerdemo.entity.User u) {
            userId = u.getId();
        }
        return generateToken(userDetails.getUsername(), userId, refreshExpirationInMs, TYPE_REFRESH);
    }

    private String generateToken(String username, Long userId, long expiration, String tokenType) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);


        var builder = Jwts.builder()
                .subject(username)
                .claim(TOKEN_TYPE_CLAIM, tokenType)
                .issuedAt(now)
                .expiration(expiryDate);
        
        if (userId != null) {
            builder.claim("userId", userId);
        }


        return builder.signWith(getSigningKey())
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = getClaims(token);
        Object userId = claims.get("userId");
        if (userId instanceof Integer i) return i.longValue();
        if (userId instanceof Long l) return l;
        return null;
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claimsResolver.apply(claims);
    }

    public boolean isAccessToken(String token) {
        try {
            String type = getClaimFromToken(token, claims -> claims.get(TOKEN_TYPE_CLAIM, String.class));
            return TYPE_ACCESS.equals(type);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isRefreshToken(String token) {
        try {
            String type = getClaimFromToken(token, claims -> claims.get(TOKEN_TYPE_CLAIM, String.class));
            return TYPE_REFRESH.equals(type);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean validateToken(String token) {

        try {
            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token);
            return true;
        } catch (Exception ex) {
            log.error("Invalid JWT token: {}", ex.getMessage());
        }
        return false;
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
