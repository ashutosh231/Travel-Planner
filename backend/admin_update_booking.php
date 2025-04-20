<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Include PHPMailer
require __DIR__ . '/../PHPMailer/src/Exception.php';
require __DIR__ . '/../PHPMailer/src/PHPMailer.php';
require __DIR__ . '/../PHPMailer/src/SMTP.php';

// Database connection
$servername = "localhost";
$username = "root"; 
$password = ""; 
$database = "tour_planner";

$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]));
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['adminEmail']) && isset($data['bookingId']) && isset($data['status'])) {
    $adminEmail = $conn->real_escape_string($data['adminEmail']);
    $bookingId = $conn->real_escape_string($data['bookingId']);
    $status = $conn->real_escape_string($data['status']);
    
    // Validate status value
    if (!in_array($status, ['pending', 'approved', 'rejected'])) {
        echo json_encode(["status" => "error", "message" => "Invalid status value"]);
        exit;
    }
    
    // First, verify this is an admin user
    $verifyStmt = $conn->prepare("SELECT is_admin FROM users WHERE email = ? AND is_admin = 1");
    $verifyStmt->bind_param("s", $adminEmail);
    $verifyStmt->execute();
    $verifyResult = $verifyStmt->get_result();
    
    if ($verifyResult->num_rows > 0) {
        // User is admin, proceed to update booking
        $updateStmt = $conn->prepare("UPDATE bookings SET admin_status = ? WHERE booking_id = ?");
        $updateStmt->bind_param("ss", $status, $bookingId);
        
        if ($updateStmt->execute()) {
            // Get the user's email and booking details associated with this booking
            $userStmt = $conn->prepare("SELECT email, destination, booking_date FROM bookings WHERE booking_id = ?");
            $userStmt->bind_param("s", $bookingId);
            $userStmt->execute();
            $userResult = $userStmt->get_result();
            $userEmail = null;
            $destination = null;
            $bookingDate = null;
            
            if ($userResult->num_rows > 0) {
                $userData = $userResult->fetch_assoc();
                $userEmail = $userData['email'];
                $destination = $userData['destination'];
                $bookingDate = $userData['booking_date'];
            }
            
            // Send email if status is rejected
            if ($status === "rejected") {
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
                    $mail->addAddress($userEmail);
                    $mail->isHTML(true);
                    $mail->Subject = 'Booking Cancellation - ' . $bookingId;
                    $mail->Body = "
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    margin: 0;
                                    padding: 0;
                                }
                                .email-container {
                                    max-width: 600px;
                                    margin: 20px auto;
                                    background: #ffffff;
                                    border-radius: 8px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                    overflow: hidden;
                                }
                                .header {
                                    background: linear-gradient(135deg, #ff6b6b, #f94d6a);
                                    color: white;
                                    text-align: center;
                                    padding: 20px;
                                }
                                .header h2 {
                                    margin: 0;
                                    font-size: 24px;
                                }
                                .content {
                                    padding: 20px;
                                    color: #333;
                                    line-height: 1.6;
                                }
                                .content p {
                                    margin: 10px 0;
                                }
                                .content strong {
                                    color: #f94d6a;
                                }
                                .footer {
                                    text-align: center;
                                    padding: 10px;
                                    background: #f4f4f4;
                                    color: #777;
                                    font-size: 12px;
                                }
                                .footer a {
                                    color: #f94d6a;
                                    text-decoration: none;
                                }
                            </style>
                        </head>
                        <body>
                            <div class='email-container'>
                                <div class='header'>
                                    <h2>Booking Cancellation</h2>
                                </div>
                                <div class='content'>
                                    <p>Dear User,</p>
                                    <p>We regret to inform you that your booking with ID <strong>$bookingId</strong> for the destination <strong>$destination</strong> on <strong>$bookingDate</strong> has been <span style='color: red;'>rejected by admin</span>.</p>
                                    <p>If you have any questions, please contact our support team.</p>
                                    <p>Regards,<br><strong>Travel Planner Team</strong></p>
                                </div>
                                <div class='footer'>
                                    <p>This is an automated message. Please do not reply to this email.</p>
                                    <p>Need help? <a href='http://localhost/img/Travel-Planner/Frontend/contact'>Contact Support</a></p>
                                </div>
                            </div>
                        </body>
                        </html>
                    ";

                    $mail->send();
                } catch (Exception $e) {
                    echo json_encode(["status" => "error", "message" => "Failed to send cancellation email: " . $mail->ErrorInfo]);
                    exit;
                }
            }
            
            echo json_encode([
                "status" => "success",
                "message" => "Booking status updated to " . $status,
                "userEmail" => $userEmail
            ]);
            
            $userStmt->close();
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Failed to update booking: " . $conn->error
            ]);
        }
        
        $updateStmt->close();
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Unauthorized access. Admin privileges required."
        ]);
    }
    
    $verifyStmt->close();
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Missing required parameters"
    ]);
}

$conn->close();
?>
