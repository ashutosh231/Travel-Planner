<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Database configuration
$host = "localhost";
$username = "root";
$password = "";
$database = "tour_planner";

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        'status' => 'error',
        'message' => 'Connection failed: ' . $conn->connect_error
    ]));
}

// Query to get top rated destinations
// This joins the reviews and bookings tables to get ratings and destinations
$sql = "SELECT 
            r.destination as name, 
            COUNT(r.id) as reviewCount, 
            AVG(r.rating) as average_rating, 
            COUNT(DISTINCT b.booking_id) as bookingCount,
            AVG(b.total_cost) as avgCost,
            (
                SELECT accommodation 
                FROM bookings 
                WHERE destination = r.destination 
                GROUP BY accommodation 
                ORDER BY COUNT(*) DESC 
                LIMIT 1
            ) as popular_accommodation
        FROM 
            reviews r
        JOIN 
            bookings b ON r.destination = b.destination
        GROUP BY 
            r.destination
        ORDER BY 
            AVG(r.rating) DESC
        LIMIT 10";

$result = $conn->query($sql);

if ($result) {
    $destinations = [];
    while ($row = $result->fetch_assoc()) {
        // Format the average rating to 1 decimal place
        $row['average_rating'] = number_format($row['average_rating'], 1);
        $destinations[] = $row;
    }
    
    echo json_encode([
        'status' => 'success',
        'destinations' => $destinations
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error fetching top rated destinations: ' . $conn->error
    ]);
}

$conn->close();
?>
