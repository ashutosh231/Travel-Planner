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

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]));
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->bookingId)) {
    echo json_encode(["status" => "error", "message" => "Missing booking ID"]);
    exit;
}

$bookingId = $data->bookingId;

// Get booking details
$bookingStmt = $conn->prepare("SELECT * FROM bookings WHERE booking_id = ?");
$bookingStmt->bind_param("s", $bookingId);
$bookingStmt->execute();
$bookingResult = $bookingStmt->get_result();

if ($bookingResult->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Booking not found"]);
    exit;
}

$booking = $bookingResult->fetch_assoc();

// Get admin emails
$adminStmt = $conn->prepare("SELECT email FROM users WHERE is_admin = 1");
$adminStmt->execute();
$adminResult = $adminStmt->get_result();

if ($adminResult->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "No admin users found"]);
    exit;
}

$adminEmails = [];
while ($admin = $adminResult->fetch_assoc()) {
    $adminEmails[] = $admin["email"];
}

// Send notification email to admins
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
    $mail->setFrom('adiashuto30@gmail.com', 'Travel Planner System');
    
    foreach ($adminEmails as $adminEmail) {
        $mail->addAddress($adminEmail);
    }
    
    $mail->isHTML(true);
    $mail->Subject = 'New Booking Received - ' . $bookingId;
    
    // Create an HTML email template for admins
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
                background: linear-gradient(135deg, #24292e, #0366d6);
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
                color: #0366d6;
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
            .action-buttons {
                text-align: center;
                margin-top: 20px;
            }
            .action-button {
                display: inline-block;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 0 10px;
            }
            .approve-button {
                background-color: #28a745;
                color: white;
            }
            .review-button {
                background-color: #0366d6;
                color: white;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 12px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>New Booking Alert</h1>
                <p>A new booking requires your attention</p>
            </div>
            
            <div style='padding: 20px;'>
                <p><strong>A new booking has been submitted and requires your review.</strong></p>
                
                <div class='booking-details'>
                    <div class='booking-id'>Booking ID: {$booking['booking_id']}</div>
                    
                    <div class='detail-row'>
                        <span class='detail-label'>Customer:</span> {$booking['booked_by']}
                    </div>
                    
                    <div class='detail-row'>
                        <span class='detail-label'>Email:</span> {$booking['email']}
                    </div>
                    
                    <div class='detail-row'>
                        <span class='detail-label'>Destination:</span> {$booking['destination']}
                    </div>
                    
                    <div class='detail-row'>
                        <span class='detail-label'>Accommodation:</span> {$booking['accommodation']}
                    </div>
                    
                    <div class='detail-row'>
                        <span class='detail-label'>Booking Date:</span> {$booking['booking_date']}
                    </div>
                    
                    <div class='detail-row'>
                        <span class='detail-label'>Total Amount:</span> ₹{$booking['total_cost']}
                    </div>
                </div>
                
                <div class='action-buttons'>
                    <a href='http://localhost/img/Travel-Planner/Frontend/#/admin' class='action-button review-button'>Review Booking</a>
                </div>
                
                <p style='margin-top: 30px;'>Please log in to the admin dashboard to review and approve/reject this booking.</p>
            </div>
            
            <div class='footer'>
                <p>This is an automated message from the Travel Planner System.</p>
                <p>© " . date('Y') . " Travel Planner. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    ";

    $mail->send();
    echo json_encode([
        "status" => "success", 
        "message" => "Admin notification sent successfully"
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "status" => "error", 
        "message" => "Failed to send admin notification: " . $mail->ErrorInfo
    ]);
}

$bookingStmt->close();
$adminStmt->close();
$conn->close();
?>
