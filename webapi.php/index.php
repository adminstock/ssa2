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

require_once 'config.php';
require_once 'cors.php';

/**
  * The SmallServerAdmin API.
  */
class API
{

  function __construct()
  {
    global $config;

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

    if (strtolower($query['Method']) == 'echo')
    {
      $this->Output(['Success' => TRUE]);
      return;
    }

    if (preg_match('/[\w\d]+\.[\w\d]+/', $query['Method']) === FALSE)
    {
      $this->Error('Invalid method name. Expected: "ModuleName.MethodName".');
      return;
    }

    try
    {
      // get class and method name
      $name = explode('.', $query['Method']);
      $moduleName = $name[0];
      $methodName = $name[1];

      $moduleIncluded = FALSE;

      $moduleSearch = [];
      $moduleSearch[] = $_SERVER['DOCUMENT_ROOT'].'/'.$moduleName.'/debian-8.4-x64.php';
      $moduleSearch[] = $_SERVER['DOCUMENT_ROOT'].'/'.$moduleName.'/debian-8.4.php';
      $moduleSearch[] = $_SERVER['DOCUMENT_ROOT'].'/'.$moduleName.'/debian.php';
      $moduleSearch[] = $_SERVER['DOCUMENT_ROOT'].'/'.$moduleName.'/linux.php';
      // $moduleSearch[] = $_SERVER['DOCUMENT_ROOT'].'/'.$moduleName.'/windows-6.1.7601.php';
      // $moduleSearch[] = $_SERVER['DOCUMENT_ROOT'].'/'.$moduleName.'/windows-6.1.php';
      // $moduleSearch[] = $_SERVER['DOCUMENT_ROOT'].'/'.$moduleName.'/windows.php';
      // $moduleSearch[] = $_SERVER['DOCUMENT_ROOT'].'/'.$moduleName.'/freebsd-10.3.php';
      // $moduleSearch[] = $_SERVER['DOCUMENT_ROOT'].'/'.$moduleName.'/freebsd.php';
      $moduleSearch[] = $_SERVER['DOCUMENT_ROOT'].'/'.$moduleName.'/index.php';
      //$moduleSearch[] = $_SERVER['DOCUMENT_ROOT'].'/'.strtolower($moduleName).'/index.php';

      // search and include file
      foreach($moduleSearch as $modulePath)
      {
        if (is_file($modulePath))
        {
          require_once $modulePath;
          $moduleIncluded = TRUE;
          break;
        }  
      }
      
      if ($moduleIncluded === FALSE)
      {
        $this->Error('Module "'.$moduleName.'" not found.');
      }

      // search and create class instance
      $instance = NULL;
      $moduleName = '\Api\\'.$moduleName;
      if(class_exists($moduleName))
      {
        $instance = new $moduleName();
      }
      else 
      {
        $this->Error('Class "'.$moduleName.'" not found');
      }

      if (!method_exists($instance, $methodName))
      {
        $this->Error('Unknown method.');
        return;
      }

      $this->Output($instance->{$methodName}($query['Data']));
    }
    catch (\Exception $ex)
    {
      if (isset($config['ssa_log_path']) && $config['ssa_log_path'] != '')
      {
        file_put_contents($config['ssa_log_path'], '['.date('Y-m-d H:i:s').'] Error: '.$ex->getMessage()."\nRequest: ".$requestBody, FILE_APPEND | LOCK_EX);
      }

      $this->Error(($msg = $ex->getMessage()) != NULL ? $msg : 'Server error.', 500);
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
      
    $data = $this->NormalizeDataForJsonEncode($data);

    if (($result = json_encode($data)) === FALSE) // , JSON_UNESCAPED_UNICODE
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

} new API();