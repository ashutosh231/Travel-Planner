<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

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

// Check if reviews table exists
$tableCheck = $conn->query("SHOW TABLES LIKE 'reviews'");
if ($tableCheck->num_rows == 0) {
    echo json_encode(["status" => "success", "reviews" => [], "count" => 0, "message" => "No reviews table found"]);
    exit();
}

// Optional filter parameters
$destination = isset($_GET['destination']) ? $_GET['destination'] : '';
$rating = isset($_GET['rating']) ? intval($_GET['rating']) : 0;

// Build query based on filters
$sql = "SELECT r.*, u.name as user_name 
        FROM reviews r
        LEFT JOIN users u ON r.user_email = u.email
        WHERE 1=1";

$params = [];
$types = "";

if (!empty($destination)) {
    $sql .= " AND r.destination LIKE ?";
    $params[] = "%$destination%";
    $types .= "s";
}

if ($rating > 0) {
    $sql .= " AND r.rating = ?";
    $params[] = $rating;
    $types .= "i";
}

$sql .= " ORDER BY r.created_at DESC";

// Execute query
if (count($params) > 0) {
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $result = $conn->query($sql);
}

// Process results
if ($result) {
    $reviews = [];
    while ($row = $result->fetch_assoc()) {
        // Format dates for better readability
        $row['created_at_formatted'] = date("M d, Y", strtotime($row['created_at']));
        $reviews[] = $row;
    }
    
    echo json_encode([
        "status" => "success", 
        "reviews" => $reviews,
        "count" => count($reviews)
    ]);
} else {
    echo json_encode([
        "status" => "error", 
        "message" => "Failed to retrieve reviews: " . $conn->error
    ]);
}

if (isset($stmt)) {
    $stmt->close();
}
$conn->close();
?>
