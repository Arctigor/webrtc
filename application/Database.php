<?php

class Database {

  public static function connect() {
    $mysqli = mysqli_connect("localhost", "root", "", "webrtc");

    return $mysqli;
  }

}
