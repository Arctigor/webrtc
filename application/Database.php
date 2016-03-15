<?php
/**
 * @file
 *   Database osztalyt tartalmazza, adatbazis alap metodusokkal.
 */

/**
 * Adatbazis kezeles alap fuggvenyei.
 *
 * TODO jo lenne konnexio bezaras fuggveny.
 */

class Database {

  public function connect() {
    $mysqli = mysqli_connect("localhost", "root", "", "webrtc");

    return $mysqli;
  }

}
