<?php

if (session_id() == "")
    session_start();

$post = imagecreatetruecolor(500, 500);

$dir_path = "img/" . session_id();

$dir = @opendir($dir_path);

$file = readdir($dir);
$file = readdir($dir);

for ($i = 0; $i < 5; $i++) {
    for ($j = 0; $j < 5; $j++) {
        $file = readdir($dir);
        if ($file !== false) {
            $img = imagecreatefromjpeg($dir_path . "/" . $file);
            imagecopy($post, $img, $j * 100, $i * 100, 0, 0, 100, 100);
            imagedestroy($img);
        }
    }
}
closedir($dir);

$name = $dir_path . "/post.jpg";

imagejpeg($post, $name);

echo $name;

imagedestroy($post);
?>