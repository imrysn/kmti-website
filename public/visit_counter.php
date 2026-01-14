<?php
// Set headers to allow cross-origin requests (if frontend and backend are on different domains/ports during dev)
// In production on the same domain, this is less critical but good for safety.
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Cache-Control: no-cache, no-store, must-revalidate"); // Prevent caching

$filename = 'visits_data.json';

// Initialize default data structure
$defaultData = [
    'total' => 0,
    'today' => 0,
    'yesterday' => 0,
    'date' => date('Y-m-d')
];

// Check if data file exists, if not create it
if (!file_exists($filename)) {
    file_put_contents($filename, json_encode($defaultData));
}

// Read current data
$jsonData = file_get_contents($filename);
$data = json_decode($jsonData, true);

// Get current date
$currentDate = date('Y-m-d');

// Logic to handle day change
if ($data['date'] !== $currentDate) {
    // If the date stored is not today, move 'today' count to 'yesterday'
    $data['yesterday'] = $data['today'];
    $data['today'] = 0; // Reset today
    $data['date'] = $currentDate; // Update date
}

// Logic to handle new visit
// Simple cache busting/checking can be added here if we want to be more sophisticated 
// about unique visitors (e.g. by IP or session), but for a simple hit counter:
$data['total']++;
$data['today']++;

// Save updated data back to file
// Use DO_NOT_LOCK_EX for shared hosting environments that might not support flair locking well, 
// though LOCK_EX is safer for concurrency. We will try LOCK_EX.
file_put_contents($filename, json_encode($data), LOCK_EX);

// Return the stats to the frontend
echo json_encode([
    'total' => $data['total'],
    'today' => $data['today'],
    'yesterday' => $data['yesterday']
]);
?>
