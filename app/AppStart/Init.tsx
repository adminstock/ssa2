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
require('isomorphic-fetch');
require('jquery');

// react
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// react-intl
import { addLocaleData } from 'react-intl';
//const ssa_langs = ['en', 'ru', 'de']; TODO: to dynamic
const reactIntlEn = require('react-intl/locale-data/en') as ReactIntl.Locale[];
const reactIntlRu = require('react-intl/locale-data/ru') as ReactIntl.Locale[];
const reactIntlDe = require('react-intl/locale-data/de') as ReactIntl.Locale[];
addLocaleData([...reactIntlEn, ...reactIntlRu, ...reactIntlDe]);
// --

// redux
import { applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
// import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';
// import { Provider } from 'react-intl-redux';
import { IntlProvider } from 'react-intl-redux'
// import thunk from 'redux-thunk';

// redux-dev-tools
import { ReduxDevTools, ReduxEnhancer } from 'ReduxDevTools';


import App from 'Core/App';
import SmallServerAdmin from 'SmallServerAdmin';
import RouteConfig from 'RouteConfig';
import { Overlay } from 'UI/Overlay/index';
import { LoadLanguage } from 'Actions/Global';

// init redux
/*export const ReduxEnhancer = compose<any>(
  // Middleware you want to use in development:
  applyMiddleware(thunk)
);*/

if (DEV_MODE) {
  console.log('%cSmallServerAdmin v' + SSA_VERSION + ' (development)', 'font-weight:bold;color:white;background-color:black;font-size:150%;padding:4px 12px 4px 12px;border-radius:24px 6px;');
  console.warn('The application assembled in debug mode, with the conclusion of detailed reports and with uncompressed files.');
} else {
  console.log('%cSmallServerAdmin v' + SSA_VERSION + ' (production)', 'font-weight:bold;');
}

// init application
App.Init(ReduxEnhancer);

// init locale
if (App.CurrentUser != null && App.CurrentUser.Language != App.Store.getState().intl.locale) {
  App.Store.dispatch(LoadLanguage(App.CurrentUser.Language));
}

// render
ReactDOM.render((
  <Provider store={App.Store}>
    <div>
      <ReduxDevTools />
      <Overlay />

      <IntlProvider>
        <SmallServerAdmin>
          <RouteConfig />
        </SmallServerAdmin>
      </IntlProvider>
    </div>
  </Provider>
), document.getElementById('app'));