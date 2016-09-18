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
    //['WebAPI' => ['Name'=>'WebAPI.PHP', 'Version' =>'2.0', 'DateRelease' => 'unreleased']]
    //['OS' => ['Name'=>'Debian', 'Version' =>'8.4', 'DateRelease' => 'unreleased']]
    //['Software' => ['Name'=>'PHP', 'Version' =>'5.4']]
    //php_uname('s');
    //'r'
    //'m'
    return NULL;
  }

  public function GetModules()
  {
    $result = [];

    $exclude = [ '.', '..', 'auth', 'core', 'servers' ];

    foreach(scandir(ROOT_PATH) as $item)
    {
      $path = implode(DIRECTORY_SEPARATOR, [ROOT_PATH, $item]);

      if (is_dir($path) === FALSE || array_search($item, $exclude) !== FALSE) 
      {
        continue;
      }

      if (is_file(implode(DIRECTORY_SEPARATOR, [$path, 'module.json'])) !== FALSE)
      {
        $jsonDecode = new \WebAPI\Core\JsonDecode('\WebAPI\Control\Models\Module', implode(DIRECTORY_SEPARATOR, [$path, 'module.json']));
        $m = $jsonDecode->GetInstance();
      }
      else
      {
        $m = new \WebAPI\Control\Models\Module();
      }

      $m->Name = $item;

      if (!isset($m->Title) || $m->Title == '')
      {
        $m->Title = $item;
      }

      $result[] = $m;
    }

    return $result;
  }

  #endregion
  #region Servers

  public function ConnectionTest()
  {
    if ($this->TestConnection())
    {
      return ['Success' => TRUE];
    }
    else
    {
      throw new ApiException('Connection failed.');
    }
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
    $jsonDecode = new \WebAPI\Core\JsonDecode('\WebAPI\Core\ServerConfig', \WebAPI\Core\ServerConfig::GetConfigPath($fileName));

    $result = $jsonDecode->GetInstance();
    
    $result->FileName = basename($fileName, '.json');

    if (isset($result->Connection))
    {
      $result->Connection->Password = NULL;
    }
    
    return $result;
  }

  /**
   * Saves server.
   * 
   * @param array $server 
   */
  public function SaveServer($server)
  {
    if (!isset($server['FileName']) || $server['FileName'] == '')
    {
      // is new server
      // make unique name
      $name = 'server';

      if (isset($server['Connection']) && isset($server['Connection']['Host']) && $server['Connection']['Host'] !='')
      {
        $name = $server['Connection']['Host'];
      }
      
      $path = \WebAPI\Core\ServerConfig::GetConfigPath($name);

      $i = 1;
      while (is_file($path) === TRUE)
      {
        $path = \WebAPI\Core\ServerConfig::GetConfigPath($name.'-'.$i);
        $i++;
      }
    }
    else
    {
      // load current server config
      $path = \WebAPI\Core\ServerConfig::GetConfigPath($server['FileName']);
      $jsonDecode = new \WebAPI\Core\JsonDecode('\WebAPI\Core\ServerConfig', $path);
      $current = $jsonDecode->GetInstance();
    }

    if (isset($current))
    {
      if (!isset($server['Connection']))
      {
        $server['Connection'] = $current->Connection;
      }
      else
      {
        if (!isset($server['Connection']['Password']) || $server['Connection']['Password'] == '')
        {
          $server['Connection']['Password'] = $current->Connection->Password;
        }
      }
    }

    $this->NormalizeKeys($server);
    $json = json_encode($server);

    // save file
    if (file_put_contents ($path, $json) === FALSE)
    {
      throw new \ErrorException('Unable to save file.');
    }

    // remove password
    $server['Connection']['Password'] = NULL;

    // return server
    return $server;
  }

  private function NormalizeKeys(&$array)
  {
    foreach (array_keys($array) as $key){
      $value = &$array[$key];

      unset($array[$key]);

      if ($key != 'OS')
      {
        $newKey = lcfirst($key);
      }
      else
      {
        $newKey = strtolower($key);
      }

      if (is_array($value)) 
      {
        $this->NormalizeKeys($value);
      }

      $array[$newKey] = $value;

      unset($value);
    }
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