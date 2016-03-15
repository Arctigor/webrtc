<?php
/**
 * @file
 *   Tartalmazza az App osztalyt amiben az URL szerinti kezeles tortenik.
 */

/**
 * A Routes osztalyban vannak meghatarozva az elerheto URL-k.
 */
require_once("Routes.php");

/**
 * Adatbazis kezelo osztaly.
*/
require_once("Database.php");
require_once("JsonResponse.php");

/**
 * Tartalmazza a kontroller fuggvenyeket.
*/
require_once(dirname(dirname(__FILE__)) . "/controller/Controller.php");

define('ROOT', dirname(dirname(__FILE__)));
define('ERRORCODE_404', '404');

/**
 * Kezeli az URL szerint a kontroller adatokat es template megjelenitest.
*/
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

	/**
	 * Inicializalja a megfelelo valtozokat.
	 */
	public function initialize() {
		$this->setDbConnection();
		$this->setRoutes();
		$this->setRequest($_SERVER['REQUEST_URI']);
		$request = !empty($this->request[1]) ? $this->request[1] : 'home';
		$this->setPath($request);
		$this->setController();
		$this->setControllerFunction($this->routes[$this->path]['controller']);
	}

	/**
	 * Kezeli az oldalt URL szerint.
	 */
	public function handle() {
		// Ha a fo oldalon vagyunk akkor jelenitse meg a home templatet es hasznalja
		// fel a home kontrollerbol az adatokat.
		if ($this->path === '') {
			$this->setPath('home');
			$this->setControllerFunction($this->routes[$this->path]['controller']);
			$this->render();
		}
		// Ha nem a fo oldalon vagyunk akkor keresse meg a megfelelo utat.
		else {
			if (array_key_exists($this->path, $this->routes)) {
				$this->render();
			}
			else {
				$this->urlNotFound();
			}
		}
	}

	/**
	 * Megjeleniti a megfelelo template-t a kontrollerbol bejovo adattal.
	 */
	private function render() {
		// Megkeresi ha letezik kontroller, ha nem akkor 404.
		if (method_exists($this->controller, $this->controller_function)) {
			$response =  $this->controller->{$this->controller_function}();
			if ($response instanceof JsonResponse) {
				header('Content-Type: application/json');
				echo $response->jsonOutput;
			}
			else {
				// Megkeresi ha letezik megfelelo template.
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

	/**
	 * Megjeleniti a template-t nev szerint.
	 */
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
	/**
	 * Letrehozza a 404-es oldalt.
	 *
	 * @see /templates/404.php
	 */
	private function urlNotFound() {
		$this->render_page(ERRORCODE_404);
	}

	/**
	 * Adatbazis hozzaferes.
	 */
	private function setDbConnection() {
		$this->db_connection = $this->database->connect();;
	}

	/**
	 * Szetteli a lehetseges url-ket a site-on.
	 */
	public function setRoutes() {
		$this->routes = $this->route->getRoutes();
	}
	/**
	 * Szetteli az alap URL-t.
	 */
	public function setPath($path) {
		$this->path = $path;
	}

	/**
	 * Szetteli a bejovo request URL-t.
	 */
	public function setRequest($request) {
		$this->request = explode('/', $request);
	}

	/**
	 * Letrehozza es szetteli a kontroller objektumot.
	 */
	public function setController() {
		$this->controller = new Controller($this->request, $this->path, $this->routes, $this->db_connection);
	}

	/**
	 * Szetteli a kontroller fuggvenyt.
	 */
	public function setControllerFunction($controller_function) {
		$this->controller_function = $controller_function;
	}

}
