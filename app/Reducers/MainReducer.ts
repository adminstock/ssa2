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
import IAppContext from 'Core/IAppContext';

const initState: IAppContext = {
  AvailableApiServers: null,
  AppError: null,
  Visible: true
};

export default function MainReducer(state: IAppContext = initState, action) {
  switch (action.type) {
    case ActionType.SET_VISIBLE:
      return Object.assign({}, state, { Visible: action.Visible });

    case ActionType.SET_ERROR:
      return Object.assign({}, state, { AppError: { Title: action.Title, Text: action.Text } });

    case ActionType.CLEAR_ERROR:
      return Object.assign({}, state, { AppError: null });

    case ActionType.SET_API_SERVERS:
      return Object.assign({}, state, { AvailableApiServers: action.Servers });

    default:
      return state;
  }
}