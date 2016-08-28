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

import ActionType from 'Actions/ActionType';
import { Session, Cookies } from 'Helpers/Storage';
import ICurrentUser from 'Core/ICurrentUser';

const initState: ICurrentUser = {
  AccessToken: Session.Get<string>('AccessToken'),
  Language: Cookies.Get('lang') || 'en',
  ApiServer: null,
  Server: null
};

export default function UserReducer(state: ICurrentUser = initState, action) {
  switch (action.type) {
    case ActionType.SET_ACCESS_TOKEN:
      Session.Set('AccessToken', action.AccessToken);
      return Object.assign({}, state, { AccessToken: action.AccessToken });

    case ActionType.SET_LANGUAGE:
      // set to cookies
      Cookies.Add('lang', action.Language, 365);

      // set to state
      return Object.assign({}, state, { Language: action.Language });

    case ActionType.SET_ACTIVE_API_SERVER:
      return Object.assign({}, state, { ApiServer: action.Server });

    case ActionType.SET_SERVER:
      if (action.Server == null || action.Server.FileName == null || action.Server.FileName == '') {
        Cookies.Delete('managed-server');
        Session.Set('ManagedServer', null);
      } else {
        Cookies.Add('managed-server', action.Server.FileName, 365);
        Session.Set('ManagedServer', action.Server);
      }

      return Object.assign({}, state, { Server: action.Server });

    default:
      return state;
  }
}