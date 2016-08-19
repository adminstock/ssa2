<?php
namespace WebAPI\Users;

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
use \WebAPI\Core\TextHelper as TextHelper;

/**
 * Provides user management.
 */
class Linux extends \WebAPI\Core\Module
{

  function __construct($server = NULL)
  {
    parent::__construct($server);
  }

  #region ..Public methods..

  public function GetGroups()
  {
    return $this->GetGroupsList();
  }

  public function GetUsers($search = '', $page = 1, $limit = 100)
  {
    return $this->GetUsersList((int)$page, (int)$limit, $search);
  }

  public function GetUserByLogin($login)
  {
    if ($login == NULL || $login == '')
    {
      throw new ApiException('Login is required. Value cannot be empty.', ApiErrorCode::ARGUMENT_NULL_OR_EMPY, HttpStatusCode::BAD_REQUEST);
    }

    // get user data
    $user = $this->GetUsersList(1, 0, $login)->Items;
      
    if (count($user) == 1)
    {
      $user = $user[0];
    }
    else if (count($user) > 1)
    {
      foreach($user as $u)
      {
        if ($u->Login == $login)
        {
          $user = $u;
          break;
        }
      }

      if (count($user) > 1)
      {
        $user = NULL;
      }
    }
    else if (count($user) == 0)
    {
      $user = NULL;
    }

    if ($user == NULL) 
    {
      throw new ApiException('User "' . $login . '" not found.', ApiErrorCode::NOT_FOUND, HttpStatusCode::NOT_FOUND);
    }

    // get user groups
    $shell_result = $this->ExecuteCommand('sudo groups '.$user->Login)->Output;
    $user->Groups = explode(' ', trim(explode(':', $shell_result)[1]));
      
    return $user;
  }

  /**
    * Creates a new user.
    */
  public function CreateUser($login, $password, $shell = '/bin/false', $groups = NULL, $noCreateHome = FALSE, $isSystem = FALSE, $fullName = '', $address = '', $phoneWork = '', $phoneHome = '', $email = '')
  {
    $gecos = 
    TextHelper::RemoveChars(TextHelper::EscapeString($fullName, ['"', ',']), [':', chr(13), chr(10)]).','.
    TextHelper::RemoveChars(TextHelper::EscapeString($address, ['"', ',']), [':', chr(13), chr(10)]).','.
    TextHelper::RemoveChars(TextHelper::EscapeString($phoneWork, ['"', ',']), [':', chr(13), chr(10)]).','.
    TextHelper::RemoveChars(TextHelper::EscapeString($phoneHome, ['"', ',']), [':', chr(13), chr(10)]).','.
    TextHelper::RemoveChars(TextHelper::EscapeString($email, ['"', ',']), [':', chr(13), chr(10)]);

    $cmd = 
    'sudo adduser '.$login.' '.
    '--quiet '. // --force-badname
    '--shell '.$shell.
    ((bool)$noCreateHome ? ' --no-create-home ' : ' ').
    ((bool)$isSystem ? '--system ' : ' ').
    '--disabled-password --gecos "'.$gecos.'" && '.
    'echo "OK"';

    $shell_result = $this->ExecuteCommand($cmd);

    if (!$shell_result->OutputAre('OK'))
    {
      throw new ApiException($shell_result->Error, ApiErrorCode::COMMAND_ERROR);
    }

    // set password
    $safeLogin = TextHelper::EscapeString($login);
    $safePassword = TextHelper::EscapeString($password);

    $shell_result = $this->ExecuteCommand('sudo bash -c \'echo -e "'.$safePassword.'\n'.$safePassword.'" | passwd "'.$safeLogin.'"\' && echo "OK"');

    if (!$shell_result->OutputAre('OK'))
    {
      throw new ApiException('Fail to set password for '.$login.': '.$shell_result->Error, ApiErrorCode::COMMAND_ERROR);
    }

    // add to groups
    if ($groups != NULL && count($groups) > 0)
    {
      $shell_result = $this->ExecuteCommand('sudo usermod --groups '.implode(',', $groups).' '.$login.' && echo "OK"');
    }

    if (!$shell_result->OutputAre('OK'))
    {
      throw new ApiException('Unable to add user '.$login.' to groups '.implode(', ', $groups).': '.$shell_result->Error, ApiErrorCode::COMMAND_ERROR);
    }

    $this->GetUserByLogin($login);
  }

  /**
    * Deletes user.
    */
  public function DeleteUser($login, $removeHome = FALSE)
  {
    $cmd = 'sudo userdel '.((bool)$removeHome ? '--remove ' : '').$login.' && echo "OK"';

    $shell_result = $this->ExecuteCommand($cmd);

    if (!$shell_result->OutputAre('OK'))
    {
      throw new ApiException($shell_result->Error, ApiErrorCode::COMMAND_ERROR);
    }

    return ['Success' => TRUE];
  }

  /**
    * Updates user GECOS data.
    */
  public function UpdateUserGECOS($login, $fullName = '', $address = '', $phoneWork = '', $phoneHome = '', $email = '')
  {
    $gecos = 
    TextHelper::RemoveChars(TextHelper::EscapeString($fullName, ['"', ',']), [':', chr(13), chr(10)]).','.
    TextHelper::RemoveChars(TextHelper::EscapeString($address, ['"', ',']), [':', chr(13), chr(10)]).','.
    TextHelper::RemoveChars(TextHelper::EscapeString($phoneWork, ['"', ',']), [':', chr(13), chr(10)]).','.
    TextHelper::RemoveChars(TextHelper::EscapeString($phoneHome, ['"', ',']), [':', chr(13), chr(10)]).','.
    TextHelper::RemoveChars(TextHelper::EscapeString($email, ['"', ',']), [':', chr(13), chr(10)]);

    $cmd = 'sudo usermod --comment "'.$gecos.'" '.$login.' && echo "OK"';

    $shell_result = $this->ExecuteCommand($cmd);

    if (!$shell_result->OutputAre('OK'))
    {
      throw new ApiException($shell_result->Error, ApiErrorCode::COMMAND_ERROR);
    }

    return ['Success' => TRUE];
  }
    
  /**
    * Updates user groups.
    */
  public function UpdateUserGroups($login, $groups)
  {
    $shell_result = $this->ExecuteCommand('sudo usermod --groups '.implode(',', $groups).' '.$login.' && echo "OK"');

    if (!$shell_result->OutputAre('OK'))
    {
      throw new ApiException('Failed to to update the list of user groups: '.$shell_result->Error, ApiErrorCode::COMMAND_ERROR);
    }

    return ['Success' => TRUE];
  }

  /**
    * Updates user account.
    */
  public function UpdateUserAccount($login, $setLogin = FALSE, $newLogin = NULL, $setPassword = FALSE, $newPassword = NULL, $setShell = FALSE, $newShell = NULL)
  {
    $shell_result = $this->ExecuteCommand('sudo grep "'.$login.'" /etc/passwd');

    if ($shell_result->Error != '')
    {
      throw new ApiException($shell_result->Error, ApiErrorCode::COMMAND_ERROR);
    }

    $user = $this->ParseUser($shell_result->Output);

    // change username
    if ((bool)$setLogin && $newLogin != $login)
    {
      // rename
      $shell_result = $this->ExecuteCommand('sudo usermod --login '.$newLogin.' '.$login.' && echo "OK"');

      if (!$shell_result->OutputAre('OK'))
      {
        throw new ApiException('Failed to change the user name: '.$shell_result->Error, ApiErrorCode::COMMAND_ERROR);
      }

      // change home path
      if ($user->HomePath != ''){
        $shell_result = $this->ExecuteCommand('sudo usermod --home /home/'.$newLogin.' --move-home '.$newLogin.' && echo "OK"');

        if (!$shell_result->OutputAre('OK'))
        {
          throw new ApiException('Failed to change the user home directory: '.$shell_result->Error, ApiErrorCode::COMMAND_ERROR);
        }
      }

      $login = $newLogin;
    }

    // change password
    if ((bool)$setPassword && isset($newPassword) && $newPassword != '')
    {
      // $shell_result = $this->ExecuteCommand('sudo usermod --password '.$data['NewPassword'].' '.$data['Login'].' && echo "OK"');
      $shell_result = $this->ExecuteCommand('sudo bash -c \'echo -e "'.$newPassword.'\n'.$newPassword.'" | passwd "'.$login.'"\' && echo "OK"');

      if (!$shell_result->OutputAre('OK'))
      {
        throw new ApiException('Failed to set a new password: '.$shell_result->Error, ApiErrorCode::COMMAND_ERROR);
      }
    }

    // change shell
    if ((bool)$setShell && isset($newShell) && $newShell != '')
    {
      $shell_result = $this->ExecuteCommand('sudo usermod --shell '.$newShell.' '.$login.' && echo "OK"');

      if (!$shell_result->OutputAre('OK'))
      {
        throw new ApiException('Failed to set a new shell: '.$shell_result->Error, ApiErrorCode::COMMAND_ERROR);
      }
    }

    return ['Success' => TRUE];
  }

  #endregion
  #region ..Private methods..

  /**
    * Returns list of users.
    * 
    * @param string $search The user filter string.
    * @param int $page Current page number.
    * @param int $dataPerPage The number of data on a single page.
    * 
    * @return \WebAPI\Users\Models\UsersList
    */
  private function GetUsersList($page, $dataPerPage, $search)
  {
    if (!isset($page) || (int)$page <= 0) { $page = 1; }
    if (!isset($dataPerPage) || (int)$dataPerPage <= 0) { $dataPerPage = PHP_INT_MAX; }

    $page--;

    $command = [];
    
    if (isset($search) && $search != '')
    {
      $command[] = 'sudo grep "'.TextHelper::EscapeString($search).'*" /etc/passwd | wc -l';
      $command[] = 'sudo cat /etc/passwd | grep "'.TextHelper::EscapeString($search).'*" | sudo sed -n "'.($page == 0 ? 1 : ($page * $dataPerPage) + 1).','.(($page * $dataPerPage) + $dataPerPage).'"p';
    }
    else
    {
      $command[] = 'sudo wc -l < /etc/passwd';
      $command[] = 'sed -n "'.($page == 0 ? 1 : ($page * $dataPerPage) + 1).','.(($page * $dataPerPage) + $dataPerPage).'"p /etc/passwd';
    }

    $shell_result = $this->ExecuteCommand($command);

    $result = new \WebAPI\Users\Models\UsersList();
    $result->TotalRecords = (int)$shell_result[0]->Output;
    $result->CurrentPage = (int)$page + 1;
    $result->DataPerPage = (int)$dataPerPage;

    $users = preg_split('/[\r\n]+/', $shell_result[1]->Output, -1, PREG_SPLIT_NO_EMPTY);

    foreach ($users as $user)
    {
      $result->Items[] = $this->ParseUser($user);
    }

    return $result;
  }

  /**
    * Parses user from string.
    * 
    * @param string $value 
    * @return \WebAPI\Users\Models\User
    */
  private function ParseUser($value)
  {
    // login : password : UID : GID : GECOS : home : shell
    // aleksey:x:1000:1000:Aleksey Nemiro,,,:/home/aleksey:/bin/bash
    // GECOS: full name, address, work phome, home phone, email
    $fields = explode(':', $value);
    $u = new \WebAPI\Users\Models\User();
    $u->Login = isset($fields[0]) ? $fields[0] : NULL;
    $u->Password = isset($fields[1]) ? $fields[1] : NULL;
    $u->Id = isset($fields[2]) ? $fields[2] : NULL;
    $u->GroupId = isset($fields[3]) ? $fields[3] : NULL;
    $u->HomePath = isset($fields[5]) ? $fields[5] : NULL;
    $u->Shell = isset($fields[6]) ? $fields[6] : NULL;

    // GECOS
    if (isset($fields[4]) && $fields[4] != '')
    {
      $fields = explode(',', str_replace('\,', chr(1), $fields[4]));
      $u->FullName = isset($fields[0]) ? str_replace(chr(1), ',', $fields[0]) : NULL;
      $u->Address = isset($fields[1]) ? str_replace(chr(1), ',', $fields[1]) : NULL;
      $u->PhoneWork = isset($fields[2]) ? str_replace(chr(1), ',', $fields[2]) : NULL;
      $u->PhoneHome = isset($fields[3]) ? str_replace(chr(1), ',', $fields[3]) : NULL;
      $u->Email = isset($fields[4]) ? str_replace(chr(1), ',', $fields[4]) : NULL;
    }

    return $u;
  }

  /**
    * Returns list of groups.
    * 
    * @return \WebAPI\Users\Models\Group[]
    */
  private function GetGroupsList()
  {
    $shell_result = $this->ExecuteCommand('sudo cat /etc/group')->Output;
    $groups = preg_split('/[\r\n]+/', $shell_result, -1, PREG_SPLIT_NO_EMPTY);
    $result = array();

    foreach ($groups as $group)
    {
      // name : password : GID : member1,member2...
      // mysql:x:117:
      $fields = explode(':', $group);
      $g = new \WebAPI\Users\Models\Group();
      $g->Name = $fields[0];
      $g->Password = $fields[1];
      $g->Id = $fields[2];
      $g->Members = explode(',', $fields[3]);

      $result[] = $g;
    }
    
    return $result;
  }

  #endregion

}