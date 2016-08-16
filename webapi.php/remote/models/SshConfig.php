<?php
namespace WebAPI\Remote\Models;

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
 * Represents the SSH configuration.
 */
class SshConfig
{

  public $Host = '';

  public $Port = 22;

  public $User = '';

  public $Password = '';

  public $RequiredPassword = TRUE;

  function __construct()
  {
    global $config;

    if (!isset($config['server']) || !isset($config['server']['ssh']) || !is_array($config['server']['ssh']))
    {
      return;
    }
    
    $propeties = array_keys(get_class_vars(get_class($this)));

    foreach($propeties as $property)
    {
      $key = str_replace('-', '', strtolower($property));

      if (isset($config['server']['ssh'][$key]))
      {
        $this->$property = $config['server']['ssh'][$key];
      }
    }

    if (!isset($this->Port) || (int)$this->Port <= 0 || (int)$this->Port > 65535)
    {
      $this->Port = 22;
    }
  }

}