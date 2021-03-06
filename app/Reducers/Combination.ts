﻿/*
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

import { combineReducers } from 'redux';
import { intlReducer } from 'react-intl-redux';
import { routerReducer } from 'react-router-redux';

import AppReducer from 'AppReducer';
import UserReducer from 'UserReducer';
import OverlayReducer from 'OverlayReducer';
import PageReducer from 'PageReducer';
import ModalReducer from 'UI/Modal/Reducer';

export const RootReducer = combineReducers<any>({
  AppContext: AppReducer,
  CurrentUser: UserReducer,
  CurrentPage: PageReducer,
  Overlay: OverlayReducer,
  ModalManager: ModalReducer,
  intl: intlReducer,
  routing: routerReducer
});