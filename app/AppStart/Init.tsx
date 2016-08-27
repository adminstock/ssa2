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

require('bootstrap-loader');
require('font-awesome-loader');
require('default-theme');

require('es6-shim');
require('jquery');

// react
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// redux
import { applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

// redux-dev-tools
import { ReduxDevTools, ReduxEnhancer } from 'ReduxDevTools';

import App from 'Core/App';
import SmallServerAdmin from 'SmallServerAdmin';
import RouteConfig from 'RouteConfig';

// init redux
/*export const ReduxEnhancer = compose<any>(
  // Middleware you want to use in development:
  applyMiddleware(thunk)
);*/

App.Init(ReduxEnhancer);

// render
ReactDOM.render((
  <Provider store={App.Store}>
    <div>
      <SmallServerAdmin>
        <RouteConfig />
      </SmallServerAdmin>

      <ReduxDevTools />
    </div>
  </Provider>
), document.getElementById('app'));