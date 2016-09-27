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

export default class ModuleSettingsElement {

  /** Parameter name. */
  public Name: string;

  /** Element title. */
  public Title: string;

  /**
   * Element type: text, textarea, dropdownlist etc.
   */
  public Type: string;

  /**
   * Additional attributes of the element.
   */
  public Attributes: Array<any>;

  /**
   * The data for the element. Mainly for lists.
   */
  public Data: Array<any>;

  public DataDisplayField: string;

  public DataValueField: string;

}