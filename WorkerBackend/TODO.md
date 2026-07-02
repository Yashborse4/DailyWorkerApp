# WorkerBackend TODO List

## Performance & Search
- [/] Implement Redis-based caching for frequently used User roles/profiles (Dependency added).
- [ ] Benchmark and optimize Database indexing for high-frequency writes.
- [ ] **NEW**: Integrate OpenSearch for high-performance Job and Worker discovery.


## Security & Infrastructure

- [ ] Implement strict JWT type checking in `JwtTokenProvider` (distinguish Access vs Refresh).
- [ ] Add JWT Token Revocation (Blacklisting) using Redis for logout events.
- [ ] **NEW**: Implement PII Masking for all production logs.

## Reliability & Storage
- [ ] Add more Unit/Integration tests for `AuthenticationService` and `ChatService`.
- [ ] Implement Soft Delete for `User`, `Job`, and `WorkerProfile` entities.
- [ ] **NEW**: Integrate Backblaze B2 Storage for worker documents and job images.
- [ ] **NEW**: Implement Circuit Breakers for external service calls (Firebase/B2).

## Core Features (Worker & Jobs)
- [/] **NEW**: Implement Bid/Application system for Job-Worker matching.

## Developer Experience
- [ ] Improve log messages for easier debugging in production.
- [ ] Set up automated CI/CD pipeline and monitoring.
- [ ] Configure custom Micrometer metrics for `RateLimitingAspect`.

## Production Readiness Checklist
- [ ] **Secrets Management**: Externalize all secrets (JWT keys, DB passwords, API keys) using environment variables or a Secret Manager (KMS/Vault).
- [ ] **Monitoring & Observability**:
    - [ ] Secure Actuator endpoints in production (restrict to Admin or internal IP).
    - [ ] Configure Prometheus and Grafana dashboards for JVM and business metrics.
    - [ ] Set up Alerting for critical failures (OOM, DB connection loss, rate limit spikes).
- [ ] **Infrastructure**:
    - [ ] Configure SSL/TLS at the Nginx level for HTTPS.
    - [ ] Optimize HikariCP connection pool based on production load tests.
    - [ ] Set up log rotation and aggregation (e.g., ELK or CloudWatch).
- [ ] **Security Hardening**:
    - [ ] Implementation of JWT Token Revocation (Blacklisting) in Redis.
    - [ ] Regular dependency vulnerability scanning (Snyk/OWASP).
    - [ ] Mask sensitive data (PII) in all production-level logs.
- [ ] **Reliability**:
    - [ ] Ensure `GlobalExceptionHandler` masks detailed exception messages in production.
    - [ ] Implement robust health checks for all downstream dependencies (Redis, OpenSearch, B2).
    - [ ] Conduct load testing to determine CPU/Memory limits.
