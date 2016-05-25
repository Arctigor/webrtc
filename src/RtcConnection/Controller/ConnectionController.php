<?php

namespace Simplex\RtcConnection\Controller;


use Simplex\Controller\ControllerBase;
use Simplex\Database\Database;
use Symfony\Component\HttpFoundation\JsonResponse;

class ConnectionController extends ControllerBase {


  public function getConnection() {
    /** @var Database $connection */
    $connection = Database::getInstance();
    return $connection->getConnection();
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

    $connection = $this->getConnection();
    $getOfferSql = "SELECT * FROM `offers` WHERE answererid='".$answererId."' AND offererid='".$offererId.
      "' AND status='candidate' ORDER BY updatedtime DESC LIMIT 1";

    $getOfferResult = $connection->query($getOfferSql);
    $offer = $getOfferResult->fetch_object();
    if($offer){
      $updateOfferSql = "UPDATE offers SET status='complete' WHERE id='".$offer->id."'";
      $connection->query($updateOfferSql);
    }
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
}