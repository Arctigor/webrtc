<?php

namespace Simplex;

use Symfony\Component\Yaml\Exception\ParseException;
use Symfony\Component\Yaml\Parser;

class ServiceCollector extends YamlCollector {

  protected $services;
  protected $serviceFiles;

  public function parseFiles() {
    $this->serviceFiles = $this->locateFiles('*.services.yml');
    $this->services = ['services' => []];
    foreach ($this->serviceFiles as $filePath) {
      $serviceFile = file_get_contents($filePath);
      $yaml = new Parser();
      try {
        $parsedResult = $yaml->parse($serviceFile);
        $this->services['services'] += $parsedResult['services'];

      } catch (ParseException $e) {
        printf("Unable to parse the YAML string: %s", $e->getMessage());
      }
    }

    return $this->services;
  }

}
