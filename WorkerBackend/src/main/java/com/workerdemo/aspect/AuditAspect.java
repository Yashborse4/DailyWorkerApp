package com.workerdemo.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.MDC;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * Aspect for audit logging methods annotated with {@link AuditLog}.
 * Captures user identity, action, and success/failure into MDC and logs.
 */
@Aspect
@Component
@Slf4j
public class AuditAspect {

    private static final String AUDIT_ACTION = "auditAction";
    private static final String AUDIT_STATUS = "auditStatus";

    @Around("@annotation(auditLog)")
    public Object audit(ProceedingJoinPoint joinPoint, AuditLog auditLog) throws Throwable {
        String username = SecurityContextHolder.getContext().getAuthentication() != null 
                ? SecurityContextHolder.getContext().getAuthentication().getName() 
                : "ANONYMOUS";
        
        String action = auditLog.action();
        String args = auditLog.logArgs() ? Arrays.toString(joinPoint.getArgs()) : "[REDACTED]";

        MDC.put(AUDIT_ACTION, action);
        log.info("AUDIT - User: {}, Action: {}, Args: {}", username, action, args);

        try {
            Object result = joinPoint.proceed();
            MDC.put(AUDIT_STATUS, "SUCCESS");
            log.info("AUDIT - User: {}, Action: {}, Status: SUCCESS", username, action);
            return result;
        } catch (Throwable e) {
            MDC.put(AUDIT_STATUS, "FAILURE");
            log.error("AUDIT - User: {}, Action: {}, Status: FAILURE, Error: {}", username, action, e.getMessage());
            throw e;
        } finally {
            MDC.remove(AUDIT_ACTION);
            MDC.remove(AUDIT_STATUS);
        }
    }
}
