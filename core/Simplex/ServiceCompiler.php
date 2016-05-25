<?php

namespace Simplex;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Definition;
use Symfony\Component\DependencyInjection\Reference;

class ServiceCompiler {

  public $container;

  public function __construct(ContainerBuilder $containerBuilder) {
    $this->container = $containerBuilder;
  }

  public function compile($services) {
    foreach ($services['services'] as $serviceName => $serviceDefinition) {
      $service = $this->container->register($serviceName, $serviceDefinition['class']);
      if (isset($serviceDefinition['arguments']) && !empty($serviceDefinition['arguments'])) {
        $this->addArguments($service, $serviceDefinition);
      }
      if (isset($serviceDefinition['calls']) && !empty($serviceDefinition['calls'])) {
        $this->addCalls($service, $serviceDefinition);
      }
      if (isset($serviceDefinition['tags']) && !empty($serviceDefinition['tags'])) {
        $this->addTags($service, $serviceDefinition);
      }
    }
  }

  public function addArguments(Definition $service, $serviceDefinition) {
    $argumentArray = $this->getArguments($serviceDefinition['arguments']);
    $service->setArguments($argumentArray);
  }

  private function getArguments($arguments) {
    $argumentArray = [];
    $referenceArray = [];
    foreach ($arguments as $argument) {
      if (substr($argument, 0,1) === '@') {
        $referenceArray[] = new Reference(substr($argument, 1));
      }
      else {
        $argumentArray[] = $argument;
      }
    }
    $argumentArray = array_merge($argumentArray, $referenceArray);
    return $argumentArray;
  }
  
  public function addCalls(Definition $service, $serviceDefinition) {
    foreach ($serviceDefinition['calls'] as $call) {
      $argumentArray = $this->getArguments($call[1]);
      $service->addMethodCall($call[0], $argumentArray);
    }
  }

  public function addTags(Definition $service, $serviceDefinition) {
    foreach ($serviceDefinition['tags'] as $tags) {
      $attributes = [];
      $name = '';
      foreach ($tags as $key => $tag) {
        if ($key == 'name') {
          $name = $tag;
        }
        else {
          $attributes[] = $tag;
        }
      }
      if (!empty($name)) {
        $service->addTag($name, $attributes);
      }
    }
  }

}
