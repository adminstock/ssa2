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

import * as React from 'react';
import { Router, Route, Link, IndexRoute, IndexRedirect, browserHistory } from 'react-router';
import { LoadServer, SetServer, ShowOverlay, HideOverlay, Logout } from 'Actions/Global';
import { OverlayType } from 'UI/Overlay/OverlayType';
import { Cookies } from 'Helpers/Storage';
import App from 'Core/App';
import LayoutMain from 'Layouts/Main';
import LayoutBlank from 'Layouts/Blank';

/**
 * Loads the specified component.
 *
 * @param module Module name or path.
 * @param params Parameters to be passed to a component instance.
 * @param callback The callback function.
 */
export function LoadComponent(location: any, callback: (error: any, component?: string | React.ComponentClass<any> | React.StatelessComponent<any>) => void): void {
  Debug.Call('Loading', location.pathname, location);

  App.Store.dispatch(ShowOverlay(OverlayType.White | OverlayType.Loader | OverlayType.Opacity90, 'Page loading...'));

  App.AbortAllRequests();

  if (location.pathname != '/login' && location.pathname != '/error') {
    // check access
    if (App.CurrentUser.AccessToken == null || App.CurrentUser.AccessToken == '') {
      App.Store.dispatch(HideOverlay('Loaded'));

      // redirect to login page
      App.Redirect('/login', { returnUrl: location.pathname + (location.search ? location.search : '') });
      return;
    }

    // check managed server
    if (App.CurrentServer == null) {
      let serverName = Cookies.Get('managed-server');

      App.Store.dispatch(HideOverlay('Loaded'));

      if (serverName != null && serverName != '') {
        // load server data
        App.Store.dispatch(LoadServer(serverName, (server) => {
          // set server
          App.Store.dispatch(SetServer(server));
          // reload
          LoadComponent(location, callback);
        }, (error) => {
          // remove server from cookies
          Cookies.Delete('managed-server');
          // redirect to error page
          App.Redirect('/error', {msg: error.Text});
        }));

        return;
      }
      else {
        // redirect to list of servers
        if (location.pathname != '/control/servers') {
          App.Store.dispatch(HideOverlay('Loaded'));
          App.Redirect('/control/servers', { returnUrl: location.pathname });
          return;
        }
      }
    }
  }

  var me = { location: location, callback: callback };

  // idiocy...
  // currently not found a better solution
  // the problem is that need explicitly specify [require] for Webpack

  const { pathname } = location;

  if (pathname == '/' || pathname == '/index') {
    require(['Pages/Index'], LoadedComponent.bind(me));
  }
  else if (pathname == '/login') {
    require(['Pages/Login/Index'], LoadedComponent.bind(me));
  }
  else if (pathname == '/logout') {
    App.Store.dispatch(Logout()); 
    App.Store.dispatch(HideOverlay('Loaded'));
    App.Redirect('/login');
  }
  else if (pathname == '/error') {
    require(['Pages/Error'], LoadedComponent.bind(me));
  }
  else if (pathname == '/control/servers') {
    require(['Modules/Control/Servers'], LoadedComponent.bind(me));
  }
  else if (pathname == '/users') {
    require(['Modules/Users/Index'], LoadedComponent.bind(me));
  }
  else if (pathname == '/users/edit') {
    require(['Modules/Users/Edit'], LoadedComponent.bind(me));
  } else {
    //console.error('Cannot find path "' + location.pathname + '"');
    App.Store.dispatch(HideOverlay('Loaded'));
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

  App.Store.dispatch(HideOverlay('Loaded'));

  // this.callback(null, props => React.createElement(component.default, this.location.query || this.location.params));
  this.callback(null, component.default);
}

/**
 * Routes.
 */
export default class RouteConfig extends React.Component<any, any> {

  static contextTypes: React.ValidationMap<any> = {
    intl: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context);
    Debug.Init(this);
  }

  render() {
    Debug.Render('RouteConfig');

    return (
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
          {/* logout */}
          <Route path="/logout" getComponent={(nextState, callback) => { LoadComponent(nextState.location, callback); } } />
          {/* error page */}
          <Route path="/error" getComponent={(nextState, callback) => { LoadComponent(nextState.location, callback); } } />
        </Route>

        {/* unknown routes */}
        <Route path="*" getComponent={(nextState, callback) => { LoadComponent(nextState.location, callback); } } />
      </Router>
    );
  }

}