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

import { browserHistory } from 'react-router';
import ApiServer from 'Models/ApiServer';
import IMainContext from 'IMainContext';

/**
 * ...
 */
export default class App {

  private static _Context: IMainContext = null;

  /** Gets current context. */
  public static get Context(): IMainContext {
    return App._Context;
  }

  constructor() {
    Debug.Warn('"App" is static class. No need to create an instance of this class.');
  }

  /**
   * Sets context. It is used only once in the main application component.
   *
   * @param context
   */
  public static SetContext(context: IMainContext): void {
    App._Context = context;
  }


  /**
   * Redirect to a specified URL or to route.
   *
   * @param url The absolute or relative address.
   */
  public static Redirect(url: string): void {
    Debug.Log('Redirect', url);

    if (url.toLowerCase().startsWith('http:') || url.toLowerCase().startsWith('https:')) {
      window.location.href = url;
    } else {
      browserHistory.push(url);
    }
  }

}