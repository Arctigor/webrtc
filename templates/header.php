<html>
<title>WebRTC</title>

<head>
</head>
<body>
	<link rel="stylesheet" href="/assets/css/header.css" />
	<div class="container">
		<?php 	
		if(!isset($_SESSION['username'])){
	?>
		<div>
			<ul>
				<li><a href="/loginWithFb">Login with Fb</a>
				</li>
				<li><a href="/login">Login</a>
				</li>
				<li><a href="/register">Register</a>
				</li>
				<li><a href="/home">Home</a>
				</li>
			</ul>
		</div>
		<?php 
		}else{
	?>
		<div>
			<ul>
				<li><a href="/logout">Logout</a>
				</li>
				<li><a href="/home">Home</a>
				</li>
			</ul>
		</div>
		<?php }	?>
	</div>