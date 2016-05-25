<?php

namespace Simplex\Controller;

use Symfony\Component\DependencyInjection\ContainerInterface;

interface ContainerInjectionInterface {

  public static function create(ContainerInterface $container);

}
