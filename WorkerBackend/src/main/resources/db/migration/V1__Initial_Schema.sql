CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50),
    display_name VARCHAR(255),
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_dealer_verified BOOLEAN DEFAULT FALSE,
    refresh_token VARCHAR(1000),
    failed_login_attempts INT DEFAULT 0,
    account_non_locked BOOLEAN DEFAULT TRUE,
    lock_time TIMESTAMP WITHOUT TIME ZONE
);

CREATE INDEX idx_user_failed_login ON users(failed_login_attempts);
CREATE INDEX idx_user_lock_time ON users(lock_time);
