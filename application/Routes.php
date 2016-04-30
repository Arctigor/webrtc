<?php

class Routes {
	public $routes = array(
			'home' => array(
					'controller' => 'home',
					'template' => 'home',
					'js' => array(
							'/assets/js/jquery-2.2.1.min.js',
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
					'js' => array(
							'/assets/js/jquery-2.2.1.min.js',
							'/assets/js/webrtc.js',
							//'/assets/js/text_chat.js',
					),
			),
			'insertOffer' => array(
					'controller' => 'insertOffer',
					'template' => 'insertOffer',
			),
			'insertAnswer' => array(
					'controller' => 'insertAnswer',
					'template' => 'insertAnswer',
			),
			'getOffer' => array(
					'controller' => 'getOffer',
					'template' => 'getOffer',
			),
	);

	public function getRoutes() {
		return $this->routes;
	}

}