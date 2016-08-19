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
 * Describes the client for remote command execution.
 */
interface IRemoteClient
{
 
  /**
   * Initializes a new instance of the class.
   * 
   * @param ConnectionConfig $connectionSettings Connection settings.
   */
  function __construct($connectionSettings);

  /**
   * Executes the specified command on the remote server.
   * 
   * @param string|string[] $command Command or an array of commands to execution.
   * @param mixed $settings Additional options.
   * 
   * @return CommandResult
   */
  function Execute($command, $settings = NULL);

  /**
   * Tests the connection.
   * 
   * @return bool
   */
  function Test();

}
