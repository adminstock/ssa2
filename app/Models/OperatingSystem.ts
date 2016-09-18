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

import IOperatingSystem from 'IOperatingSystem';

export class OperatingSystemFamily {

  /** GNU/Linux */
  public static get FAMILY_LINUX(): string { return 'Linux'; }

  /** BSD, OS X */
  public static get FAMILY_BSD(): string { return 'BSD'; }

  public static get FAMILY_WINDOWS(): string { return 'Windows'; }

  public static get FAMILY_UNIX(): string { return 'Unix'; }

  /**
   * Gets a value indicating whether specified value is family of OS.
   *
   * @param value Family name to check.
   */
  public static IsKnownFamily(value: string): boolean {
    if (value == null || value == '') {
      return false;
    }

    return ['unix', 'linux', 'bsd', 'windows'].indexOf(value.toLowerCase()) != -1;
  }

}

/**
 * Represents information about an operating system.
 */
export class OperatingSystem implements IOperatingSystem {

  /** Name. For example: Windows 7, Debian, Ubuntu, OS X. */
  public Name: string;

  /** The family of operating systems. For example: Linux, MacOSX, Win32 */
  public Family: string;

  /** Version number of the operating system. For example: 6.1.7601 */
  public Version: string;

  constructor() {
    this.Name = '';
    this.Family = '';
    this.Version = '';
  }

}