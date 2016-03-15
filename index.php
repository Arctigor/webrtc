<?php

ob_start();
session_start();

require_once(__DIR__ . "/application/App.php");

$app = new App();

ob_flush();
exit();
