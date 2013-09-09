<?php

session_start();

$sid = session_id();

$dir = "img/" . $sid;
mkdir($dir);

// get list of urls of images
$urls = json_decode($_POST["urls"]);

// list of images pathes on server
$images = [];

foreach ($urls as $url) {

    if (getimagesize($url)["2"] == 2)
        $img = imagecreatefromjpeg($url);
    else
        $img = imagecreatefromgif($url);
    $x_y = imagesx($img);


    // $img clone for glitch-process
    $new_img = @imagecreatetruecolor($x_y, $x_y);

    $end = rand(3, 6);
    for ($i = 0; $i < $end; $i++) {
        imagecopy($new_img, $img, 0, 0, 0, 0, $x_y, $x_y);

        $k = rand(0, 2); //2 for nothing effect, only shift

        switch ($k) {
            case 0:
                imagefilter($new_img, IMG_FILTER_COLORIZE, rand(50, 160), rand(50, 160), rand(50, 160));
                // 50 - 160 to exclude very dark or very light
                break;
            case 1:
                imagefilter($new_img, IMG_FILTER_NEGATE);
                break;
        }

        $x = 0;
        $y = rand(0, imagesy($img));
        $height = rand(10, min(imagesy($img) - $y + 10, imagesy($img)/4)); // min height 10, max height 1/4 of whole image
        imagecopy($img, $new_img, $x + rand(0, 1) ? 0 : rand(-10, 10), $y, $x + rand(0, 1) ? 0 : rand(-5, 5), $y, $x_y, $height); // copy modified sector

    }


    $name = $dir . "/" . sha1(time() . $url) . ".jpg"; // generate sha1 for name of image, because maybe a few users

    array_push($images, $name); // add img path to list

    imagejpeg($img, $name);// save img

    imagedestroy($img); // free memory
    imagedestroy($new_img); // free memory
}

echo json_encode($images); // return list of images pathes in JSON

?>
