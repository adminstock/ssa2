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
 * Represents element of module settings.
 */
class ModuleSettingsElement
{

  /**
   * Parameter name.
   */
  public $Name;

  /** 
   * Element title
   */
  public $Title;

  /**
   * Element type: text, textarea, dropdownlist etc.
   */
  public $Type;

  /**
   * Additional attributes of the element.
   */
  public $Attributes;

  /**
   * The data for the element. Mainly for lists.
   * 
   * @var []
   */
  public $Data;

  /**
   * Gets or sets the property to display.
   * 
   * The name of an object property that is contained in the collection specified by the $Data property.
   * 
   * @var string
   */
  public $DataDisplayField;

  /**
   * Gets or sets the property to use as the actual value for the items in the collection.
   * 
   * The name of an object property that is contained in the collection specified by the $Data property.
   * 
   * @var string
   */
  public $DataValueField;
  
}