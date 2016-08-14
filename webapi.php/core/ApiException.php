<?php
namespace WebAPI\Core;

/*
 * Copyright © AdminStock Team (www.adminstock.net), 2016. All rights reserved.
 * Copyright © Aleksey Nemiro, 2016. All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

class ApiException extends \Exception
{

  private $HttpStatusCode = 500;

  private $Code = '';

  function __construct($message = 'Server error.', $code = ApiErrorCode::SERVER_ERROR, $httpStatusCode = 500)
  {
    if ($message == '')
    {
      $message = 'Server error.';
    }

    if ($code == '')
    {
      $code = ApiErrorCode::SERVER_ERROR;  
    }
    
    parent::__construct($message);

    $this->Code = $code;
    $this->HttpStatusCode = $httpStatusCode;
  }

  public function getCode2()
  {
    return $this->Code;
  }

  public function getHttpStatusCode()
  {
    return $this->HttpStatusCode;
  }

}