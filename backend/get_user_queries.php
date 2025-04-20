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

// Get user email from query parameter
$email = isset($_GET['email']) ? $_GET['email'] : '';

if (!empty($email)) {
    // Get queries for specific user
    $stmt = $conn->prepare("SELECT * FROM user_queries WHERE user_email = ? ORDER BY created_at DESC");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $queries = [];
    while ($row = $result->fetch_assoc()) {
        $queries[] = $row;
    }
    
    echo json_encode(["status" => "success", "queries" => $queries]);
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Email parameter is required"]);
}

$conn->close();
?>
