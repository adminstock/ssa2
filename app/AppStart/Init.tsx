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

require('bootstrap-loader');
require('font-awesome-loader');
require('default-theme');

require('es6-shim');
require('jquery');

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, IndexRedirect, browserHistory } from 'react-router';
import LayoutMain from 'Layouts/Main';
import LayoutBlank from 'Layouts/Blank';
import App from 'Core/App';
import { Overlay, OverlayType } from 'UI/Overlay';
import ApiServer from 'Models/ApiServer';

if (process.env.NODE_ENV === 'production') {
  console.log('SmallServerAdminV2', 'production');
} else {
  console.warn('SmallServerAdminV2', 'development');
  console.warn('The application assembled in debug mode, with the conclusion of detailed reports and with uncompressed files.');
}

// routes
const routes = (
  <Router history={browserHistory}>
    {/*these pages in the main template*/}
    <Route path="/" component={LayoutMain}>
      <IndexRoute getComponent={(location, callback) => { LoadComponent(location, callback); } } />

      {/* modules */}

      <Route path="/control">
        <IndexRedirect to="/error?code=HTTP404" />
        <Route path="/control/servers" getComponent={(nextState, callback) => { LoadComponent(nextState.location, callback); } } />
      </Route>

      <Route path="/users">
        <IndexRoute getComponent={(location, callback) => { LoadComponent(location, callback); } } />
        <Route path="/users/edit" getComponent={(nextState, callback) => { LoadComponent(nextState.location, callback); } } />
        <Route path="/users/edit?id=:id" getComponent={(nextState, callback) => { LoadComponent(nextState.location, callback); } } />
      </Route>

      <Route path="/services" getComponent={(nextState, callback) => { LoadComponent(nextState.location, callback); } } />

      <Route path="/files" getComponent={(nextState, callback) => { LoadComponent(nextState.location, callback); } } />

      <Route path="/monitoring" getComponent={(nextState, callback) => { LoadComponent(nextState.location, callback); } } />
    </Route>

    <Route component={LayoutBlank}>
      {/* login page */}
      <Route path="/login" getComponent={(nextState, callback) => { LoadComponent(nextState.location, callback); } } />
      {/* error page */}
      <Route path="/error" getComponent={(nextState, callback) => { LoadComponent(nextState.location, callback); } } />
    </Route>

    {/* unknown routes */}
    <Route path="*" getComponent={(nextState, callback) => { LoadComponent(nextState.location, callback); } } />
  </Router>
);

/**
 * Loads the specified component.
 *
 * @param module Module name or path.
 * @param params Parameters to be passed to a component instance.
 * @param callback The callback function.
 */
export function LoadComponent(location: any, callback: (error: any, component?: string | React.ComponentClass<any> | React.StatelessComponent<any>) => void): void {
  Debug.Call('Loading', location.pathname, location);

  Overlay.Show(OverlayType.White | OverlayType.Loader | OverlayType.Opacity90);

  App.AbortAllRequests();

  if (location.pathname != '/init' && location.pathname != '/login' && location.pathname != '/error') { // TODO: array
    // check servers list
    if (App.Config.ListOfApiServers == null) {
      Init(location.pathname);
      return;
    }

    // check access
    if (App.CurrentUser.AccessToken == null || !App.CurrentUser.IsValid) {
      App.Redirect('/login', { returnUrl: location.pathname });
      return;
    }
  }

  var me = { location: location, callback: callback };

  // idiocy...
  // currently not found a better solution
  // the problem is that need explicitly specify [require] for Webpack

  switch (location.pathname) {
    case '/':
    case '/index':
      require(['Pages/Index'], LoadedComponent.bind(me));
      break;

    case '/login':
      require(['Pages/Login/Index'], LoadedComponent.bind(me));
      break;

    case '/error':
      require(['Pages/Error'], LoadedComponent.bind(me));
      break;

    case '/control/servers':
      require(['Modules/Control/Servers'], LoadedComponent.bind(me));
      break;

    case '/users':
      require(['Modules/Users/Index'], LoadedComponent.bind(me));
      break;

    case '/users/edit':
      require(['Modules/Users/Edit'], LoadedComponent.bind(me));
      break;

    default:
      //console.error('Cannot find path "' + location.pathname + '"');
      App.Redirect('/error', { msg: 'Cannot find path "' + location.pathname + '"', code: 'HTTP404' });
  }

}

/**
 * Handler of loading results of a component.
 *
 * @param component Loaded component.
 */
export function LoadedComponent(component: any): void {
  Debug.Call('Loaded', this.location.pathname);

  Overlay.Hide();

  this.callback(null, props => React.createElement(component.default, this.location.query || this.location.params));
}

export function Init(returnUrl: string): void {
  Overlay.Show(OverlayType.Loader | OverlayType.White, __('Initialization...'));

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
        App.Redirect(returnUrl);
      } else {
        App.Redirect('/error', { msg: 'List of servers is empty...' });
      }
    },

    // server returned error
    error: (x: JQueryXHR, textStatus: string, errorThrown: any) => {
      Debug.Response('LoadServers.Error', x, textStatus, errorThrown);
      App.Redirect('/error', { msg: (textStatus || errorThrown) });
    }
  });
}

// render
ReactDOM.render(routes, document.getElementById('app'));