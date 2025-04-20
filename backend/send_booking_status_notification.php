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

// Get JSON input
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->bookingId) || !isset($data->status)) {
    echo json_encode(["status" => "error", "message" => "Missing required information"]);
    exit;
}

$email = $data->email;
$bookingId = $data->bookingId;
$status = $data->status;
$adminEmail = $data->adminEmail ?? "admin@travelplanner.com";

// Database connection to get booking details
$servername = "localhost";
$username = "root";
$password = "";
$database = "tour_planner";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]));
}

// Get booking details
$stmt = $conn->prepare("SELECT destination, accommodation, total_cost, booking_date FROM bookings WHERE booking_id = ?");
$stmt->bind_param("s", $bookingId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Booking not found"]);
    exit;
}

$booking = $result->fetch_assoc();
$destination = $booking["destination"];
$accommodation = $booking["accommodation"];
$totalCost = $booking["total_cost"];
$bookingDate = date('d M Y', strtotime($booking["booking_date"]));

// Get user's name
$userStmt = $conn->prepare("SELECT name FROM users WHERE email = ?");
$userStmt->bind_param("s", $email);
$userStmt->execute();
$userResult = $userStmt->get_result();

$userName = "Traveler";
if ($userResult->num_rows > 0) {
    $userData = $userResult->fetch_assoc();
    $userName = $userData["name"];
}

// Send status update email
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
    $mail->addAddress($email, $userName);
    $mail->isHTML(true);
    
    if ($status === "approved") {
        $mail->Subject = 'Good News! Your Booking Has Been Approved - ' . $bookingId;
        $statusColor = "#4CAF50"; // Green
        $statusMessage = "Your booking has been <strong>approved</strong>! You're all set for an amazing trip.";
        $nextSteps = "Our team is preparing everything for your arrival. You'll receive a confirmation email with additional details soon.";
    } else if ($status === "rejected") {
        $mail->Subject = 'Important Update About Your Booking - ' . $bookingId;
        $statusColor = "#F44336"; // Red
        $statusMessage = "We regret to inform you that your booking has been <strong>declined</strong>.";
        $nextSteps = "Please contact our customer support team for more information about why your booking was declined and how we can help you with alternative arrangements.";
    } else {
        $mail->Subject = 'Your Booking Status Update - ' . $bookingId;
        $statusColor = "#FFC107"; // Yellow/amber
        $statusMessage = "Your booking is currently <strong>pending review</strong>.";
        $nextSteps = "Our team is reviewing your booking and will get back to you shortly.";
    }
    
    // Create an attractive HTML email template
    $mail->Body = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            .header {
                background: linear-gradient(135deg, #6e45e2, #88d3ce);
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 5px 5px 0 0;
            }
            .booking-details {
                background-color: #f9f9f9;
                padding: 20px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .booking-id {
                font-size: 24px;
                font-weight: bold;
                color: #6e45e2;
                margin-bottom: 15px;
            }
            .detail-row {
                padding: 10px 0;
                border-bottom: 1px solid #eee;
            }
            .detail-label {
                font-weight: bold;
                color: #555;
            }
            .status-badge {
                background-color: {$statusColor};
                color: white;
                padding: 8px 15px;
                border-radius: 20px;
                font-weight: bold;
                display: inline-block;
                margin-bottom: 10px;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 12px;
                color: #777;
            }
            .contact-button {
                display: inline-block;
                padding: 12px 20px;
                background-color: #6e45e2;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Booking Status Update</h1>
            </div>
            
            <div style='padding: 20px;'>
                <p>Dear {$userName},</p>
                <p>{$statusMessage}</p>
                
                <div class='booking-details'>
                    <div class='booking-id'>Booking ID: {$bookingId}</div>
                    
                    <div class='detail-row'>
                        <span class='detail-label'>Destination:</span> {$destination}
                    </div>
                    
                    <div class='detail-row'>
                        <span class='detail-label'>Accommodation:</span> {$accommodation}
                    </div>
                    
                    <div class='detail-row'>
                        <span class='detail-label'>Booking Date:</span> {$bookingDate}
                    </div>
                    
                    <div class='detail-row'>
                        <span class='detail-label'>Total Amount:</span> ₹{$totalCost}
                    </div>
                    
                    <div class='detail-row'>
                        <span class='detail-label'>Status:</span> <span class='status-badge'>{$status}</span>
                    </div>
                </div>
                
                <p><strong>Next Steps:</strong></p>
                <p>{$nextSteps}</p>
                
                <div style='text-align: center; margin-top: 30px;'>
                    <a href='http://localhost/img/Travel-Planner/Frontend/' class='contact-button'>Go to My Bookings</a>
                </div>
                
                <p style='margin-top: 30px;'>If you have any questions, please don't hesitate to contact our customer support team.</p>
                
                <p>Best regards,<br>The Travel Planner Team</p>
            </div>
            
            <div class='footer'>
                <p>This is an automated message, please do not reply to this email.</p>
                <p>© " . date('Y') . " Travel Planner. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    ";

    $mail->send();
    echo json_encode([
        "status" => "success", 
        "message" => "Status notification has been sent to the user's email"
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "status" => "error", 
        "message" => "Failed to send notification: " . $mail->ErrorInfo
    ]);
}

$stmt->close();
$userStmt->close();
$conn->close();
?>
