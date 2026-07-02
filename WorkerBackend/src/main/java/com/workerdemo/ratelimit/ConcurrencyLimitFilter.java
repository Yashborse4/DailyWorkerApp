package com.workerdemo.ratelimit;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
public class ConcurrencyLimitFilter extends OncePerRequestFilter {

    private final Limiter limiter;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String path = request.getRequestURI();
        
        // Skip for static resources or documentation
        if (path.contains("swagger") || path.contains("api-docs")) {
            filterChain.doFilter(request, response);
            return;
        }

        Optional<Limiter.Listener> listenerOpt = limiter.acquire();
        
        if (listenerOpt.isEmpty()) {
            log.warn("Concurrency limit exceeded for path: {}", path);
            response.setStatus(429);
            response.setHeader("Retry-After", "1");
            response.setContentType("application/json");
            response.getWriter().write("{\"message\":\"Too many requests. Please retry shortly.\"}");
            return;
        }

        Limiter.Listener listener = listenerOpt.get();
        try {
            filterChain.doFilter(request, response);
            if (response.getStatus() >= 500) {
                listener.onDropped();
            } else if (response.getStatus() == 404) {
                listener.onIgnore();
            } else {
                listener.onSuccess();
            }
        } catch (Exception e) {
            listener.onDropped();
            throw e;
        }
    }
}
