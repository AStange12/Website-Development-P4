<?php
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
    header('Content-Type: application/json');
    require_once 'login.php';
    $conn = new mysqli($hostname, $username, $password, "ksmith");
    if ($conn->connect_error) {
        echo json_encode(["error" => "Connection Error"]);
        exit;
    }
    $userName = $_GET["userName"];
    $myQuery = "select image_table from users where userName='$userName'";
    $result = $conn->query($myQuery);
    if (!$result) {
        echo json_encode([]);
        exit;
    } 
    else {
        $imageTable = ($result->fetch_object())->image_table;
        $myQuery = "select * from `$imageTable`";
        $result = $conn->query($myQuery);
        if (!$result) {
            echo json_encode(["error" => "Error in reading photo table"]);
            exit;
        } else {
            $photos = array();
            while ($row = $result->fetch_assoc()) {
                $photos[] = $row;
            }
            echo json_encode($photos);
            exit;
        }
    }
?>