<?php

namespace Simplex\Service;

use Simplex\YamlCollector;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Yaml\Exception\ParseException;
use Symfony\Component\Yaml\Parser;

class RouteCollector extends YamlCollector{

  protected $routeFile;
  protected $routeDefinitions;
  protected $routes;
  protected $routeFiles;

  public function __construct() {
    $this->routes = new RouteCollection();
  }

  public function parseFiles() {
    $this->routeFiles = $this->locateFiles('*.routes.yml');
    foreach ($this->routeFiles as $filePath) {
      $routeFile = file_get_contents($filePath);
      $yaml = new Parser();
      try {
        $this->routeDefinitions = $yaml->parse($routeFile);
        $this->compileRoutes();
      } catch (ParseException $e) {
        printf("Unable to parse the YAML string: %s", $e->getMessage());
      }
    }

    return $this->routes;
  }

  public function compileRoutes() {
    try {
      foreach ($this->routeDefinitions as $name => $definition) {
        $routeOptions = [];
        foreach ($definition['defaults'] as $key => $default) {
          $routeOptions[$key] = $default;
        }
        $route = new Route($definition['path'], $routeOptions);
        $this->routes->add($name, $route);
      }
    }
    catch (\Exception $e) {
      printf("RouteCollection error: %s", $e->getMessage());
    }
  }

}
