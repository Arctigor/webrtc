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

  public function home() {
  	return array();
    return new JsonResponse(array('data' => 'awesome'));
  }

  public function login() {
    return array(
      'data' => 'A Despre Noi oldal',
    );
  }
  
  public function formLogin() {
  	$connection = $this->getConnection();
	$userSql = "SELECT * FROM `user` WHERE username="."'" . $_POST['username'] . "'";
	$userResult = $connection->query($userSql);
	$user = $userResult->fetch_object();
	if($user){
		$loginSql = "SELECT * FROM `user` WHERE username="."'" . $_POST['username'] . "' AND " . "password='".$_POST['password']."'";
		$loginResult = $connection->query($loginSql);
		if($user){
			$_SESSION['username'] = $_POST['username'];
			header("Location: /welcome");
		} else {
			print_r("wrong username or password");
		}
	} else {
			print_r("wrong username or password");
	}
  }
  
  public function welcome() {
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
  
  private function getConnection(){
  	$connection = Database::connect();
  	if ($connection->connect_error) {
  		die("Connection failed: " . $conn->connect_error);
  	}
  	return $connection;
  }
}