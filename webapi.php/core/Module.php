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
 * Represents base class for modules.
 */
class Module
{

  /**
   * The remote access client.
   * 
   * @var IRemoteClient
   */
  private $RemoteClient = NULL;

  /**
   * Server config.
   * 
   * @var ServerConfig
   */
  private $Server = NULL;

  function __construct($server = NULL)
  {
    $this->Server = $server;
  }

  /**
   * Summary of GetRemoteClient
   * @throws \ErrorException 
   * @return IRemoteClient
   */
  protected function GetRemoteClient()
  {
    if ($this->Server == NULL)
    {
      throw new \ErrorException
      (
        'Server config is null. Please check your code.'."\n\n".
        'Perhaps you should implement a constructor in your module: function __construct($server) { parent::__construct($server); }'
      );
    }

    if ($this->RemoteClient == NULL)
    {
      if (!isset($this->Server->Connection))
      {
        throw new \ErrorException('Connection settings is null. Please check server config.');
      }

      $clientName = $this->Server->Connection->Client;

      if (!isset($clientName) || $clientName == '')
      {
        $clientName = 'SshClient';
      }

      if (class_exists($clientName))
      {
        $this->RemoteClient = new $clientName($this->Server->Connection);
      }
      else 
      {
        if (class_exists('\\WebAPI\\Core\\'.$clientName))
        {
          $className = '\\WebAPI\\Core\\'.$clientName;
          $this->RemoteClient = new $className($this->Server->Connection);
        }
        else
        {
          throw new \ErrorException('Class "'.$clientName.'" not found');
        }
      }
    }

    return $this->RemoteClient;
  }

  /**
   * Executes the specified command on the remote server.
   * 
   * @param string|string[] $command Command or an array of commands to execution.
   * @param mixed $settings Additional options.
   * 
   * @return CommandResult|CommandResult[]
   */
  protected function ExecuteCommand($command, $settings = NULL)
  {
    if ($this->RemoteClient == NULL)
    {
      $this->GetRemoteClient();
    }

    return $this->RemoteClient->Execute($command, $settings);
  }

  /**
   * Tests the connection.
   * 
   * @return bool
   */
  protected function TestConnection()
  {
    if ($this->RemoteClient == NULL)
    {
      $this->GetRemoteClient();
    }

    return $this->RemoteClient->Test();
  }

}