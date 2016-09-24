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
class ServerConfig implements IObjectProperties
{

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
   * @var \WebAPI\Core\Module[]
   */
  public $Modules;
 
  public function GetObjectProperties() 
  {
    return 
    [
      'Connection' => '\WebAPI\Core\ConnectionConfig', 
      'OS' => '\WebAPI\Core\OS',
      'Modules' => '\WebAPI\Core\ModuleSettings[]' 
    ];
  }

  /**
   * Returns full path to config.
   * 
   * @param string $name File name.
   * 
   * @return string
   */
  public static function GetConfigPath($name)
  {
    if (!is_file($name))
    {
      if (strtolower(pathinfo($name, PATHINFO_EXTENSION)) != '.json')
      {
        $name .= '.json';
      }

      if (!defined('SSA_SERVERS_PATH') || SSA_SERVERS_PATH == '' || !is_dir(SSA_SERVERS_PATH))
      {
        return implode(DIRECTORY_SEPARATOR, [ROOT_PATH, 'servers', $name]);
      }
      else
      {
        return implode(DIRECTORY_SEPARATOR, [SSA_SERVERS_PATH, $name]);
      }
    }
    else
    {
      return $name;  
    }
  }
  
}