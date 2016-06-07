<?php

class Controller {

  public $path;
  public $routes;
  public $template;
  public $request;
  public $db_connection;

  public function __construct($request, $path, $routes, $db_connection) {
    $this->request = $request;
    $this->path = $path;
    $this->routes = $routes;
    $this->db_connection = $db_connection;
    $this->template = $routes[$path]['template'];
  }

  public function welcome() {}
  
  public function home() {
  	return array();
  }

  public function login() {
    return array();
  }
  
  public function loginWithFb(){
  	return array();
  }
  
  public function logout(){
  	$this->unsetCookie('id');
  	$this->unsetCookie('username');
	session_destroy();
	header("Location: /");
  }
  
  public function register() {
  	if(isset($_SESSION['error'])){
  	  return $_SESSION['error'];
  	}
  }
  
  public function formLogin() {
  	$connection = $this->getConnection();
  	$data = $_POST;
  	$username = "";
  	$password = "";
  	if(isset($data['fbId'])){
  		$userSql = "SELECT * FROM `user` WHERE facebookid="."'" . $data['fbId'] . "'";
		$userResult = $connection->query($userSql);
		$user = $userResult->fetch_object();
		if($user){
			$username = $user->username;
			$password = $user->password;
			$this->loginWith($username, $password, false);
		} else {
			$this->setSuccessMessage("Fb account is not connected to any registered account!");
		}
  	} else{
  		$username = $_POST['username'];
  		$password = $_POST['password'];
  		$this->loginWith($username, $password, true);
  		
  	}
  }
  
  public function loginWith($username, $password, $encoding){
  	$connection = $this->getConnection();
  	$userSql = "SELECT * FROM `user` WHERE username="."'" . $username . "'";
  	$userResult = $connection->query($userSql);
  	$user = $userResult->fetch_object();
  	if($user){
  		if($encoding){
  		$pass = $this->encode($password);
  		} else {
  			$pass = $password;
  		}
  		$loginSql = "SELECT * FROM `user` WHERE username="."'" . $username . "' AND " . "password='".$pass."'";
  		$loginResult = $connection->query($loginSql);
  		if($user){
  			$_SESSION['username'] = $username;
  			$_SESSION['id'] = $user->id;
  			setcookie('id', $user->id, time() + (86400 * 30), "/");
  			setcookie('username', $_SESSION['username'], time() + (86400 * 30), "/");
  			header("Location: /welcome");
  		} else {
  			print_r("Wrong username or password");
  		}
  	} else {
  		print_r("Wrong username or password");
  	}
  }
  
  public function formRegister() {
  	$connection = $this->getConnection();
  	$username = $_POST['username'];
  	$email = $_POST['email'];
  	$pass = $this->encode($_POST['password']);
  	$confPass = $this->encode($_POST['confirm-password']);
  	
  	$connection = $this->getConnection();
  	$userSql = "SELECT * FROM `user` WHERE username="."'" . $_POST['username'] . "'";
	$userResult = $connection->query($userSql);
	$user = $userResult->fetch_object();
	var_dump($user);
	
	$errorMessage = "";
	
	if($this->areTextFieldsEmpty($username, $email, $pass, $confPass) == false){
  		if($this->validatePassword($pass, $confPass)){
  			if($this->validateUsername($username, $user)){
  				if($this->validateEmail($email)){
  					$registerSql = "INSERT INTO user VALUES (0, '".$username."', '".$pass."', '".$email."', 0)";
  					$registerResult = $connection->query($registerSql);
  					$this->setSuccessMessage("User registered successfully!");
  					return "";
  				}
  				$this->setErrorMessage("Invalid email format!");
  				return "";
  			}
  			return "";
  		}
  		$this->setErrorMessage("Password and confirm password are not the same!");
  		return "";
  	} 
  	$this->setErrorMessage("Fill in the fields!");
  	return "";
  }
  
  public function insertOffer() {
  	$data = $_POST;
  	$offererId = $data['myId'];
  	$answererId = $data['peerId'];
  	$offererSdp = $data['data'];
  	$offerType = $data['type'];
  	
  	$connection = $this->getConnection();
  	$getOfferIdSql = "SELECT * FROM `offers` WHERE offererId="."'" . $offererId .
  										 "' AND " . "answererid='".$answererId.
  										 "' AND status='".$offerType."' LIMIT 1";
  	$getOfferIdResult = $connection->query($getOfferIdSql);
  	$offer = $getOfferIdResult->fetch_object();
  	if($offer){
  		$updateOfferSql = "UPDATE offers SET offerersdp="."'" . $offererSdp. "'
  				 WHERE id='".$offer->id."'";
  		$connection->query($updateOfferSql); 
  	} else {
  		$insertOffer = "INSERT INTO offers (offererid, answererid, offerersdp, status) 
  				VALUES ('".$offererId."', '".$answererId."', '".$offererSdp."', '".$offerType."')";
  		$connection->query($insertOffer); 
  	}
  	
  }
  
  public function insertAnswer() {
  	$data = $_POST;
  	$offererId = $data['peerId'];
  	$answererId = $data['myId'];
  	$answererSdp = $data['data'];
  	$offerType = $data['type'];
  	 
  	$connection = $this->getConnection();
  	$getOfferIdSql = "SELECT * FROM `offers` WHERE offererid="."'" . $offererId .
  	"' AND " . "answererid='".$answererId.
  	"' AND status='offer' LIMIT 1";
  	$getOfferIdResult = $connection->query($getOfferIdSql);
  	$offer = $getOfferIdResult->fetch_object();
  	if($offer){
  		$updateOfferSql = "UPDATE offers SET answerersdp="."'" . $answererSdp."', status='".$offerType. "' 
  				 WHERE id='".$offer->id."'";
  		$connection->query($updateOfferSql);
  	}
  	 
  }
  
  public function insertCandidate() {
  	$data = $_POST;
  	$offererId = $data['myId'];
  	$answererId = $data['peerId'];
  	$candidate = $data['data'];
  	$offerType = $data['type'];
  	$connection = $this->getConnection();
  	$getOfferIdSql = "SELECT * FROM `offers` WHERE offererid="."'" . $offererId .
  	"' AND " . "answererid='".$answererId.
  	"' AND status='answer' LIMIT 1";
  	$getOfferIdResult = $connection->query($getOfferIdSql);
  	$offer = $getOfferIdResult->fetch_object();
  	if($offer){
  		$updateOfferSql = "UPDATE offers SET candidate="."'" . $candidate."', status='".$offerType. "'
  				 WHERE id='".$offer->id."'";
  		$connection->query($updateOfferSql);
  	}
  }
  
  public function insertConversation(){
  	$data = $_POST;
  	$offererUsername = $data['myUsername'];
  	$peerUsername = $data['peerUsername'];
  	$message = $data['message'];
  	$currentDate = date('Y-m-d H:i:s');
  	
  	$connection = $this->getConnection();
  	$insertHistory = "INSERT INTO history VALUES (0, '".$offererUsername."', '".$peerUsername."', '".$message."', '".$currentDate."')";
  	$connection->query($insertHistory); 
  }
  
  public function history(){
     $data = $_GET;
     $peerId = $data['peerId'];
     $connection = $this->getConnection();
     
     if(isset($_SESSION['username']) && $peerId != null){
       $currentUser = $_SESSION['username'];
       $currentUserId = $_SESSION['id'];
       $getFriendSql = "SELECT * FROM `friends` WHERE userid='".$currentUserId."' AND friendid='".$peerId."'";
  	   $getFriendResult = $connection->query($getFriendSql);
  	   $friend = $getFriendResult->fetch_object();
  	   if($friend){
  	     	$getUserSql = "SELECT * FROM `user` WHERE id='".$friend->friendid."' LIMIT 1";
  	        $getUserResult = $connection->query($getUserSql);
  	        $user = $getUserResult->fetch_object();
  	        $getHistorySql = "SELECT * FROM `history` WHERE (firstuser='".$user->username."' AND seconduser='".$currentUser.
  			"') OR ( firstuser='".$currentUser."' AND seconduser='".$user->username."')";
  	
  			$getHistoryResult = $connection->query($getHistorySql);
  			foreach ($getHistoryResult as $history) {
  				$conversation = "[".$history['datetime']."] ".$history['seconduser'].": ".$history['message']."<br>"; 
    			print_r($conversation);
			}
  	   }
     }
  }
  
  public function getOffer(){
  	$data = $_POST;
  	$answererId = $data['myId'];
  	
  	$connection = $this->getConnection();
  	$getOfferSql = "SELECT * FROM `offers` WHERE answererid='".$answererId.
  	"' AND status='offer' ORDER BY updatedtime DESC LIMIT 1";
  	
  	$getOfferResult = $connection->query($getOfferSql);
  	$offer = $getOfferResult->fetch_object();
  	return new JsonResponse($offer);
  }
  
  public function getUserFb(){
  	$data = $_POST;
  	$userId = $data['myId'];
  	 
  	$connection = $this->getConnection();
  	$getUserSql = "SELECT * FROM `user` WHERE id='".$userId."' LIMIT 1";
  	$getUserResult = $connection->query($getUserSql);
  	$user = $getUserResult->fetch_object();
  	
  	$arrayFb = array();
  	$arrayFb["fbid"] = $user->facebookid;
  	
  	return new JsonResponse($arrayFb);
  }
  
  public function getAnswer(){
  	$data = $_POST;
  	$offererId = $data['myId'];
  	$answererId = $data['peerId'];
  	
  	$connection = $this->getConnection();
  	$getOfferSql = "SELECT * FROM `offers` WHERE answererid='".$answererId."' AND offererid='".$offererId.
  	"' AND status='answer' ORDER BY updatedtime DESC LIMIT 1";
  	
  	$getOfferResult = $connection->query($getOfferSql);
  	$offer = $getOfferResult->fetch_object();
  	return new JsonResponse($offer);
  }
  
  public function getCandidate(){
  	$data = $_POST;
  	$answererId = $data['myId'];
  	
  	$connection = $this->getConnection();
  	$getOfferSql = "SELECT * FROM `offers` WHERE answererid='".$answererId.
  	"' AND status='candidate' ORDER BY updatedtime DESC LIMIT 1";
  	
  	$getOfferResult = $connection->query($getOfferSql);
  	$offer = $getOfferResult->fetch_object();
  	return new JsonResponse($offer);
  }
  
  public function completeConnection(){
  	$data = $_POST;
  	$answererId = $data['myId'];
  	$offererId = $data['offererId'];
  	$status = $data['status'];
  	
  	$connection = $this->getConnection();
  	$getOfferSql = "SELECT * FROM `offers` WHERE answererid='".$answererId."' AND offererid='".$offererId.
  	"' AND status='candidate' OR status='offer' ORDER BY updatedtime DESC LIMIT 1";
  	
  	$getOfferResult = $connection->query($getOfferSql);
  	$offer = $getOfferResult->fetch_object();
    if($offer){
  		$updateOfferSql = "UPDATE offers SET status='".$status."' WHERE id='".$offer->id."'";
  		$connection->query($updateOfferSql);
  	}
  }
  
  public function connectToFb(){
  	$data = $_POST;
  	$myId = $data['myId'];
  	$fbid = $data['data'];
  	
  	$connection = $this->getConnection();
  	
  	$updateOfferSql = "UPDATE user SET facebookid='".$fbid."' WHERE id='".$myId."'";
  	$connection->query($updateOfferSql);
  }
  
  public function addFriend(){
  	$data = $_POST;
  	$myId = $data['myId'];
  	$username = $data['username'];
  	
  	$toRet = "fail";
  	
  	$connection = $this->getConnection();
  	$getUserSql = "SELECT * FROM `user` WHERE username='".$username."' LIMIT 1";
  	$getUserResult = $connection->query($getUserSql);
  	$user = $getUserResult->fetch_object();
  	if($user){
 	  $getFriendSql = "SELECT * FROM `friends` WHERE userid='".$myId."' AND friendid='".$user->id."'";
  	  $getFriendResult = $connection->query($getFriendSql);
  	  $friend = $getFriendResult->fetch_object();
  	  if(!$friend){
  	    $insertFriend = "INSERT INTO friends VALUES (0,'".$myId."', '".$user->id."')";
  	    $connection->query($insertFriend); 
  	    $insertFriend = "INSERT INTO friends VALUES (0,'".$user->id."', '".$myId."')";
  	    $connection->query($insertFriend); 
  	    $toRet = "success";
  	  }
  	}
  	$arrayFriend = array();
  	$arrayFriend["result"] = $toRet;
  	return new JsonResponse($arrayFriend);
  }
  
  public function getFriends(){
  	$data = $_POST;
  	$myId = $data['myId'];
  	
  	$connection = $this->getConnection();
  	
  	$getFriends = "SELECT user.id,user.username FROM user INNER JOIN friends 
  		WHERE friends.userid='".$myId."' AND user.id=friends.friendid";
  	$getFriendsResult = $connection->query($getFriends);
  	$friendsArray = array();
  	foreach ($getFriendsResult as $friend) {
    	$row_array['id'] = $friend['id'];
    	$row_array['username'] = $friend['username'];
   		array_push($friendsArray,$row_array);
	}
  	return new JsonResponse($friendsArray);
  }
  
  private function areTextFieldsEmpty($username, $email, $pass, $confPass){
  	return $username == "" || $email == "" || $pass == "" || $confPass == "";
  }
 
  private function setErrorMessage($message){
  	$_SESSION['error'] = $message;
  	header("Location: /register");
  }
  
  private function setSuccessMessage($message){
  	$_SESSION['success'] = $message;
  	header("Location: /home");
  }
  
  private function validatePassword($pass, $confPass){
    return $pass == $confPass;
  }
  
  private function validateUsername($username, $dbUser){
  	$toRet = true;
  	if ($dbUser != null){
  		$this->setErrorMessage("Username already exists!");
  		$toRet = false;
  	}
  	if(strpos($username, ' ') !== false) {
  		$this->setErrorMessage("Username should not contain space characters!");
  		$toRet = false;
  	}
	return $toRet;
  }
	
  private function validateEmail($email){
  	return filter_var($email, FILTER_VALIDATE_EMAIL);
  }
  
  private function encode($password){
    //TODO: encode password
    return $password;
  }
  
  private function unsetCookie($cookie){
    unset($_COOKIE[$cookie]);
    setcookie($cookie, null, -1, '/');
  }
  
  private function getConnection(){
  	$connection = Database::connect();
  	if ($connection->connect_error) {
  		die("Connection failed: " . $conn->connect_error);
  	}
  	return $connection;
  }
}