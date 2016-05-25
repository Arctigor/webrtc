<?php

namespace Simplex\Controller;


use Symfony\Component\DependencyInjection\ContainerInterface;

class ControllerBase implements ContainerInjectionInterface {
  
  public static function create(ContainerInterface $container) {
    return new static();
  }

  
}
