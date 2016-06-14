<?php 	
	if(isset($_SESSION['history']) && $_SESSION['history'] != ""){
		foreach ($_SESSION['history'] as $history) {
			print_r($history['message']);
		}
	}
?>