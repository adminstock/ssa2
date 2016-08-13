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
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router';
import LayoutMain from 'Layouts/Main';
import App from 'Core/App';
import { Overlay, OverlayType } from 'UI/Overlay';

if (process.env.NODE_ENV === 'production') {
  console.log('SmallServerAdminV2', 'production');
} else {
  console.warn('SmallServerAdminV2', 'development');
  console.warn('The application assembled in debug mode, with the conclusion of detailed reports and with uncompressed files.');
}

// routes
const routes = (
  <Router history={browserHistory}>
  <Route path="/" component={LayoutMain}>
    <IndexRoute getComponent={(location, callback) => { LoadComponent(location, callback); } } />

    <Route path="/Users">
      <IndexRoute getComponent={(location, callback) => { LoadComponent(location, callback); } } />
      <Route path="/Users/Edit" getComponent={(nextState, callback) => { LoadComponent(nextState.location, callback); } } />
      <Route path="/Users/Edit?id=:id" getComponent={(nextState, callback) => { LoadComponent(nextState.location, callback); } } />
    </Route>

    <Route path="/Services" getComponent={(nextState, callback) => { LoadComponent(nextState.location, callback); } } />

    <Route path="/Files" getComponent={(nextState, callback) => { LoadComponent(nextState.location, callback); } } />

    <Route path="/Monitoring" getComponent={(nextState, callback) => { LoadComponent(nextState.location, callback); } } />
  </Route>
</Router>);

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

  var me = { location: location, callback: callback };

  // idiocy...
  // currently not found a better solution
  // the problem is that need explicitly specify [require] for Webpack

  switch (location.pathname) {
    case '/':
    case '/Index':
      require(['Index'], LoadedComponent.bind(me));
      break;

    case '/Users':
      require(['Modules/Users/Index'], LoadedComponent.bind(me));
      break;

    case '/Users/Edit':
      require(['Modules/Users/Edit'], LoadedComponent.bind(me));
      break;

    default:
      console.error('Cannot find module "' + module + '"');
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

// render
ReactDOM.render(routes, document.getElementById('app'));