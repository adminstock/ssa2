<?php
namespace WebAPI;

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

require_once 'cors.php';
require_once 'config.php';

spl_autoload_register(function ($class) {
  $namespace = substr($class, strripos($class, 'WebAPI') + strlen('WebAPI') + 1);
  $className = substr($class, strripos($class, '\\') + 1);

  $paths = [];

  if ($namespace == $className) 
  {
    $paths[] = strtolower($className).'.php';
    $paths[] = $className.'.php';
  }
  else 
  {
    $segments = explode('\\', $namespace);

    if (count($segments) <= 2)
    {
      $paths[] = str_replace('\\', '/', strtolower($namespace)).'.php';
      $paths[] = str_replace('\\', '/', $namespace).'.php';
    }
    else
    {
      array_pop($segments);
      $folderPath = implode('/', $segments);
      $paths[] = strtolower($folderPath).'/'.$className.'.php';
      $paths[] = strtolower($folderPath).'/'.strtolower($className).'.php';
      $paths[] = $folderPath.'/'.$className.'.php';
    }
  }

  foreach ($paths as $path)
  {
    if (is_file($path))
    {
      require_once $path;
      break;
    }  
  }
});

/**
  * The SmallServerAdmin API.
  */
class API
{

  function __construct()
  {
    global $config;
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')
    {
      // skip options request
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
      $this->Error('JSON Error: '.json_last_error(), 'JSON_ERROR');
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
      // load server config
      if (isset($query['Server']) && $query['Server'] != '')
      {
        $this->LoadServerConfig($query['Server']);
      }

      // get class and method name
      $name = explode('.', $query['Method']);
      $moduleName = $name[0];
      $methodName = $name[1];    

      $moduleIncluded = FALSE;

      // TODO
      $moduleSearch = [];
      $moduleSearch[] = $moduleName.'/debian-8.4-x64.php';
      $moduleSearch[] = $moduleName.'/debian-8.4.php';
      $moduleSearch[] = $moduleName.'/debian.php';
      $moduleSearch[] = $moduleName.'/linux.php';
      // $moduleSearch[] = $_SERVER['DOCUMENT_ROOT'].'/'.$moduleName.'/windows-6.1.7601.php';
      // $moduleSearch[] = $_SERVER['DOCUMENT_ROOT'].'/'.$moduleName.'/windows-6.1.php';
      // $moduleSearch[] = $_SERVER['DOCUMENT_ROOT'].'/'.$moduleName.'/windows.php';
      // $moduleSearch[] = $_SERVER['DOCUMENT_ROOT'].'/'.$moduleName.'/freebsd-10.3.php';
      // $moduleSearch[] = $_SERVER['DOCUMENT_ROOT'].'/'.$moduleName.'/freebsd.php';
      $moduleSearch[] = $moduleName.'/index.php';
      //$moduleSearch[] = $_SERVER['DOCUMENT_ROOT'].'/'.strtolower($moduleName).'/index.php';

      // search and include file
      foreach ($moduleSearch as $modulePath)
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
      $moduleName = '\\WebAPI\\'.$moduleName.'\\Index';

      if (class_exists($moduleName))
      {
        $instance = new $moduleName();
      }
      else 
      {
        $this->Error('Class "'.$moduleName.'" not found');
        return;
      }

      if (!method_exists($instance, $methodName))
      {
        $this->Error('Unknown method.');
        return;
      }

      $result = NULL;

      if (isset($query['Data']) && is_array($query['Data']) === TRUE)
      {
        // check parameters
        $r = new \ReflectionMethod($moduleName, $methodName);
      
        $methodParams = $r->getParameters();
        $paramsToSet = [];

        // change case of keys
        $query['Data'] = array_change_key_case($query['Data'], CASE_LOWER);

        foreach ($methodParams as $param) {
          $name = strtolower($param->getName());

          if (!isset($query['Data'][$name]))
          {
            // parameter not found
            if ($param->isOptional())
            {
              // is optional parameter, skip
              continue;  
            }
            else
            {
              // paramter is required, show error
              throw new \ErrorException('"'.$name.'" is required.');
            }
          }

          $paramsToSet[$name] = $query['Data'][$name];
        }
        
        // call method
        $result = call_user_func_array(array($instance, $methodName), $paramsToSet);
      }
      else if (isset($query['Data']))
      {
        $result = $this->Output($instance->{$methodName}($query['Data']));
      }
      else
      {
        $result = $this->Output($instance->{$methodName}());
      }

      // output
      $this->Output($result);
    }
    catch (\Exception $ex)
    {
      if (isset($config['ssa_log_path']) && $config['ssa_log_path'] != '')
      {
        file_put_contents($config['ssa_log_path'], '['.date('Y-m-d H:i:s').'] Error: '.$ex->getMessage()."\nRequest: ".$requestBody, FILE_APPEND | LOCK_EX);
      }

      $this->Error(($msg = $ex->getMessage()) != NULL ? $msg : 'Server error.', 'SERVER_ERROR', 500);
    }
  }

  /**
   * Loads server config.
   */
  private function LoadServerConfig($serverName)
  {
    global $config;
    
    if (!isset($serverName))
    {
      throw new \ErrorException('$serverName is required, value cannot be empty.');
    }

    if (!isset($config['servers_config_path']) || !is_dir($config['servers_config_path']))
    {
      throw new \ErrorException('servers_config_path is required, value cannot be empty. Please check config.php.');
    }
    
    if (!is_file($config['servers_config_path'].'/'.$serverName.'.json'))
    {
      throw new \ErrorException('File "'.$config['servers_config_path'].'/'.$serverName.'.json'.'" not found.');
    }

    $json = file_get_contents($config['servers_config_path'].'/'.$serverName.'.json');
    $json = str_replace("\xEF\xBB\xBF", '', $json);

    $config['server'] = json_decode($json, TRUE);
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

    $response = new \WebAPI\Response();
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
  private function Error($message, $code = NULL, $status = 400)
  {
    $this->Output
    (
      [
        'Error' => 
        [
          'Code' => $code, 
          'Text' => $message
        ]
      ], 
      $status
    );
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