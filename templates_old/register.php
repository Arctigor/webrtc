<div class="content">
  <form action="formRegister" method="POST">
  Username<br>
  <input type="text" name="username" placeholder="Username"><br>
  Email<br>
  <input type="text" name="email" placeholder="emailname@example.com"><br>
  Password<br>
  <input type="password" name="password" placeholder="Enter your password"><br>
  Confirm Password<br>
  <input type="password" name="confirm-password" placeholder="Enter your password"><br><br>
  <input type="submit" value="Register">
</form>
	<?php 	
		if(isset($_SESSION['error']) && $_SESSION['error'] != ""){
			print_r($_SESSION['error']);
			$_SESSION['error'] = "";
		}
	?>
</div>
