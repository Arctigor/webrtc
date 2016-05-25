<?php

namespace Simplex\Home\Controller;


use Symfony\Component\HttpFoundation\Request;

class HomeController {

  public function homeAction(Request $request) {
    return 'this is the home page';
  }
}