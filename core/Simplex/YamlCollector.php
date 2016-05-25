<?php

namespace Simplex;


use Symfony\Component\Finder\Finder;

class YamlCollector implements YamlCollectorInterface {

  public function parseFiles() {
    return [];
  }

  public function locateFiles($pattern) {
    $finder = new Finder();
    $rootDirectory = getcwd();
    $files = [];
    $directories = array(
      $rootDirectory . '/core',
      $rootDirectory . '/src',
    );

    $finder->files()->in($directories)->name($pattern);
    foreach ($finder as $file) {
      $files[] = $file->getRealpath();
    }

    return $files;
  }
  
}