<?php

namespace Simplex\Controller;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Controller\ControllerResolver;

class SimplexControllerResolver extends ControllerResolver {

  protected $container;

  protected function instantiateController($class) {
    if (is_subclass_of($class, 'Simplex\Controller\ContainerInjectionInterface')) {
      $instance = $class::create($this->container);
    }
    else {
      $instance = new $class();
    }
    
    return $instance;
  }


  public function setContainer(ContainerInterface $container) {
    $this->container = $container;
  }

}
