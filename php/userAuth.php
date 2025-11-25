<?php

	$plainPassword = $_GET["password"];
    $userName = $_GET["userName"];
	require_once 'login.php';
	$conn = new mysqli($hostname, $username, $password, "ksmith");
	if ($conn->connect_error) {
                echo "<p>Connection Error!</p>";
                die ($conn->error);
        }
    else{
		$myQuery = "select password from users where userName='$userName'";
		$result = $conn->query($myQuery);
		// first check if we have the user
		if ($result->num_rows == 0) {
			echo "No user named $userName";
			die($conn->error);
		} else {
			// now get the hashed password
			$hashedPassword = ($result->fetch_object())->password;

			// check if the hashed password matches the
			// hash value of the given password
			if (password_verify ($plainPassword, $hashedPassword))
				// it is verified!!
				echo "Enter, $user_Name!";
			else 
				echo "Password invalid!";
		}
	}
?>