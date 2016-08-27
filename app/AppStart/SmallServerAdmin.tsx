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
import { connect } from 'react-redux';
import App from 'Core/App';
import CookiesHelper from 'Helpers/CookiesHelper';
import { SetVisible, SetActiveApiServer, LoadApiServers, SetError } from 'Actions/Global';
import Error from 'Pages/Error';

/**
 * SmallServerAdmin.
 */
export class SmallServerAdmin extends React.Component<any, any> {

  constructor(props, context) {
    super(props, context);

    if (DEV_MODE) {
      console.log('%cSmallServerAdmin v' + SSA_VERSION + ' (development)', 'font-weight:bold;color:white;background-color:black;font-size:150%;padding:4px 12px 4px 12px;border-radius:24px 6px;');
      console.warn('The application assembled in debug mode, with the conclusion of detailed reports and with uncompressed files.');
    } else {
      console.log('%cSmallServerAdmin v' + SSA_VERSION + ' (production)', 'font-weight:bold;');
    }

    Debug.Init(this);
  }

  componentWillMount() {
    // Debug.Log('componentWillMount');
    this.InitApp();
  }

  componentWillUpdate() {
    // Debug.Log('componentWillUpdate');
    this.InitApp();
  }

  private InitApp(): void {
    if (App.Context.AppError != null) {
      return;
    }

    if (App.Context.AvailableApiServers == null) {
      App.Store.dispatch(LoadApiServers());
      return;
    }

    if (App.Context.AvailableApiServers.length <= 0 && App.Context.AppError == null) {
      App.Store.dispatch(SetError(
        'List of servers is empty', (
          <div>
            <p>The list of available API servers is empty.</p>
            <p>Check the contents of the file <strong>./servers.json</strong></p>
            <p>This file must contain an array of available servers in the <strong>JSON</strong> format.</p>
            <p>For example: </p>
            <pre>{`[
  {
    "Url": "http://panel.example.org/",
    "AuthUrl": "http://panel.example.org/",
    "Name": "WebApi.PHP",
    "Description": "Example server."
  }
]`}</pre>
          </div>
        )
      ));
      return;
    }

    if (App.Context.ActiveApiServer == null) {
      App.Store.dispatch(SetActiveApiServer(App.Context.AvailableApiServers[0]));
      return;
    }
  }

  private Error(title: string, text: string | JSX.Element): JSX.Element {
    return (<Error Title={title} Text={text} />);
  }

  render() {
    let { Visible, AppError, AvailableApiServers, ActiveApiServer } = App.Context;

    Debug.Render('SmallServerAdmin', Visible); // , AvailableApiServers, ActiveApiServer, CurrentServer

    if (AppError != null) {
      return this.Error(AppError.Title, AppError.Text);
    }

    if (AvailableApiServers == null) {
      return null;
    }

    if (ActiveApiServer == null) {
      return null;      
    }

    if (!Visible) {
      return null;
    }

    return (<div>{this.props.children}</div>);
  }

}

export default connect(state => ({
  Visible: state.Visible,
  AvailableApiServers: state.AvailableApiServers,
  ActiveApiServer: state.ActiveApiServer,
  AppError: state.AppError
}))(SmallServerAdmin);
