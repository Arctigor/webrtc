<?php 

class JsonResponse {
	
	public $jsonOutput;
	public function __construct($content) {
		$this->jsonOutput = json_encode($content);
	}
}