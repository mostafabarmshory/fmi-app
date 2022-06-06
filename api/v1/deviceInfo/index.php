<?php
if (! array_key_exists('imei', $_GET)) {
    echo 'Fail';
    return;
}
$imei = $_GET['imei'];

// call
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://181.174.164.148:8766/api/v1/devices/" . $imei);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$output = curl_exec($ch);
curl_close($ch);

header('Content-Type: application/json');
echo $output;
