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

if (!isset($data->email) || !isset($data->bookingId) || !isset($data->destination) || !isset($data->accommodation)) {
    echo json_encode(["status" => "error", "message" => "Missing required information"]);
    exit;
}

$email = $data->email;
$bookingId = $data->bookingId;
$destination = $data->destination;
$accommodation = $data->accommodation;
$totalCost = $data->totalCost ?? "0";
$checkIn = $data->checkIn ?? "Not specified";
$checkOut = $data->checkOut ?? "Not specified";

// Format dates if they're provided in ISO format
if (isset($data->checkIn) && strtotime($data->checkIn)) {
    $checkIn = date('d M Y', strtotime($data->checkIn));
}
if (isset($data->checkOut) && strtotime($data->checkOut)) {
    $checkOut = date('d M Y', strtotime($data->checkOut));
}

// Send confirmation email
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
    $mail->addAddress($email);
    $mail->isHTML(true);
    $mail->Subject = 'Your Booking Confirmation - ' . $bookingId;
    
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
            .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 12px;
                color: #777;
            }
            .cta-button {
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(135deg, #6e45e2, #88d3ce);
                color: white;
                text-decoration: none;
                border-radius: 30px;
                font-weight: bold;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Booking Confirmation</h1>
                <p>Thank you for booking with Travel Planner!</p>
            </div>
            
            <p>Dear Traveler,</p>
            <p>We're excited to confirm your booking. Get ready for an amazing adventure!</p>
            
            <div class='booking-details'>
                <div class='booking-id'>Booking ID: $bookingId</div>
                
                <div class='detail-row'>
                    <span class='detail-label'>Destination:</span> $destination
                </div>
                
                <div class='detail-row'>
                    <span class='detail-label'>Accommodation:</span> $accommodation
                </div>
                
                <div class='detail-row'>
                    <span class='detail-label'>Check-in Date:</span> $checkIn
                </div>
                
                <div class='detail-row'>
                    <span class='detail-label'>Check-out Date:</span> $checkOut
                </div>
                
                <div class='detail-row'>
                    <span class='detail-label'>Total Amount:</span> Rs. $totalCost
                </div>
                
                <div class='detail-row'>
                    <span class='detail-label'>Payment Status:</span> <span style='color: green; font-weight: bold;'>CONFIRMED</span>
                </div>
            </div>
            
            <p>We've received your payment and your booking is now confirmed. You can find all the details of your trip by logging into your account.</p>
            
            <div style='text-align: center;'>
                <a href='http://localhost/img/Travel-Planner/Frontend/' class='cta-button'>View My Bookings</a>
            </div>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our customer support team.</p>
            
            <p>Wishing you a wonderful journey!</p>
            
            <p>Best regards,<br>The Travel Planner Team</p>
            
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
        "message" => "Booking confirmation has been sent to your email"
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "status" => "error", 
        "message" => "Failed to send confirmation: " . $mail->ErrorInfo
    ]);
}
?>
