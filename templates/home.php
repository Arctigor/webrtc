<link rel="stylesheet" type="text/css" href="assets/css/header.css">
<div>
<label class="successMessage">
	<?php 	
		if(isset($_SESSION['success']) && $_SESSION['success'] != ""){
			print_r($_SESSION['success']);
			$_SESSION['success'] = "";
		}
	?>
</label>
</div>
