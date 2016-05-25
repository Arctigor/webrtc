<?php

namespace Simplex\User\Model;

use Simplex\Database\Database;
use Simplex\User\Service\ValidateUser;
use Symfony\Component\HttpFoundation\Request;

class UserModel {
  protected $connection;
  protected $validateUser;

  public function __construct(ValidateUser $validateUser) {
    $this->connection = Database::getInstance()->getConnection();
    $this->validateUser = $validateUser;
  }

  public function register(Request $request) {
    $registerResult = FALSE;
    $username = $request->request->get('username');
    $email = $request->request->get('email');
    $pass = md5($request->request->get('password'));
    $confPass = md5($request->request->get('confirm-password'));

    if($this->validateUser->validatePassword($pass, $confPass)){
      if($this->validateUser->validateUsername($username)){
        if($this->validateUser->validateEmail($email)){
          $registerSql = "INSERT INTO user VALUES (0, '".$username."', '".$pass."', '".$email."', 0)";
          $registerResult = $this->connection->query($registerSql);
          
        }
      }
    }
    
    return $registerResult;
  }

  public function login(Request $request) {
    $result = FALSE;
    $username = $request->request->get('username');
    $pass = md5($request->request->get('password'));
    
    $userSql = "SELECT * FROM `user` WHERE username="."'" . $username . "'";
    $userResult = $this->connection->query($userSql);
    $user = $userResult->fetch_object();
    if($user){
      $loginSql = "SELECT * FROM `user` WHERE username="."'" . $username . "' AND " . "password='".$pass."'";
      $loginResult = $this->connection->query($loginSql);
      if($user && $loginResult){
        $_SESSION['username'] = $username;
        setcookie('id', $user->id, time() + (86400 * 30), "/");
        setcookie('username', $_SESSION['username'], time() + (86400 * 30), "/");
        $result = TRUE;
      } 
    } 
    
    return $result;
  }
}