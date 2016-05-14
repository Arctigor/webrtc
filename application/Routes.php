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
			'formRegister' => array(
					'controller' => 'formRegister',
					'template' => 'formRegister',
			),
			'logout' => array(
					'controller' => 'logout',
					'template' => 'logout',
			),
			'register' => array(
					'controller' => 'register',
					'template' => 'register',
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
			'insertCandidate' => array(
					'controller' => 'insertCandidate',
					'template' => 'insertCandidate',
			),
			'insertConversation' => array(
					'controller' => 'insertConversation',
					'template' => 'insertConversation',
			),
			'getOffer' => array(
					'controller' => 'getOffer',
					'template' => 'getOffer',
			),
			'getAnswer' => array(
					'controller' => 'getAnswer',
					'template' => 'getAnswer',
			),
			'getCandidate' => array(
					'controller' => 'getCandidate',
					'template' => 'getCandidate',
			),
			'completeConnection' => array(
					'controller' => 'completeConnection',
					'template' => 'completeConnection',
			),
			'getFriends' => array(
					'controller' => 'getFriends',
					'template' => 'getFriends',
			),
	);

	public function getRoutes() {
		return $this->routes;
	}

}