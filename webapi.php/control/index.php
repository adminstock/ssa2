<?php
namespace WebAPI\Control;

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

use \WebAPI\Core\ApiException as ApiException;
use \WebAPI\Core\ApiErrorCode as ApiErrorCode;
use \WebAPI\Core\HttpStatusCode as HttpStatusCode;

/**
 * Processing user authentication requests.
 */
class Index extends \WebAPI\Core\Module implements \WebAPI\Core\IModuleFlags
{

  function __construct($server = NULL) 
  { 
    parent::__construct($server); 
  }

  #region ...

  /**
   * Returns WebAPI version.
   */
  public function Version()
  {

    //php_uname('s');
    //'r'
    //'m'
    return NULL;
  }

  #endregion
  #region Servers

  public function ConnectionTest()
  {
    return ['Success' => $this->TestConnection()];
  }

  /**
    * Returs list of servers.
    */
  public function GetServers()
  {
    $servers = [];

    if (!defined('SSA_SERVERS_PATH') || SSA_SERVERS_PATH == '' || !is_dir(SSA_SERVERS_PATH))
    {
      $path = implode(DIRECTORY_SEPARATOR, [ROOT_PATH, 'servers']);
    }
    else
    {
      $path = SSA_SERVERS_PATH;
    }

    // get servers
    if (is_dir($path))
    {
      foreach (scandir($path) as $file) 
      {
        if ($file == '.' || $file == '..' || pathinfo($file, PATHINFO_EXTENSION) != 'json') { continue; }
        $servers[] = $this->GetServer(implode(DIRECTORY_SEPARATOR, [$path, $file]));
      }

      usort($servers, function($a, $b) { return strcmp($a->Name, $b->Name); });
    }

    return $servers;
  }

  /**
    * Returns specified server.
    * 
    * @return \WebAPI\Core\ServerConfig
    */
  public function GetServer($fileName)
  {
    return new \WebAPI\Core\ServerConfig($fileName);
  }

  #endregion
  #region WebAPI\Core\IModule Members

  /**
   * Returns flags of the module.
   *
   * @return int
   */
  function GetModuleFlags()
  {
    return \WebAPI\Core\ModuleFlags::WITHOUT_SERVER;
  }

  #endregion

}