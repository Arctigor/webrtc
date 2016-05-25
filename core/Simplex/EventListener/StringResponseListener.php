<?php

namespace Simplex\EventListener;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use Symfony\Component\HttpFoundation\Response;

class StringResponseListener implements EventSubscriberInterface {

  /**
   * @var Request
   */
  protected $request;

  public function onView(GetResponseForControllerResultEvent $event)
  {
    $page = $event->getControllerResult();
    $this->request = $event->getRequest();

    if (is_string($page)) {
      $response = render_template($event->getRequest(), $page);
      $event->setResponse($response);
    }

    if (is_array($page)) {
      $page = $this->renderArray($page);
      $response = render_template($event->getRequest(), $page);
      $event->setResponse($response);
    }
  }

  public function renderArray($renderArray) {
    $base_url = $this->request->getSchemeAndHttpHost();
    $return = '';
    $scripts = '<script type="text/javascript" src="' . $base_url .'/web/assets/js/jquery-2.2.1.min.js"></script>';
    $page = '';
    if (isset($renderArray['#theme'])) {
      if ($renderArray['#theme'] == 'form') {
        $action = $renderArray['#action'];
        unset($renderArray['#theme']);
        unset($renderArray['#action']);
        $page .= $this->renderForm($action, $renderArray);
      }

      if (isset($renderArray['#theme']) && $renderArray['#theme'] == 'page') {
        $template = $renderArray['#template'];
        $page .= file_get_contents(getcwd() . "/web/pages/$template.php");
        if (isset($renderArray['#attached']) && isset($renderArray['#attached']['js']) && !empty($renderArray['#attached']['js'])) {
          foreach ($renderArray['#attached']['js'] as $js) {
            $scripts .= '<script type="text/javascript" src="' . $base_url .'/web/assets/js/' . $js . '"></script>';
          }
        }
      }
    }

    $return['page'] = $page;
    $return['scripts'] = $scripts;
    return $return;
  }

  private function renderForm($action, $renderArray) {
    $page = '<form action="' . $action . '" method="POST">';
    foreach ($renderArray as $key => $element) {
      $page .= $this->_render($key, $element);
    }
    $page .= '</form>';

    return $page;
  }

  private function _render($key, $element) {
    $renderedElement = '';
    if ($element['#type'] == 'text') {
      $renderedElement .= '<div class="label">' . $element['#label'] . '</div>';
      $renderedElement .= '<input type="' . $element['#type'] . '" name="' . $key . '" placeholder="' . $element['#placeholder'] . '">';
    }

    if ($element['#type'] == 'email') {
      $renderedElement .= '<div class="label">' . $element['#label'] . '</div>';
      $renderedElement .= '<input type="' . $element['#type'] . '" name="' . $key . '" placeholder="' . $element['#placeholder'] . '">';
    }

    if ($element['#type'] == 'password') {
      $renderedElement .= '<div class="label">' . $element['#label'] . '</div>';
      $renderedElement .= '<input type="' . $element['#type'] . '" name="' . $key . '" placeholder="' . $element['#placeholder'] . '">';
    }

    if ($element['#type'] == 'submit') {
      $renderedElement .= '<input type="' . $element['#type'] . '" value="' . $element['#value'] . '">';
    }

    return $renderedElement;
  }

  public static function getSubscribedEvents()
  {
    return array('kernel.view' => 'onView');
  }
}
