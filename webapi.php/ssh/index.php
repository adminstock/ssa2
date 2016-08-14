<?php
namespace WebAPI\SSH;

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

/**
 * Represents SSH client.
 */
class Index
{

  /**
    * Active SSH connection.
    * 
    * @var resource
    */
  private $SshConnection = NULL;

  private $Settings = [];

  function __construct()
  {
    global $config;

    if (!isset($config['server']))
    {
      throw new ApiException('The server is not specified. Server configuration is missing. Specify the server and try again.', ApiErrorCode::SERVER_REQUIRED);
    }

    if (!isset($config['server']['ssh']) || !is_array($config['server']['ssh']))
    {
      throw new ApiException('SSH settings not found. Please check config file of the server.', ApiErrorCode::SSH_ERROR);
    }

    $this->Settings = $config['server']['ssh'];

    if (!isset($this->Settings['host']) || $this->Settings['host'] == '')
    {
      throw new ApiException('SSH host is required. Please check config file of the server.', ApiErrorCode::SSH_ERROR);
    }

    if (!isset($this->Settings['user']))
    {
      throw new ApiException('SSH username is required. Please check config file of the server.', ApiErrorCode::SSH_ERROR);
    }
    
    if (!isset($this->Settings['password']))
    {
      throw new ApiException('SSH password is required. Please check config file of the server.', ApiErrorCode::SSH_ERROR);
    }

    $host = $this->Settings['host'];
    $port = 22;
    $user = $this->Settings['user'];
    $password = $this->Settings['password'];

    if (isset($this->Settings['port']))
    {
      $port = (int)$this->Settings['port'];
    }

    $this->SshConnection = ssh2_connect($host, $port);

    if (!$this->SshConnection)
    {
      throw new ApiException('Cannot to connect "'.$host.'".', ApiErrorCode::SSH_CONNECTION_FAILED);
    }

    if (!ssh2_auth_password($this->SshConnection, $user, $password))
    {
      throw new ApiException('Authentication failed.', ApiErrorCode::SSH_AUTHENTICATION_FAILED);
    }
  }
        
  /**
    * Execute a command on a remote server.
    * 
    * @param \string|\string[] $command The command to execute.
    * @param \bool $dontTrim Specifies whether to disable the automatic removal of spaces on the sides.
    * @return \WebAPI\SSH\Models\SshResult|\WebAPI\SSH\Models\SshResult[]
    */
  public function Execute($command, $dontTrim = FALSE)
  {
    if (gettype($command) !== 'array')
    {
      $stream = ssh2_exec($this->SshConnection, $this->MakeCommand($command));

      if ($stream === FALSE) {
        throw new ApiException('Could not open shell exec stream.', ApiErrorCode::SSH_ERROR);
      }

      //stream_set_timeout($stream, 10);

      $stream_error = ssh2_fetch_stream($stream, SSH2_STREAM_STDERR);
      $stream_io = ssh2_fetch_stream($stream, SSH2_STREAM_STDIO);

      stream_set_blocking($stream_error, TRUE);
      stream_set_blocking($stream_io, TRUE);
        
      $result = new \WebAPI\SSH\Models\SshResult();

      $result->Error = stream_get_contents($stream_error);
      $result->Result = stream_get_contents($stream_io);

      if (!isset($dontTrim) || (bool)$dontTrim !== TRUE)
      {
        $result->Error = trim($result->Error);
        $result->Result = trim($result->Result);
      }

      if (($result->Result != '' && !$this->IsError($result->Result)) || !$this->IsError($result->Error)) 
      {
        // result not empty, remove error message
        $result->Error = '';
      }
      else
      {
        $result->Error = $this->NormalizeErrorMessage($result->Error);
      }

      fclose($stream);
    }
    else
    {
      $result = array();
      foreach($command as $cmd)
      {
        $stream = ssh2_exec($this->SshConnection, $this->MakeCommand($cmd));

        if ($stream === FALSE) {
          throw new ApiException('Could not open shell exec stream.', ApiErrorCode::SSH_ERROR);
        }

        $stream_error = ssh2_fetch_stream($stream, SSH2_STREAM_STDERR);
        $stream_io = ssh2_fetch_stream($stream, SSH2_STREAM_STDIO);

        stream_set_blocking($stream_error, TRUE);
        stream_set_blocking($stream_io, TRUE);

        $r = new \WebAPI\SSH\Models\SshResult();
        $r->Error = stream_get_contents($stream_error);
        $r->Result = stream_get_contents($stream_io);

        if (!isset($dontTrim) || (bool)$dontTrim !== TRUE)
        {
          $r->Error = trim($r->Error);
          $r->Result = trim($r->Result);
        }

        if ($r->Result != '' || !$this->IsError($r->Error)) 
        {
          // result not empty, remove error message
          $r->Error = '';
        }
        else
        {
          $r->Error = $this->NormalizeErrorMessage($r->Error);
        }

        $result[] = $r;

        fclose($stream);
      }
    }

    return $result;
  }
    
  /**
    * Execute a command on a remote server.
    * 
    * @param \string|\string[] $command The command to execute.
    * @return \string|\string[]
    */
  public function Execute2($command)
  {
    if (gettype($command) !== 'array')
    {
      $stream = ssh2_exec($this->SshConnection, $this->MakeCommand($command));

      if ($stream === FALSE) {
        throw new ApiException('Could not open shell exec stream.', ApiErrorCode::SSH_ERROR);
      }

      stream_set_blocking($stream, TRUE);
        
      $result = '';

      while (!feof($stream)) 
      {
        $read = fread($stream, 4096);
        $result .= $read;
        if ($result == '' || $read == '') // $read for password required mode ($config['ssh_required_password'] = TRUE)
        {
          break;
        }
      }

      fclose($stream);
    }
    else
    {
      $result = array();
      foreach($command as $cmd)
      {
        $stream = ssh2_exec($this->SshConnection, $this->MakeCommand($cmd));

        if ($stream === FALSE) {
          throw new ApiException('Could not open shell exec stream.', ApiErrorCode::SSH_ERROR);
        }

        stream_set_blocking($stream, 1);
          
        $r = '';

        while (!feof($stream)) 
        {
          $read = fread($stream, 4096);
          $r .= fread($stream, 4096);
          if ($r == '' || $read == '')
          {
            break;
          }
        }

        fclose($stream);

        $result[] = $r;
      }
    }

    return $result;
  }

  /**
    * Checks message to real error.
    * 
    * @param \string $value 
    * @return bool
    */
  private function IsError($value)
  {
    if ($value == NULL || $value == '')
    {
      return FALSE;
    }

    if (stripos($value, '[sudo] password for') !== FALSE && preg_match('/invalid|error|failed|невозможно|ошибка|не удалось/', $value) === 0)
    {
      return FALSE;
    }

    return TRUE;
  }

  private function NormalizeErrorMessage($value)
  {
    return preg_replace('/\[sudo\] password for ([^\:]+):/', '', $value);
  }

  private function MakeCommand($command)
  {
    if (isset($this->Settings['required-password']) && (bool)$this->Settings['required-password'])
    {
      return 'echo "' . str_replace('"', '\\"', $this->Settings['password']) . '" | sudo -S bash -c "' . str_replace('"', '\\"', $command) . '"';
    }
    else
    {
      return $command;
    }
  }

}