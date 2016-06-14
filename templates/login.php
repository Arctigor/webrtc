<link rel="stylesheet" type="text/css" href="assets/css/form.css">
<div class="menu">
  <form action="formLogin" method="POST">
  <label>Username:  <label>
  <input type="text" name="username" class="inputBoxClass" placeholder="Username">
 
  <br>
  <br>
  <label>Password: </label>
  <input type="password" name="password" class="inputBoxClass" placeholder="Enter your password">
  
  <br>
  <input type="submit" class="submitButtonClass" value="Submit">
</form>
	<label class="errorMessage"><br>
	<?php 	
	if(isset($_SESSION['error']) && $_SESSION['error'] != ""){
			print_r($_SESSION['error']);
			$_SESSION['error'] = "";
		}
		?>
	</label>
</div>
