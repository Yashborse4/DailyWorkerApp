# WorkerBackend TODO List

## Performance & Search
- [/] Implement Redis-based caching for frequently used User roles/profiles (Dependency added).
- [x] Optimize JPA queries for `NotificationQueue` processing to handle bulk operations (Batch processing implemented).
- [ ] Benchmark and optimize Database indexing for high-frequency writes.
- [ ] **NEW**: Integrate OpenSearch for high-performance Job and Worker discovery.
- [ ] **NEW**: Implement GraphQL API for flexible data fetching (similar to Sell-the-old-Car).

## Security & Infrastructure
- [x] Implement Rate Limiting on public API endpoints (Registration/Login) (Bucket4j/AOP implemented).
- [/] Enhance Secret Key management (use Environment Variables or KMS) (Configured via properties).
- [x] Implement Account Lockout policy for multiple failed login attempts (Listener implemented).
- [ ] Implement strict JWT type checking in `JwtTokenProvider` (distinguish Access vs Refresh).
- [ ] Add JWT Token Revocation (Blacklisting) using Redis for logout events.
- [x] **NEW**: Configure Nginx Reverse Proxy in `docker-compose.yml`.
- [x] **NEW**: Setup Automated PostgreSQL Backup service in `docker-compose.yml`.
- [ ] **NEW**: Implement PII Masking for all production logs.

## Reliability & Storage
- [ ] Add more Unit/Integration tests for `AuthenticationService` and `ChatService`.
- [x] Implement centralized Audit logging for critical operations (User registration, profile updates) (AOP implemented).
- [x] Ensure all API responses follow a consistent format via `GlobalExceptionHandler` (Refined).
- [ ] Implement Soft Delete for `User`, `Job`, and `WorkerProfile` entities.
- [ ] **NEW**: Integrate Backblaze B2 Storage for worker documents and job images.
- [ ] **NEW**: Implement Circuit Breakers for external service calls (Firebase/B2).

## Core Features (Worker & Jobs)
- [x] **NEW**: Implement `Job` module with robust validation and lifecycle management.
- [x] **NEW**: Implement `WorkerProfile` module with skill-based indexing.
- [/] **NEW**: Implement Bid/Application system for Job-Worker matching.

## Developer Experience
- [x] Generate OpenAPI/Swagger documentation for the API (Springdoc implemented).
- [ ] Improve log messages for easier debugging in production.
- [ ] Set up automated CI/CD pipeline and monitoring.
- [ ] Configure custom Micrometer metrics for `RateLimitingAspect`.
