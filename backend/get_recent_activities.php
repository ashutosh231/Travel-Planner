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
    // Fetch recent activities from bookings and queries
    $sql = "
        SELECT 'booking' AS type, b.booked_by AS user, b.destination AS detail, b.admin_status AS action, b.created_at AS time, NULL AS email
        FROM bookings b
        UNION
        SELECT 'query' AS type, q.user_name AS user, q.subject AS detail, q.status AS action, q.created_at AS time, q.user_email AS email
        FROM user_queries q
        UNION
        SELECT 'admin' AS type, q.user_name AS user, q.subject AS detail, 'answered' AS action, q.updated_at AS time, q.user_email AS email
        FROM user_queries q
        WHERE q.status = 'answered'
        ORDER BY time DESC
        LIMIT 10
    ";

    $result = $conn->query($sql);

    if ($result === false) {
        throw new Exception("Error executing query: " . $conn->error);
    }

    $activities = [];
    while ($row = $result->fetch_assoc()) {
        $activities[] = $row;
    }

    echo json_encode(["status" => "success", "activities" => $activities]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$conn->close();
?>
