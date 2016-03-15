<?php

/**
 * @file
 *   Kontroller fuggvenyeket meghatarozo osztaly.
 */

/**
 * Tartalmazza a kontroller fuggvenyeket.
 */
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
  	return array(
  			'new' => 'lol',
  			'data' => 'FORM LGOIN',
  	);
  }
}