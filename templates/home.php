<div class="content">
	<?php 	
		if(isset($_SESSION['success']) && $_SESSION['success'] != ""){
			print_r($_SESSION['success']);
			$_SESSION['success'] = "";
		}
	?>
</div>
