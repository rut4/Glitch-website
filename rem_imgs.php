<?php

function rmdir_not_empty($directory) {
    $dir = opendir($directory);
    while(($file = readdir($dir))) {
        unlink ($directory . "/" . $file);
    }
    closedir($dir);
    sleep(1);
    rmdir($directory);
}
if (session_id() == "")
    session_start();

$dir = "img/" . session_id();
if (file_exists($dir))
    rmdir_not_empty($dir);




?>
