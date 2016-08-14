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

import * as React from 'react';
import App from 'Core/App';
import { Overlay, OverlayType } from 'UI/Overlay';
import ApiServer from 'Models/ApiServer';

/**
 * Initializes a list of API servers.
 */
export default class InitServers extends React.Component<any, any> {

  constructor(props, context) {
    super(props, context);

    Overlay.Show(OverlayType.Loader | OverlayType.White, __('Initialization...'));
  }

  componentWillMount() {
    if (App.Config.ListOfApiServers == null) {
      this.LoadServers();
    } else {
      App.Redirect('/');
    }
  }

  private LoadServers(): void {
    $.ajax({
      cache: false,
      crossDomain: true,
      type: 'GET',
      dataType: 'json',
      url: '/servers.json',

      // handler of request succeeds
      success: (result: Array<ApiServer>) => {
        Debug.Response('LoadServers.Success', result);

        App.Config.ListOfApiServers = result;

        if (result != null && result.length > 0) {
          App.Redirect('/');
        } else {
          // TODO
        }
      },

      // server returned error
      error: (x: JQueryXHR, textStatus: string, errorThrown: any) => {
        Debug.Response('LoadServers.Error', x, textStatus, errorThrown);

        if (textStatus == 'abort') {
          // skip
          return;
        }

        // TODO:

      }/*,

      complete: (x: JQueryXHR, textStatus: string) => {
        Debug.Level3('LoadServers.Complete');
      }*/
    });
  }

  render() {
    return null;
  }

}