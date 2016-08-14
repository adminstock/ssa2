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

#region Cross-origin resource sharing

header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Origin: http://example.org', false);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')
{
  header('Access-Control-Allow-Methods: POST, OPTIONS');
  header('Access-Control-Allow-Headers: Accept, Authorization, Content-Type, Referer, User-Agent');
  // skip options request
  return;
}

#endregion

require_once 'config.php';
require_once 'loader.php';

use \WebAPI\Core\ApiException as ApiException;
use \WebAPI\Core\ApiErrorCode as ApiErrorCode;
use \WebAPI\Core\ModuleFlags as ModuleFlags;
use \WebAPI\Core\IModule as IModule;

/**
 * The SmallServerAdmin API.
 */
class API
{

  function __construct()
  {
    global $config;
    
    $requestBody = NULL;

    try
    {
      if ($_SERVER['REQUEST_METHOD'] != 'POST' || (!strrpos($_SERVER['HTTP_CONTENT_TYPE'], '/json') && !strrpos($_SERVER['CONTENT_TYPE'], '/json')))
      {
        throw new ApiException('It is expected the POST request method. The type of content should be only JSON (application/json).', ApiErrorCode::BAD_REQUEST);
      }

      $requestBody = file_get_contents('php://input');
      $query = json_decode($requestBody, true);
      
      if (!$query)
      {
        throw new ApiException('JSON Error: '.json_last_error(), ApiErrorCode::JSON_PARSE_ERROR);
      }
      
      if (!isset($query['Method']))
      {
        throw new ApiException('Method is required.', ApiErrorCode::ARGUMENT_NULL_OR_EMPY);
      }

      if (preg_match('/[\w\d]+\.[\w\d]+/', $query['Method']) === FALSE)
      {
        throw new ApiException('Invalid method name. Expected: "ModuleName.MethodName".');
      }

      // parse class and method name
      $name = explode('.', $query['Method']);
      $moduleName = $name[0];
      $methodName = $name[1];

      // create class instance
      $instance = $this->GetInstance($moduleName, $methodName);

      // check flags
      $serverRequired = TRUE;
      $tokenRequired = TRUE;

      if ($instance instanceof IModule)
      {
        $serverRequired = !ModuleFlags::HasFlag($instance->GetModuleFlags(), ModuleFlags::WITHOUT_SERVER);
        $tokenRequired = !ModuleFlags::HasFlag($instance->GetModuleFlags(), ModuleFlags::ANONYMOUS);
      }

      // check access
      if ($tokenRequired)
      {
        $this->CheckAccess($moduleName);
      }

      // load server config
      if ($serverRequired)
      {
        if (!isset($query['Server']))
        {
          throw new ApiException('Server is required.', ApiErrorCode::SERVER_REQUIRED);
        }

        $this->LoadServerConfig($query['Server']);
      }

      // execution
      $result = NULL;

      if (isset($query['Data']) && is_array($query['Data']) === TRUE)
      {
        // check parameters
        $r = new \ReflectionMethod(get_class($instance), $methodName);
      
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
    catch (ApiException $ex)
    {
      $this->WriteToLog($ex->getMessage(), $requestBody);
      $this->Error($ex->getMessage(), $ex->getTraceAsString(), $ex->getCode2(), $ex->getHttpStatusCode());
    }
    catch (\Exception $ex)
    {
      $this->WriteToLog($ex->getMessage(), $requestBody);
      $this->Error($ex->getMessage(), $ex->getTraceAsString(), ApiErrorCode::SERVER_ERROR, 500);
    }
  }

  /**
   * Checks permission to perform the request.
   * 
   * @param \string $moduleName Name of module.
   * @return void
   */
  private function CheckAccess($moduleName)
  {
    if (!isset($moduleName) || $moduleName == '')
    {
      throw new ApiException('$moduleName is required, value cannot be empty.');
    }
    
    $token = '';

    if (isset($_SERVER['HTTP_AUTHORIZATION']))
    {
      $token = substr($_SERVER['HTTP_AUTHORIZATION'], strrpos($_SERVER['HTTP_AUTHORIZATION'], ' ') + 1);
    }

    $auth = new \WebAPI\Auth\Index();
    $auth->TokenIsValid($token);
  }

  /**
   * Loads server config.
   */
  private function LoadServerConfig($serverName)
  {
    global $config;
    
    if (!isset($serverName))
    {
      throw new ApiException('Server name is required, value cannot be empty.');
    }

    if (!isset($config['servers_config_path']) || !is_dir($config['servers_config_path']))
    {
      throw new ApiException('servers_config_path is required, value cannot be empty. Please check config.php.');
    }
    
    if (!is_file($config['servers_config_path'].'/'.$serverName.'.json'))
    {
      throw new ApiException('File "'.$config['servers_config_path'].'/'.$serverName.'.json'.'" not found.');
    }

    $json = file_get_contents($config['servers_config_path'].'/'.$serverName.'.json');
    $json = str_replace("\xEF\xBB\xBF", '', $json);

    $config['server'] = json_decode($json, TRUE);
  }

  /**
   * Seeking a module class and creates an instance of this module.
   * 
   * @param mixed $moduleName Module name.
   * @param mixed $methodName Method name to check.
   * @throws ApiException 
   * @return object
   */
  private function GetInstance($moduleName, $methodName)
  {
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
      throw new ApiException('Module "'.$moduleName.'" not found.', ApiErrorCode::UNKNOWN_MODULE, 404);
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
      throw new ApiException('Class "'.$moduleName.'" not found', ApiErrorCode::UNKNOWN_MODULE, 404);
    }

    if (!method_exists($instance, $methodName))
    {
      throw new ApiException('Unknown method.', ApiErrorCode::UNKNOWN_METHOD, 404);
    }
    
    return $instance;
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

    $response = new \WebAPI\Core\Response();
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
   * @param \string $message The message text. 
   * @param \int $status The HTTP status code. Default: 400 (Bad Request).
   */
  private function Error($message, $trace = NULL, $code = NULL, $status = 400)
  {
    $this->Output
    (
      [
        'Error' => 
        [
          'Code' => $code, 
          'Text' => $message,
          'Trace' => $trace
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

  // TODO
  private function WriteToLog($message, $request = NULL)
  {
    global $config;
    
    if (!isset($config['ssa_log_path']) || $config['ssa_log_path'] == '')
    {
      return FALSE;
    }

    $data = '['.date('Y-m-d H:i:s').'] '.$message;

    if (isset($request) && $request != NULL && $request != '')
    {
      $data .= "\nRequest: ";
      $data .= $request;
    }
    
    return file_put_contents($config['ssa_log_path'], $data, FILE_APPEND | LOCK_EX);
  }

} new API();