# Netflix-Level Production TODO List

## Phase 1: Infrastructure & Dependency Cleanup
- [x] Remove duplicate Jakarta Mail dependencies (ClassLoader safety).
- [ ] Remove unused OpenSearch and Firebase dependencies (Lean project).
- [ ] Update Firebase Admin to 9.3.0.
- [ ] Add Monitoring & Metrics:
    - [ ] `spring-boot-starter-actuator`
    - [ ] `micrometer-registry-prometheus`
- [ ] Add Resilience:
    - [x] `resilience4j-spring-boot3`
- [ ] Add Logging:
    - [ ] `logstash-logback-encoder` (JSON logging).

## Phase 2: Observability & Resilience Configuration
- [ ] **Observability**:
    - [ ] Create `logback-spring.xml` (JSON structured logs).
    - [ ] Configure Actuator endpoints and Prometheus metrics.
    - [ ] Setup Micrometer Tracing (Brave/Zipkin).
- [ ] **Resilience**:
    - [ ] Setup Circuit Breakers for external services (Firebase, Search).
    - [ ] Implement Retry mechanisms for transient DB/API failures.
    - [x] Configure Bulkheads to isolate resource-heavy operations.

## Phase 3: Performance, Scalability & Security Hardening
- [ ] **Performance**:
    - [ ] HikariCP Tuning (Pool size, idle timeout).
    - [ ] Enable Redis as the primary Cache provider (`@Cacheable`).
    - [ ] Configure Distributed Sessions (Spring Session Redis).
- [ ] **Security**:
    - [ ] Implement OAuth2 Resource Server for production-grade auth.
    - [ ] Harden CORS and CSRF configurations.
- [ ] **Scale**:
    - [ ] Enable Asynchronous processing (`@Async`).


## Phase 4: Testing & DevEx
- [ ] Implement Testcontainers for PostgreSQL integration tests.
- [ ] Refine OpenAPI/Swagger documentation with performance/security tags.
- [ ] Setup health check monitoring and alerting templates.
