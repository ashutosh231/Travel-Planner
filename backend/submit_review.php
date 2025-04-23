<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database connection
$host = "localhost";
$username = "root";
$password = "";
$database = "tour_planner";

$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]));
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (!isset($data['booking_id']) || !isset($data['email']) || !isset($data['rating'])) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit();
}

$booking_id = $conn->real_escape_string($data['booking_id']);
$email = $conn->real_escape_string($data['email']);
$rating = intval($data['rating']);
$review_text = $conn->real_escape_string($data['review_text'] ?? '');
$destination = $conn->real_escape_string($data['destination'] ?? '');
$accommodation = $conn->real_escape_string($data['accommodation'] ?? '');

// Validate rating
if ($rating < 1 || $rating > 5) {
    echo json_encode(["status" => "error", "message" => "Rating must be between 1 and 5"]);
    exit();
}

// Check if review table exists, if not create it
$check_table_sql = "SHOW TABLES LIKE 'reviews'";
$table_result = $conn->query($check_table_sql);

if ($table_result->num_rows == 0) {
    // Create reviews table
    $create_table_sql = "CREATE TABLE reviews (
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
    )";
    
    if (!$conn->query($create_table_sql)) {
        echo json_encode(["status" => "error", "message" => "Failed to create reviews table: " . $conn->error]);
        exit();
    }
}

// Check if review exists for this booking
$check_sql = "SELECT id FROM reviews WHERE booking_id = ?";
$check_stmt = $conn->prepare($check_sql);
$check_stmt->bind_param("s", $booking_id);
$check_stmt->execute();
$check_result = $check_stmt->get_result();

if ($check_result->num_rows > 0) {
    // Update existing review
    $update_sql = "UPDATE reviews SET rating = ?, review_text = ?, updated_at = CURRENT_TIMESTAMP WHERE booking_id = ?";
    $update_stmt = $conn->prepare($update_sql);
    $update_stmt->bind_param("iss", $rating, $review_text, $booking_id);
    
    if ($update_stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Your review has been updated!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update review: " . $conn->error]);
    }
    
    $update_stmt->close();
} else {
    // Insert new review
    $insert_sql = "INSERT INTO reviews (booking_id, user_email, destination, accommodation, rating, review_text) 
                   VALUES (?, ?, ?, ?, ?, ?)";
    $insert_stmt = $conn->prepare($insert_sql);
    $insert_stmt->bind_param("ssssis", $booking_id, $email, $destination, $accommodation, $rating, $review_text);
    
    if ($insert_stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Thank you for your review!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to submit review: " . $conn->error]);
    }
    
    $insert_stmt->close();
}

$check_stmt->close();
$conn->close();
?>
