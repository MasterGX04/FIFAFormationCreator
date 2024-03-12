<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header('Content-Type: application/json');
header("Access-Control-Allow-Credentials: true");

// Path to the positions.json file
$jsonFile = __DIR__ . './saved_formations/positions.json';

// Check if the file exists
if (file_exists($jsonFile)) {
    // Read the file contents
    $jsonData = file_get_contents($jsonFile);

    // Set the appropriate headers for JSON response
    header('Content-Type: application/json');

    // Echo the JSON data
    echo $jsonData;
} else {
    // If the file doesn't exist, return an error message
    http_response_code(404);
    echo json_encode(array('error' => 'Positions file not found'));
}