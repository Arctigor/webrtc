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
  	$connection = Database::connect();
 	if ($connection->connect_error) {
   	 die("Connection failed: " . $conn->connect_error);
	}
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
}