<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$host = "localhost";
$username = "root"; 
$password = ""; 
$database = "tour_planner";

$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Get the user email from the request
$userEmail = null;

// First try to get it from the query parameter
if (isset($_GET['email'])) {
    $userEmail = $_GET['email'];
}
// If not found in query parameter, check POST data
else {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['email'])) {
        $userEmail = $data['email'];
    }
}

// If email is provided, fetch that specific user's data
if ($userEmail) {
    $stmt = $conn->prepare("SELECT name, email, phone, location, bio, gender, dob FROM users WHERE email = ?");
    $stmt->bind_param("s", $userEmail);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(["error" => "User not found"]);
    }
    
    $stmt->close();
} else {
    // Fallback to the old behavior if no email is provided (not recommended)
    $query = "SELECT name, email, phone, location, bio, gender, dob FROM users ORDER BY id DESC LIMIT 1";
    $result = $conn->query($query);
    
    if ($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(["error" => "No users found"]);
    }
}

$conn->close();
?>