<?php
/**
 * Created by PhpStorm.
 * User: bene
 * Date: 5/25/2016
 * Time: 12:14 AM
 */

namespace Simplex\Database;


class Database {

  private $connection;

  private static $instance;
  public static function getInstance() {
    if (null === static::$instance) {
      static::$instance = new static();
    }

    return static::$instance;
  }

  /**
   * Protected constructor to prevent creating a new instance of the
   * *Singleton* via the `new` operator from outside of this class.
   */
  protected function __construct() {
    $this->connection = mysqli_connect("localhost", "root", "", "webrtc");
  }
  
  public function getConnection() {
    return $this->connection;
  }
}