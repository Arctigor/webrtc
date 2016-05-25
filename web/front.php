<?php

require_once __DIR__.'/../vendor/autoload.php';

use Simplex\Framework;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing;
use Symfony\Component\HttpKernel;

function render_template(Request $request, $output = '')
{
  extract($request->attributes->all(), EXTR_SKIP);
  $page = $output['page'];
  $scripts = $output['scripts'];
  ob_start();
  include sprintf('pages/%s.php', 'header');
  include sprintf('pages/%s.php', 'page');
  include sprintf('pages/%s.php', 'footer');

  return new Response(ob_get_clean());
}

$request = Request::createFromGlobals();

$kernel = new Framework($request);
$response = $kernel->handle();

$response->send();
