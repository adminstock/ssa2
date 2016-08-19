/*
 * Copyright © AdminStock Team (www.adminstock.net), 2016. All rights reserved.
 * Copyright © Aleksey Nemiro (aleksey.nemiro.ru), 2016. All rights reserved.
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

import CookiesHelper from 'Helpers/CookiesHelper';
import ApiServer from 'Models/ApiServer';
import Config from 'Config';

/**
 * Provides current user.
 */
export default class CurrentUser {

  /**
   * Gets or sets access token.
   */
  public static get AccessToken(): string {
    return CurrentUser.GetSession<string>('AccessToken');
  }
  public static set AccessToken(value: string) {
    CurrentUser.SetSession('AccessToken', value);

    if (value == null) {
      CurrentUser.IsValid = false;
    }
  }

  /**
   * Gets or sets the status of the relevance of the access token.
   */
  public static get IsValid(): boolean {
    return CurrentUser.GetSession<boolean>('IsValid', false);
  }
  public static set IsValid(value: boolean) {
    CurrentUser.SetSession('IsValid', value);
  }

  /**
   * Gets or sets language.
   */
  public static get Language(): string {
    return CookiesHelper.Get('lang');
  }
  public static set Language(value: string) {
    let currentLang = CurrentUser.Language;

    CookiesHelper.Add('lang', value, 365);

    if (currentLang != value) {
      window.location.reload(true);
    }
  }

  private static ApiServerIsSet: boolean = false;
  private static _ApiServer: ApiServer;

  /**
   * Gets or sets host of the WebAPI server.
   */
  public static get ApiServer(): ApiServer {
    if (!CurrentUser.ApiServerIsSet) {
      let apiUrl = CookiesHelper.Get('api-url');

      if (apiUrl != null) {
        // search server in the list of servers
        var servers = Config.ListOfApiServers.filter((item) => item.Url == apiUrl);
        if (servers.length > 0) {
          // set server 
          CurrentUser._ApiServer = servers[0];

          // debug mode
          if (process.env.NODE_ENV !== 'production') {
            if (servers.length > 1) {
              Debug.Warn('Found more than one server with the url <' + apiUrl + '>');
            }
          }
        }
      }

      if (CurrentUser._ApiServer == null) {
        if (Config.ListOfApiServers != null && Config.ListOfApiServers.length > 0) {
          // select first
          CurrentUser._ApiServer = Config.ListOfApiServers[0];
        } else {
          console.warn('There are no servers in the application settings. Please check settings.');
        }
      }

      CurrentUser.ApiServerIsSet = true;
    }

    return CurrentUser._ApiServer;
  }
  public static set ApiServer(value: ApiServer) {
    CookiesHelper.Add('api-url', value.Url, 365);
    CurrentUser._ApiServer = value;
  }

  /**
   * Gets or sets config file of the server to manage.
   */
  public static get ManagedServer(): string {
    return CookiesHelper.Get('managed-server');
  }
  public static set ManagedServer(value: string) {
    CookiesHelper.Add('managed-server', value, 365);
  }

  constructor() {
    Debug.Warn('"CurrentUser" is static class. No need to create an instance of this class.');
  }

  /**
   * Gets data from sessionStorage.
   *
   * @param key
   */
  private static GetSession<T>(key: string, defaultValue?: any): T {
    if (window.sessionStorage.getItem(key) == null || window.sessionStorage.getItem(key) == '') {
      if (defaultValue !== undefined) {
        return defaultValue;
      } else {
        return null;
      }
    } else {
      return JSON.parse(window.sessionStorage.getItem(key));
    }
  }

  /**
   * Sets data to sessionStorage.
   *
   * @param key
   * @param value
   */
  private static SetSession(key: string, value: any): void {
    if (value == null) {
      window.sessionStorage.removeItem(key);
    } else {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    }
  }

}