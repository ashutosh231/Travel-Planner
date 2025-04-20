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

try {
    // Fetch users with their booking counts
    $sql = "SELECT u.id, u.name, u.email, u.created_at AS registration_date, 
            COUNT(b.id) AS bookings_count 
            FROM users u 
            LEFT JOIN bookings b ON u.email = b.email 
            GROUP BY u.id 
            ORDER BY u.created_at DESC";

    $result = $conn->query($sql);

    if ($result === false) {
        throw new Exception("Error executing query: " . $conn->error);
    }

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    echo json_encode($users);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$conn->close();
?>
