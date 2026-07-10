<?php
// Stelle sicher, dass diese URL auf deinen RSS-Feed zeigt
// $targetUrl = 'https://www.bernardteske.de/aktuelles/rss.php';
$targetUrl = $_GET['feed'];

// Holen die Daten vom Zielserver
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $targetUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Verzichte auf SSL-Verifizierung
$response = curl_exec($ch);
curl_close($ch);

// Senden die Antwort zurück an den Client
header('Content-Type: text/xml;charset=UTF-8');

echo $response;
?>
