<?php
/*
 * Copyright © AdminStock Team (www.adminstock.net), 2016. All rights reserved.
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

require_once 'cors.php';
require_once 'config.php';
require_once 'response.php';

/**
 * Processing user authentication requests.
 */
class Auth
{

  function __construct()
  {
    global $config;
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')
    {
      return;
    }

    if ($_SERVER['REQUEST_METHOD'] != 'POST' || (!strrpos($_SERVER['HTTP_CONTENT_TYPE'], '/json') && !strrpos($_SERVER['CONTENT_TYPE'], '/json')))
    {
      $this->Error('Supports only the requests by POST. The type of content should be only JSON (application/json).');
      return;
    }

    $requestBody = file_get_contents('php://input');
    $query = json_decode($requestBody, true);

    if (!$query)
    {
      $this->Error(json_last_error());
      return;
    }

    if (!isset($query['Method']))
    {
      $this->Error('Unknown method.');
      return;
    }

    $methodName = strtolower($query['Method']);

    // TODO

    if ($methodName == 'echo')
    {
      $this->Output(['Success' => TRUE]);
    }
    else if ($methodName == 'valid')
    {
      if (!isset($query['Token']) || $query['Token'] == '')
      {
        $this->Error('Token is required. Value cannot be empty.');
      }
      
      $this->Output(['Success' => TRUE]);
    }
    else
    {
      // check username and password
      if (!isset($query['Username']) || $query['Username'] == '')
      {
        $this->Error('Username is required. Value cannot be empty.');
      }

      if (!isset($query['Password']) || $query['Password'] == '')
      {
        $this->Error('Password is required. Value cannot be empty.');
      }

      // temp
      $this->Output(['TokenValue' => 42]);
    }
  }

  /**
    * Outputs response to the client.
    * 
    * @param mixed $data Data to output.
    * @param int $status The HTTP status code. Default: 200 (OK).
    */
  private function Output($data, $status = 200)
  {
    http_response_code($status);

    $response = new Response();
    $response->Data = $data;

    $result = json_encode($this->NormalizeDataForJsonEncode($response));

    if ($result === FALSE)
    {
      throw new \ErrorException('JSON encode error #'.json_last_error().': '.json_last_error_msg());
    }

    echo $result;
  }

  /**
    * Outputs error message.
    * 
    * @param string $message The message text. 
    * @param int $status The HTTP status code. Default: 400 (Bad Request).
    */
  private function Error($message, $status = 400)
  {
    $this->Output(array('Error' => $message), $status);
  }

  private function NormalizeDataForJsonEncode($data)
  {
    if (is_null($data))
    {
      return NULL;
    }

    if (is_array($data)) 
    {
      foreach ($data as $key => $value) 
      {
        $data[$key] = $this->NormalizeDataForJsonEncode($value);
      }
      return $data;
    }
    else  if (is_object($data))
    {
      foreach ($data as $key => $value) 
      {
        $data->$key = $this->NormalizeDataForJsonEncode($value);
      }
      return $data;
    }
    else 
    {
      //$dd = mb_detect_encoding($data);
      if (FALSE && mb_check_encoding($data, 'UTF-8')) 
      {
        return utf8_encode($data);
      }
      else
      {
        return $data;
      }
    }
  }

} new Auth();