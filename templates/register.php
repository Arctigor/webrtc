<link rel="stylesheet" type="text/css" href="assets/css/form.css">
<div class="menu">
	<form action="formRegister" method="POST">
		<label> Username: </label> <input type="text" name="username"
			class="inputBoxClass" placeholder="Username"><br> <br> <label> Email:
		</label> <input type="text" name="email" class="inputBoxClass"
			placeholder="emailname@example.com"><br> <br> <label>Password:</label>
		<input type="password" name="password" class="inputBoxClass"
			placeholder="Enter your password"><br> <br> <label>Confirm Password:</label>
		<input type="password" name="confirm-password" class="inputBoxClass"
			placeholder="Enter your password"><br> <br> <input type="submit"
			class="submitButtonClass" value="Register">
	</form>
	<label class="errorMessage">
	<?php 	
	if(isset($_SESSION['error']) && $_SESSION['error'] != ""){
			print_r($_SESSION['error']);
			$_SESSION['error'] = "";
		}
		?>
	</label>
</div>
