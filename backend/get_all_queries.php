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

// Get queries with optional filter
$status = isset($_GET['status']) ? $_GET['status'] : '';

if (!empty($status) && ($status == 'pending' || $status == 'answered')) {
    // Get queries by status
    $stmt = $conn->prepare("SELECT * FROM user_queries WHERE status = ? ORDER BY created_at DESC");
    $stmt->bind_param("s", $status);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    // Get all queries
    $result = $conn->query("SELECT * FROM user_queries ORDER BY created_at DESC");
}

$queries = [];
while ($row = $result->fetch_assoc()) {
    $queries[] = $row;
}

echo json_encode(["status" => "success", "queries" => $queries]);

$conn->close();
?>
