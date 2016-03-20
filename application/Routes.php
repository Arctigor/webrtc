<?php

class Routes {
	public $routes = array(
			'home' => array(
					'controller' => 'home',
					'template' => 'home',
					'js' => array(
							'/assets/js/jquery-2.2.1.min.js',
							//'/assets/js/custom.js',
							//'/assets/js/text_chat.js',
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
			'welcome' => array(
					'controller' => 'welcome',
					'template' => 'welcome',
			),
	);

	public function getRoutes() {
		return $this->routes;
	}

}