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
 * Represents the connection settings.
 */
export default class ConnectionSettings {

  /**
   * Client name of remote access. For example: SshClient.
   */
  public Client: string;

  /** Server host or IP address. */
  public Host: string;

  /** Connection port. For example: 22. */
  public Port: number;

  /** Username. */
  public Username: string;

  /** User password. */
  public Password: string;

}