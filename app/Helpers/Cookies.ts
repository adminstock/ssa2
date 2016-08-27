/*
 * Copyright © ArimSoft Ltd, 2016. All rights reserved.
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
 * Helper class for working with cookies.
 */
export default class Cookies {

  /** 
   * Adds the specified cookie to the cookie collection.
   * 
   * @param name The name of the cookie.
   * @param value Specifies the value.
   * @param days The days on which the cookie expires.
   * @param path If specified, the cookie is sent only to requests to this path. If this attribute is not set, the application path is used (/).
   */
  public static Add(name: string, value: string, days?: number, path?: string) {
    let expires = '';
    let date = new Date();

    if (path === undefined || path == null || path == '') {
      path = '/';
    }

    if (days !== undefined && days !== null) {
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }

    document.cookie = name + '=' + value + expires + '; path=' + path;
  }

  /** 
   * Returns cookie value by name. If value not found, returns null.
   * 
   * @param name The name of the cookie.
   */
  public static Get(name: string): string {
    let ca = document.cookie.split(';');

    name = name + '=';

    for (var i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }

    return null;
  }

  /** 
   * Removes a cookie.
   * 
   * @param name The name of the cookie.
   */
  public static Delete(name: string) {
    Cookies.Add(name, '', -1);
  }

}