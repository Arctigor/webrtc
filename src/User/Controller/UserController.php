<?php

namespace Simplex\User\Controller;

use Simplex\Controller\ControllerBase;
use Simplex\User\Model\UserModel;
use Simplex\User\Service\ValidateUser;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

class UserController extends ControllerBase {

  protected $validateUser;
  protected $userModel;

  public function __construct(ValidateUser $validateUser, UserModel $userModel) {
    $this->validateUser = $validateUser;
    $this->userModel = $userModel;
  }

  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('user.validate'),
      $container->get('user.model')
    );
  }

  public function loginPage() {
    $form = array(
      '#theme' => 'form',
    );
    $form['username'] = array(
      '#type' => 'text',
      '#placeholder' => 'Username',
      '#label' => 'Username'
    );
    $form['password'] = array(
      '#type' => 'password',
      '#placeholder' => 'Enter your password',
      '#label' => 'Password'
    );
    $form['submit'] = array(
      '#type' => 'submit',
      '#value' => 'Submit',
    );
    $form['#action'] = 'formLogin';
    
    return $form;
  }

  public function registerPage() {
    $form = array(
      '#theme' => 'form',
    );
    $form['username'] = array(
      '#type' => 'text',
      '#placeholder' => 'Username',
      '#label' => 'Username'
    );

    $form['email'] = array(
      '#type' => 'email',
      '#placeholder' => 'emailname@example.com',
      '#label' => 'Email'
    );
    $form['password'] = array(
      '#type' => 'password',
      '#placeholder' => 'Enter your password',
      '#label' => 'Password'
    );

    $form['confirm-password'] = array(
      '#type' => 'password',
      '#placeholder' => 'Enter your password',
      '#label' => 'Confirm Password'
    );
   
    $form['submit'] = array(
      '#type' => 'submit',
      '#value' => 'Register',
    );
    $form['#action'] = 'formRegister';

    return $form;
  }

  public function welcomePage() {
    return array(
      '#theme' => 'page',
      '#template' => 'welcome',
      '#attached' => array(
        'js' => array('webrtc.js'),
      ),
    );
  }
  
  public function formRegister(Request $request) {
    $registerResult = $this->userModel->register($request);
    if ($registerResult) {
      $response = new RedirectResponse('/login');
      return $response;
    }
    else {
      $response = new RedirectResponse('/register');
      return $response;
    }
  }

  public function formLogin(Request $request) {
    $loginResult = $this->userModel->login($request);
    if ($loginResult) {
      $response = new RedirectResponse('/welcome');
      return $response;
    }
    else {
      // TODO set messages.
      $response = new RedirectResponse('/login');
      return $response;
    }
  }

}
