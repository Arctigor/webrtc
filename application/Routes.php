<?php

/**
 * Meghatarozza a lehetseges utakat a site-on.
 */
class Routes {
	public $routes = array(
			'home' => array(
					'controller' => 'home',
					'template' => 'home',
					'js' => array(
							'/assets/js/jquery-2.2.1.min.js',
							'/assets/js/custom.js',
							'/assets/js/text_chat.js',
					),
			),
			'login' => array(
					'controller' => 'login',
					'template' => 'login',
			),
			'formLogin' => array(
					'controller' => 'formLogin',
					'template' => 'formLogin',
			),
	);

	public function getRoutes() {
		return $this->routes;
	}

}