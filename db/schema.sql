-- Conceptual relational schema for ER documentation.
-- Runtime persistence uses MongoDB/Mongoose models under Backend/src/models.

CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    assigned_center_id VARCHAR(36),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE washing_centers (
    center_id VARCHAR(36) PRIMARY KEY,
    center_name VARCHAR(120) NOT NULL,
    location VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(25) NOT NULL,
    operation_status VARCHAR(30) NOT NULL
);

ALTER TABLE users
    ADD CONSTRAINT fk_user_assigned_center
        FOREIGN KEY (assigned_center_id) REFERENCES washing_centers(center_id);

CREATE TABLE laundry_requests (
    request_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    washing_center_id VARCHAR(36),
    clothes_count INT NOT NULL CHECK (clothes_count >= 0),
    preferred_pickup_date TIMESTAMP NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_request_user
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_request_center
        FOREIGN KEY (washing_center_id) REFERENCES washing_centers(center_id)
);

CREATE TABLE concern_tickets (
    ticket_id VARCHAR(36) PRIMARY KEY,
    request_id VARCHAR(36) NOT NULL,
    raised_by_manager_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL,
    expected_count INT NOT NULL CHECK (expected_count >= 0),
    received_count INT NOT NULL CHECK (received_count >= 0),
    note TEXT,
    customer_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    confirmed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ticket_request
        FOREIGN KEY (request_id) REFERENCES laundry_requests(request_id),
    CONSTRAINT fk_ticket_manager
        FOREIGN KEY (raised_by_manager_id) REFERENCES users(user_id)
);

CREATE TABLE notifications (
    notification_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    request_id VARCHAR(36),
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_notification_request
        FOREIGN KEY (request_id) REFERENCES laundry_requests(request_id)
);
