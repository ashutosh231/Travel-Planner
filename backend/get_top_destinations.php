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
    // Fetch top destinations based on bookings and revenue
    $sql = "
        SELECT destination AS name, COUNT(*) AS bookings, SUM(total_cost) AS revenue
        FROM bookings
        WHERE admin_status = 'approved'
        GROUP BY destination
        ORDER BY bookings DESC
        LIMIT 5
    ";

    $result = $conn->query($sql);

    if ($result === false) {
        throw new Exception("Error executing query: " . $conn->error);
    }

    $destinations = [];
    while ($row = $result->fetch_assoc()) {
        $destinations[] = $row;
    }

    echo json_encode(["status" => "success", "destinations" => $destinations]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$conn->close();
?>
