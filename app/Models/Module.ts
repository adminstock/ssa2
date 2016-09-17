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
 * Represents ssa module.
 */
export default class Module {

  /** Module name. */
  public Name: string;
    
  /** Status. */
  public Enabled: boolean;

  public Settings: any;

  /**
   * Short description.
   */
  public Description: string;

  /**
   * Module version number. For example: 1.0.0
   */
  public Version: string;

  /**
   * Date relase (YYYY-MM-DD).
   */
  public DateRelease: string;

  /**
   * Homepage URL.
   */
  public Homepage: string;

  /**
   * ReadMe file name.
   */
  public ReadMe: string;

  /**
   * ChangeLog file name.
   */
  public ChangeLog: string;

  /**
   * Module authors.
   */
  public Authors: Array<any>;

  /**
   * Module icon.
   */
  public Icons: Array<any>;

  constructor(name?: string, enabled?: boolean) {
    this.Name = name;
    this.Enabled = enabled;
  }

}