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

if (isset($data->email) && isset($data->otp)) {
    $email = $data->email;
    $otp = $data->otp;

    // Get user ID
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $userId = $user['id'];
        
        // First check if any OTP exists for this user
        $checkStmt = $conn->prepare("SELECT * FROM password_reset WHERE user_id = ?");
        $checkStmt->bind_param("i", $userId);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows === 0) {
            echo json_encode(["status" => "error", "message" => "No OTP request found. Please request a new OTP."]);
            $checkStmt->close();
            $stmt->close();
            $conn->close();
            exit;
        }
        
        // Now check if the provided OTP is correct and not expired
        $otpStmt = $conn->prepare("SELECT otp, expiry FROM password_reset WHERE user_id = ?");
        $otpStmt->bind_param("i", $userId);
        $otpStmt->execute();
        $otpResult = $otpStmt->get_result();
        $otpData = $otpResult->fetch_assoc();
        
        // Debug: Let's check the actual values for troubleshooting
        if ($otpData) {
            $storedOtp = $otpData['otp'];
            $expiryTime = $otpData['expiry'];
            $currentTime = date('Y-m-d H:i:s');
            
            if ($storedOtp === $otp) {
                if ($currentTime <= $expiryTime) {
                    // OTP is valid and not expired
                    $passStmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
                    $passStmt->bind_param("i", $userId);
                    $passStmt->execute();
                    $passResult = $passStmt->get_result();
                    $user = $passResult->fetch_assoc();
                    
                    // Clear the OTP after successful verification
                    $clearStmt = $conn->prepare("DELETE FROM password_reset WHERE user_id = ?");
                    $clearStmt->bind_param("i", $userId);
                    $clearStmt->execute();
                    
                    echo json_encode([
                        "status" => "success",
                        "message" => "OTP verified successfully",
                        "password" => $user['password']
                    ]);
                    
                    $passStmt->close();
                    $clearStmt->close();
                } else {
                    echo json_encode([
                        "status" => "error", 
                        "message" => "OTP has expired. Please request a new one."
                    ]);
                }
            } else {
                echo json_encode([
                    "status" => "error", 
                    "message" => "Invalid OTP. Please try again."
                ]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "No OTP found for this user"]);
        }
        
        $otpStmt->close();
        $checkStmt->close();
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
