<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Include PHPMailer
require __DIR__ . '/../PHPMailer/src/Exception.php';
require __DIR__ . '/../PHPMailer/src/PHPMailer.php';
require __DIR__ . '/../PHPMailer/src/SMTP.php';

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

if (isset($data->email)) {
    $email = $data->email;

    // Check if user exists
    $stmt = $conn->prepare("SELECT id, name FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($userId, $name);
        $stmt->fetch();

        // Generate a random 6-digit OTP
        $otp = rand(100000, 999999);
        $expiry = date('Y-m-d H:i:s', strtotime('+15 minutes')); // OTP valid for 15 minutes

        // Store OTP in database (first check if there's already an entry)
        $checkStmt = $conn->prepare("SELECT * FROM password_reset WHERE user_id = ?");
        $checkStmt->bind_param("i", $userId);
        $checkStmt->execute();
        $checkStmt->store_result();

        if ($checkStmt->num_rows > 0) {
            // Update existing OTP
            $updateStmt = $conn->prepare("UPDATE password_reset SET otp = ?, expiry = ? WHERE user_id = ?");
            $updateStmt->bind_param("ssi", $otp, $expiry, $userId);
            $updateStmt->execute();
            $updateStmt->close();
        } else {
            // Insert new OTP
            $insertStmt = $conn->prepare("INSERT INTO password_reset (user_id, otp, expiry) VALUES (?, ?, ?)");
            $insertStmt->bind_param("iss", $userId, $otp, $expiry);
            $insertStmt->execute();
            $insertStmt->close();
        }
        $checkStmt->close();

        // Send email with OTP
        $mail = new PHPMailer(true);
        try {
            // SMTP Configuration
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'adiashuto30@gmail.com';
            $mail->Password = 'wzxp bttm rrvu yrcl';
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;

            // Email content
            $mail->setFrom('adiashuto30@gmail.com', 'Travel Planner');
            $mail->addAddress($email, $name);
            $mail->isHTML(true);
            $mail->Subject = 'Password Recovery OTP';
            $mail->Body = "
                <h2>Password Recovery</h2>
                <p>Hello {$name},</p>
                <p>We received a request to recover your password. Please use the following OTP to verify your identity:</p>
                <h3 style='background-color: #f2f2f2; padding: 10px; font-size: 24px; letter-spacing: 5px;'>{$otp}</h3>
                <p>This OTP will expire in 15 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <p>Regards,<br>Travel Planner Team</p>
            ";

            $mail->send();
            echo json_encode(["status" => "success", "message" => "OTP sent to your email"]);
        } catch (Exception $e) {
            echo json_encode(["status" => "error", "message" => "Failed to send OTP: " . $mail->ErrorInfo]);
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
