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
 * List of special options for modules.
 */
abstract class ModuleFlags
{

  const NONE = 0;

  /**
   * Access to the server is not needed.
   */
  const WITHOUT_SERVER = 1;

  /**
   * Allow anonymous access.
   */
  const ANONYMOUS = 2;

  final public static function HasFlag($value, $flag)
  {
    return ($value & $flag) === $flag;
  }

}