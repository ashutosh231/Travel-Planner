<?php
// Database connection
$host = "localhost";
$username = "root";
$password = "";
$database = "tour_planner";

$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL to create table
$sql = "CREATE TABLE IF NOT EXISTS user_queries (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    reply TEXT NULL,
    status ENUM('pending', 'answered') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Table user_queries created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

$conn->close();
?>
