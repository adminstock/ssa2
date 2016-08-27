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

// import { combineReducers } from 'redux';
import ActionType from 'Actions/ActionType';
import { Session, Cookies } from 'Helpers/Storage';

export default function MainReducer(state, action) {
  Debug.Reducer('MainReducer', action.type);

  switch (action.type) {
    case ActionType.SET_VISIBLE:
      return Object.assign({}, state, { Visible: action.Visible });

    case ActionType.SET_ERROR:
      return Object.assign({}, state, { AppError: { Title: action.Title, Text: action.Text } });

    case ActionType.CLEAR_ERROR:
      return Object.assign({}, state, { AppError: null });

    case ActionType.SET_API_SERVERS:
      return Object.assign({}, state, { AvailableApiServers: action.Servers });

    case ActionType.SET_ACTIVE_API_SERVER:
      return Object.assign({}, state, { ActiveApiServer: action.Server });

    case ActionType.SET_SERVER:
      if (action.CurrentServer == null || action.CurrentServer.FileName == null || action.CurrentServer.FileName == '') {
        Cookies.Delete('managed-server');
        Session.Set('ManagedServer', null);
      } else {
        Cookies.Add('managed-server', action.CurrentServer.FileName, 365);
        Session.Set('ManagedServer', action.CurrentServer);
      }
      
      return Object.assign({}, state, { CurrentServer: action.CurrentServer });

    case ActionType.SET_ACCESS_TOKEN:
      Session.Set('AccessToken', action.AccessToken);
      let cu = Object.assign({}, state.CurrentUser, { AccessToken: action.AccessToken });
      return Object.assign({}, state, { CurrentUser: cu });

    case ActionType.SET_LANGUAGE:
      // set to cookies
      Cookies.Add('lang', action.Language, 365);

      // set to state
      let cu2 = Object.assign({}, state.CurrentUser, { Language: action.Language });
      return Object.assign({}, state, { CurrentUser: cu2 });

    case ActionType.SET_BREADCRUMBS:
      let currentPage = Object.assign({}, state.CurrentPage, { Breadcrumbs: action.Breadcrumbs });
      return Object.assign({}, state, { CurrentPage: currentPage });

    /*case 'SET_API_SERVERS':
      return [...state, {}];

    case 'SET_API_SERVER':
      return [...state, {}];
      
    case 'SET_ACCESS_TOKEN':
      return [...state, { IsValid: true }];
      */

    default:
      return state;
  }
}