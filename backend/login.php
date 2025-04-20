<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection
$host = "localhost"; // Change if necessary
$username = "root"; // Your MySQL username
$password = ""; // Your MySQL password
$database = "tour_planner"; // Change this to your actual database name

$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]));
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"));

if (isset($data->email) && isset($data->password)) {
    $email = $data->email;
    $password = $data->password;

    // Debugging - Log attempt (remove in production)
    error_log("Login attempt: $email with password: $password");

    // Prepare and execute SQL query - check for is_admin status
    $stmt = $conn->prepare("SELECT id, password, hashed_password, is_admin FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $stored_password, $hashed_password, $is_admin);
        $stmt->fetch();

        // For debugging - check what's stored (remove in production)
        error_log("Stored Password: $stored_password");
        error_log("Hashed Password: $hashed_password");
        error_log("Is Admin: $is_admin");

        // Try first with password_verify (for proper hashed passwords)
        $password_verified = false;
        
        if ($hashed_password && password_verify($password, $hashed_password)) {
            $password_verified = true;
        } 
        // Fallback to direct comparison (for testing or if plain text stored)
        else if ($password === $stored_password) {
            $password_verified = true;
        }

        if ($password_verified) {
            echo json_encode([
                "status" => "success",
                "message" => "Login successful",
                "token" => md5(uniqid()),
                "email" => $email,
                "is_admin" => $is_admin ? true : false
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "User not found"]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
}

// Close database connection
$conn->close();
?>
