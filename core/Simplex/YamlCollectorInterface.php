<?php

namespace Simplex;


interface YamlCollectorInterface {

  public function parseFiles();
  public function locateFiles($pattern);
}