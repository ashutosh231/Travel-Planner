<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
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

// Get JSON input
$data = json_decode(file_get_contents("php://input"));

if (isset($data->email) && isset($data->otp) && isset($data->password)) {
    $email = $data->email;
    $otp = $data->otp;
    $newPassword = $data->password;

    // Validate input
    if (strlen($newPassword) < 8) {
        echo json_encode(["status" => "error", "message" => "Password must be at least 8 characters long"]);
        $conn->close();
        exit;
    }

    // Get user ID
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $userId = $user['id'];
        
        // Check if OTP is valid
        $otpStmt = $conn->prepare("SELECT * FROM password_reset WHERE user_id = ? AND otp = ? AND expiry > NOW()");
        $otpStmt->bind_param("is", $userId, $otp);
        $otpStmt->execute();
        $otpResult = $otpStmt->get_result();
        
        if ($otpResult->num_rows > 0) {
            // Hash the new password
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
            
            // Update user's password
            $updateStmt = $conn->prepare("UPDATE users SET hashed_password = ? WHERE id = ?");
            $updateStmt->bind_param("si", $hashedPassword, $userId);
            
            if ($updateStmt->execute()) {
                // Delete the OTP record after successful password reset
                $deleteStmt = $conn->prepare("DELETE FROM password_reset WHERE user_id = ?");
                $deleteStmt->bind_param("i", $userId);
                $deleteStmt->execute();
                
                echo json_encode([
                    "status" => "success",
                    "message" => "Password has been reset successfully"
                ]);
                
                $deleteStmt->close();
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Failed to update password: " . $conn->error
                ]);
            }
            
            $updateStmt->close();
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Invalid or expired OTP. Please request a new one."
            ]);
        }
        
        $otpStmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "User not found"]);
    }
    
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
}

// Close database connection
$conn->close();
?>
