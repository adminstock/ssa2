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

/**
 * Represents server config.
 */
class ServerConfig
{

  private $ObjectProperties = ['Connection' => '\WebAPI\Core\ConnectionConfig', 'OS' => '\WebAPI\Core\OS'];

  /** 
   * Config file name.
   */
  public $FileName;

  /** 
   * Server name.
   * 
   * @var string
   */
  public $Name;

  /** 
   * Server description.
   * 
   * @var string
   */
  public $Description;

  /** 
   * The server is disabled.
   * 
   * @var bool
   */
  public $Disabled;

  /** 
   * Address to which the user will be redirected after logout.
   * 
   * @var string
   */
  public $LogoutRedirect;

  /** 
   * Connection settings.
   * 
   * @var ConnectionConfig
   */
  public $Connection;

  /**
   * The operating system under which the server is running.
   * 
   * @var OS
   */
  public $OS;

  /**
   * List of modules.
   * 
   * @var mixed
   */
  public $Modules;

  function __construct($path, $notHidePassword = FALSE)
  {
    if (!isset($path) || $path == '')
    {
      throw new \InvalidArgumentException('Config file is required. Value cannot be empty.');
    }

    if (!is_file($path))
    {
      if (strtolower(pathinfo($path, PATHINFO_EXTENSION)) != '.json')
      {
        $path .= '.json';
      }

      if (!defined('SSA_SERVERS_PATH') || SSA_SERVERS_PATH == '' || !is_dir(SSA_SERVERS_PATH))
      {
        $path = implode(DIRECTORY_SEPARATOR, [ROOT_PATH, 'servers', $path]);
      }
      else
      {
        $path = implode(DIRECTORY_SEPARATOR, [SSA_SERVERS_PATH, $path]);
      }
    }

    if (!is_file($path))
    {
      throw new ApiException('File "'.$path.'" not found.', ApiErrorCode::NOT_FOUND, HttpStatusCode::NOT_FOUND);
    }
    
    if (!is_readable($path))
    {
      throw new ApiException('No access to the file "'.$path.'".');
    }

    // read file
    $json = file_get_contents($path);
    $json = str_replace("\xEF\xBB\xBF", '', $json);

    $server = json_decode($json, TRUE);

    if (json_last_error() != JSON_ERROR_NONE)
    {
      throw new ApiException('JSON Error: '.json_last_error(), ApiErrorCode::JSON_PARSE_ERROR);
    }

    // clear username and password
    if (isset($server['connection']) && $notHidePassword !== TRUE)
    {
      //$server['connection']['user'] = NULL;
      $server['connection']['password'] = NULL;
    }

    $this->FileName = basename($path, '.json');

    // fill the current instance
    $this->Fill($this, $server);
  }

  private function Fill($instance, $config)
  {
    $r = new \ReflectionClass($instance);
    $propeties = $r->getProperties(\ReflectionProperty::IS_PUBLIC);

    foreach($propeties as $property)
    {
      $propertyName = $property->getName();
      $key = str_replace('-', '', strtolower($propertyName));

      if (!isset($config[$key]))
      {
        continue;
      }
      
      // TODO: getDocComment() Hmm...

      if (array_key_exists($propertyName, $this->ObjectProperties))
      {
        $value = new $this->ObjectProperties[$propertyName]();

        $this->Fill($value, $config[$key]);

        $instance->$propertyName = $value;
      }
      else
      {
        $instance->$propertyName = $config[$key];
      }
    }
  }
    
}