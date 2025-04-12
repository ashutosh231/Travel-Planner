<?php
// Enable CORS for local development
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Database connection details
$host = "localhost";  // Change if your database is hosted elsewhere
$username = "root";   // Default XAMPP MySQL username
$password = "";       // Default is empty in XAMPP
$dbname = "tour_planner";  // Change to your actual database name

// Connect to the database
$conn = new mysqli($host, $username, $password, $dbname);

// Check for connection errors
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed"]));
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);
// Validate input
if (!$data || empty($data["name"]) || empty($data["email"]) || empty($data["password"]) || empty($data["phone"]) || empty($data["location"]) || empty($data["bio"]) || empty($data["gender"]) || empty($data["dob"])) {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit;
}

// Sanitize and assign input
$name = htmlspecialchars(strip_tags($data["name"]));
$email = htmlspecialchars(strip_tags($data["email"]));
$password = htmlspecialchars(strip_tags($data["password"]));
$hashed_password = password_hash($password, PASSWORD_DEFAULT); // Hash the password
$phone = htmlspecialchars(strip_tags($data["phone"]));
$location = htmlspecialchars(strip_tags($data["location"]));
$bio = htmlspecialchars(strip_tags($data["bio"]));
$gender = htmlspecialchars(strip_tags($data["gender"]));
$dob = htmlspecialchars(strip_tags($data["dob"]));

// Check if the email already exists
$query = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email already exists"]);
    exit;
}

// Insert user into the database
$query = "INSERT INTO users (name, email, password, hashed_password, phone, location, bio, gender, dob) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("sssssssss", $name, $email, $password, $hashed_password, $phone, $location, $bio, $gender, $dob);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User registered successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Registration failed"]);
}

// Close the connection
$stmt->close();
$conn->close();
?>
