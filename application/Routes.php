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
			'loginWithFb' => array(
					'controller' => 'loginWithFb',
					'template' => 'loginWithFb',
					'js' => array(
							'/assets/js/jquery-2.2.1.min.js',
							'/assets/js/facebook.js',
							'/assets/js/login_with_fb.js'
					),
			),
			'formLogin' => array(
					'controller' => 'formLogin',
					'template' => 'formLogin',
			),
			'fbError' => array(
					'controller' => 'fbError',
					'template' => 'fbError',
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
							'/assets/js/facebook.js',
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
			'addFriend' => array(
					'controller' => 'addFriend',
					'template' => 'addFriend',
			),
			'history' => array(
					'controller' => 'history',
					'template' => 'history',
			),
			'getOffer' => array(
					'controller' => 'getOffer',
					'template' => 'getOffer',
			),
			'getUserFb' => array(
					'controller' => 'getUserFb',
					'template' => 'getUserFb',
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
			'connectToFb' => array(
					'controller' => 'connectToFb',
					'template' => 'connectToFb',
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