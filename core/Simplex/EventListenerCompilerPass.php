<?php

namespace Simplex;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;

class EventListenerCompilerPass implements CompilerPassInterface {

  public function process(ContainerBuilder $container)
  {
    if (!$container->has('dispatcher')) {
      return;
    }

    $definition = $container->findDefinition(
      'dispatcher'
    );

    $taggedServices = $container->findTaggedServiceIds(
      'event.listener'
    );

    foreach ($taggedServices as $id => $tags) {
      $definition->addMethodCall(
        'addSubscriber',
        array(new Reference($id))
      );
    }
  }
}