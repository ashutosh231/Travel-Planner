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

// Get user email from request
$email = isset($_GET['email']) ? $_GET['email'] : '';

if (empty($email)) {
    echo json_encode(["status" => "error", "message" => "Email parameter is required"]);
    exit();
}

// Get bookings with reviews data
$sql = "SELECT b.*, 
               CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END as has_review,
               r.rating,
               r.review_text
        FROM bookings b
        LEFT JOIN reviews r ON b.booking_id = r.booking_id
        WHERE b.email = ?
        ORDER BY b.booking_date DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $bookings = [];
    while ($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
    echo json_encode(["status" => "success", "bookings" => $bookings]);
} else {
    echo json_encode(["status" => "error", "message" => "No bookings found for this user"]);
}

$stmt->close();
$conn->close();
?>
