<?php

/**
 * @file
 * Contains Simplex\Framework.
 */

namespace Simplex;

use Simplex\Service\RouteCollector;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class Framework {

  public $request;

  /**
   * @var ServiceCollector
   */
  protected $serviceCollector;

  /**
   * @var ContainerBuilder
   */
  protected $serviceContainerBuilder;

  /**
   * @var ServiceCompiler
   */
  protected $serviceCompiler;

  /**
   * @var RouteCollector
   */
  protected $routeCollector;


  public function __construct(Request $request) {
    $this->request = $request;
    $this->init();
  }

  public function init() {
    $this->serviceContainerBuilder = new ContainerBuilder();
    $this->serviceCompiler = new ServiceCompiler($this->serviceContainerBuilder);
    $this->serviceContainerBuilder->addCompilerPass(new EventListenerCompilerPass());
    $this->serviceCollector = new ServiceCollector();
  }

  public function handle() {
    try {
      $this->handleServices();
      $this->registerMatcher();
      $this->serviceContainerBuilder->compile();
      $response = $this->getHttpKernel()->handle($this->request);
    }
    catch (\Exception $e) {
      $response = new Response($e->getMessage(), 500);
    }

    return $response;
  }

  private function handleServices() {
    $services = $this->serviceCollector->parseFiles();
    $this->serviceCompiler->compile($services);
  }

  private function getRoutes() {
    $this->routeCollector = $this->serviceContainerBuilder->get('route_collector');
    return $this->routeCollector->parseFiles();
  }

  private function registerMatcher() {
    $this->serviceContainerBuilder->register('matcher', 'Symfony\Component\Routing\Matcher\UrlMatcher')
      ->setArguments(array('%routes%', new Reference('context')))
    ;

    $this->serviceContainerBuilder->setParameter('routes', $this->getRoutes());
  }

  private function getHttpKernel() {
    return $this->serviceContainerBuilder->get('http_kernel');
  }

}
