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
 * Represents information about an operating system.
 */
export interface IOperatingSystem {

  /** Name. For example: Windows 7, Debian, Ubuntu, OS X. */
  Name?: string;

  /** The family of operating systems. For example: Linux, MacOSX, Win32 */
  Family?: string;

  /** Version number of the operating system. For example: 6.1.7601 */
  Version?: string;

}

export default IOperatingSystem;