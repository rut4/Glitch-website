<?php
$url = $_POST["url"];
$photo_url = $_POST["photo_url"];

$photo['photo'] = "@" . realpath($photo_url);

$curl = curl_init(urldecode($url));
curl_setopt($curl, CURLOPT_POST, 1);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curl, CURLOPT_POSTFIELDS, $photo);
$s = curl_exec($curl);
curl_close($curl);

$result = $s;

echo $result;
?>
