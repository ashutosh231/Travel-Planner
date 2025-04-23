CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(20) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    accommodation VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_booking_review (booking_id)
);
