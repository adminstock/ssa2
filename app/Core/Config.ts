/*
 * Copyright © AdminStock Team (www.adminstock.net), 2016. All rights reserved.
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

import ApiServer from 'Models/ApiServer';

/**
 * Provides config of SmallServerAdmin.
 */
export default class Config {

  public static get ListOfApiServers(): Array<ApiServer> {
    if (window.sessionStorage.getItem('ApiServers') == null || window.sessionStorage.getItem('ApiServers') == '') {
      return null;
    } else {
      return JSON.parse(window.sessionStorage.getItem('ApiServers'));
    }
  }
  public static set ListOfApiServers(value: Array<ApiServer>) {
    if (value == null || value.length == 0) {
      window.sessionStorage.removeItem('ApiServers');
    } else {
      window.sessionStorage.setItem('ApiServers', JSON.stringify(value));
    }
  }

  constructor() {
    Debug.Warn('"Config" is static class. No need to create an instance of this class.');
  }

}