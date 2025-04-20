<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

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

// Get the admin email from request to verify admin status
$data = json_decode(file_get_contents("php://input"), true);
$adminEmail = isset($data['email']) ? $data['email'] : null;

// If no email in POST data, check GET parameter
if (!$adminEmail && isset($_GET['email'])) {
    $adminEmail = $_GET['email'];
}

// Debug log
file_put_contents("php://stderr", "Admin Email: " . $adminEmail . "\n");

if ($adminEmail) {
    // First, verify this is an admin user
    $verifyStmt = $conn->prepare("SELECT is_admin FROM users WHERE email = ?");
    $verifyStmt->bind_param("s", $adminEmail);
    $verifyStmt->execute();
    $verifyResult = $verifyStmt->get_result();
    
    if ($verifyResult->num_rows > 0) {
        $userData = $verifyResult->fetch_assoc();
        $isAdmin = $userData['is_admin'];
        
        // Debug log
        file_put_contents("php://stderr", "Is Admin: " . $isAdmin . "\n");
        
        if ($isAdmin == 1) {
            // User is admin, proceed to get all bookings regardless of admin_status column existence
            // Check if admin_status column exists in bookings table
            $columnsQuery = "SHOW COLUMNS FROM bookings LIKE 'admin_status'";
            $columnsResult = $conn->query($columnsQuery);
            
            if ($columnsResult->num_rows > 0) {
                // Column exists, use it in the query
                $query = "SELECT b.*, u.name, u.email as user_email, u.phone 
                         FROM bookings b 
                         LEFT JOIN users u ON b.email = u.email 
                         ORDER BY b.booking_id DESC";
            } else {
                // Column doesn't exist, modify query to exclude it
                $query = "SELECT b.*, u.name, u.email as user_email, u.phone 
                         FROM bookings b 
                         LEFT JOIN users u ON b.email = u.email 
                         ORDER BY b.booking_id DESC";
                
                // Debug - warning that column is missing
                file_put_contents("php://stderr", "Warning: admin_status column does not exist in bookings table\n");
            }
            
            // Debug log query
            file_put_contents("php://stderr", "SQL Query: " . $query . "\n");
            
            $result = $conn->query($query);
            
            if ($result) {
                $bookings = [];
                $count = 0;
                
                while ($row = $result->fetch_assoc()) {
                    // Add admin_status if it doesn't exist
                    if (!isset($row['admin_status'])) {
                        $row['admin_status'] = 'pending';
                    }
                    
                    $bookings[] = $row;
                    $count++;
                }
                
                // Debug log
                file_put_contents("php://stderr", "Bookings found: " . $count . "\n");
                
                echo json_encode([
                    "status" => "success",
                    "bookings" => $bookings,
                    "count" => $count
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Failed to retrieve bookings: " . $conn->error
                ]);
            }
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Unauthorized access. Admin privileges required."
            ]);
        }
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "User not found with email: " . $adminEmail
        ]);
    }
    
    $verifyStmt->close();
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Admin email is required"
    ]);
}

$conn->close();
?>
