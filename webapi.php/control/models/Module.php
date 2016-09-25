<?php
namespace WebAPI\Control\Models;

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
 * Represents module info.
 */
class Module implements \WebAPI\Core\IObjectProperties
{

  /**
   * Module name (folder name).
   * 
   * @var string
   */
  public $Name;
  
  /**
   * Human name.
   * 
   * @var string
   */
  public $Title;

  /**
   * Short description.
   * 
   * @var string
   */
  public $Description;

  /**
   * Module version number. For example: 1.0.0
   * 
   * @var string
   */
  public $Version;

  /**
   * Date relase (YYYY-MM-DD).
   * 
   * @var string
   */
  public $DateRelease;

  /**
   * License name or URL.
   * 
   * @var string
   */
  public $License;

  /**
   * Homepage URL.
   * 
   * @var string
   */
  public $Homepage;

  /**
   * ReadMe file name.
   * 
   * @var string
   */
  public $ReadMe;

  /**
   * ChangeLog file name.
   * 
   * @var string
   */
  public $ChangeLog;

  /**
   * Module authors.
   * 
   * @var Author[]
   */
  public $Authors;

  /**
   * Module icon.
   * 
   * @var Icon[]
   */
  public $Icons;

  /** 
   * Settings schema.
   * 
   * @var ModuleSettingsTab[]
   */
  public $Settings;

  public function GetObjectProperties() 
  {
    return [
      'Authors' => '\WebAPI\Control\Models\Author[]', 
      'Icons' => '\WebAPI\Control\Models\Icon[]',
      'Settings' => '\WebAPI\Control\Models\ModuleSettingsTab[]'
    ];
  }

}