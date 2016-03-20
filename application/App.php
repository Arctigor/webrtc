<?php

require_once("Routes.php");
require_once("Database.php");
require_once("JsonResponse.php");
require_once(dirname(dirname(__FILE__)) . "/controller/Controller.php");

define('ROOT', dirname(dirname(__FILE__)));
define('ERRORCODE_404', '404');

class App {

	private $routes;
	private $route;
	private $db_connection;
	private $database;
	private $request;
	private $path;
	private $controller;
	private $controller_function;

	public function __construct() {
		$this->route = new Routes();
		$this->database = new Database();
		$this->initialize();
		$this->handle();
	}

	public function initialize() {
		$this->setDbConnection();
		$this->setRoutes();
		$this->setRequest($_SERVER['REQUEST_URI']);
		$request = !empty($this->request[1]) ? $this->request[1] : 'home';
		$this->setPath($request);
		$this->setController();
		$this->setControllerFunction($this->routes[$this->path]['controller']);
	}


	public function handle() {
		if ($this->path === '') {
			$this->setPath('home');
			$this->setControllerFunction($this->routes[$this->path]['controller']);
			$this->render();
		}
		else {
			if (array_key_exists($this->path, $this->routes)) {
				$this->render();
			}
			else {
				$this->urlNotFound();
			}
		}
	}

	private function render() {
		if (method_exists($this->controller, $this->controller_function)) {
			$response =  $this->controller->{$this->controller_function}();
			if ($response instanceof JsonResponse) {
				header('Content-Type: application/json');
				echo $response->jsonOutput;
			}
			else {
				$templates = scandir(ROOT . '/templates');
				foreach ($templates as $template) {
					if ($template == $this->routes[$this->path]['template'] . '.php') {
						$template_name = $this->routes[$this->path]['template'];
						$this->render_page($template_name, $response);
					}
				}
			}
		}
		else {
			$this->urlNotFound();
		}
	}

	private function render_page($template_name, $response = '') {
		require_once(ROOT . '/templates/header.php');
		require_once(ROOT . '/templates/' . $template_name . '.php');
		$scripts = $this->getScripts();
		require_once(ROOT . '/templates/footer.php');
	}

	public function getScripts() {
		$output = '';
		$currentRoute = $this->routes[$this->path];
		if (isset($currentRoute['js'])) {
			foreach ($currentRoute['js'] as $js) {
				$output .= '<script type="text/javascript" src="';
				$output .= $js;
				$output .= '"></script>';
			}
		}
	
		return $output;
	}

	private function urlNotFound() {
		$this->render_page(ERRORCODE_404);
	}

	private function setDbConnection() {
		$this->db_connection = $this->database->connect();
	}

	public function setRoutes() {
		$this->routes = $this->route->getRoutes();
	}

	public function setPath($path) {
		$this->path = $path;
	}

	public function setRequest($request) {
		$this->request = explode('/', $request);
	}

	public function setController() {
		$this->controller = new Controller($this->request, $this->path, $this->routes, $this->db_connection);
	}

	public function setControllerFunction($controller_function) {
		$this->controller_function = $controller_function;
	}

}
