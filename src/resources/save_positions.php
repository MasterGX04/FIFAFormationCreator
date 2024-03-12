<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // To handle the preflight OPTIONS request
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Define the path to the JSON file
    $jsonFile = __DIR__ . './saved_formations/positions.json';

    
    // Read the current content of the file
    $currentData = file_get_contents($jsonFile);
    $currentData = $currentData ? json_decode($currentData, true) : [];

    // Read the JSON data from the request body
    $jsonData = file_get_contents('php://input');

    // Decode JSON data
    $data = json_decode($jsonData, true);

    // Check if JSON decoding was successful
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(array('error' => 'Invalid JSON data'));
        exit;
    }

    // Extract formation data
    $formationData = isset($data['dropFormation']) ? $data['dropFormation'] : null;
    if ($formationData) {
        // Insert the formation at the beginning of the current data array
        array_unshift($currentData, $formationData);
    }

    $currentData = array_merge($currentData, $data);

    // Encode the data back to JSON format with pretty printing
    $jsonData = json_encode($data, JSON_PRETTY_PRINT);

    // Write the JSON data to the positions.json file
    if (file_put_contents($jsonFile, $jsonData) !== false) {
        echo json_encode(array('success' => 'Positions saved successfully'));
    } else {
        http_response_code(500);
        echo json_encode(array('error' => 'Failed to save positions'));
    }
}
?>