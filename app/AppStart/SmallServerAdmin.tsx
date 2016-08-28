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
import { IntlProvider, defineMessages } from 'react-intl';
import { connect } from 'react-redux';

import App from 'Core/App';
import { SetVisible, SetActiveApiServer, LoadApiServers, SetError } from 'Actions/Global';
import Error from 'Pages/Error';
import DialogManager from 'UI/Dialog/DialogManager';
import { Overlay } from 'UI/Overlay/index';

/**
 * SmallServerAdmin.
 */
export class SmallServerAdmin extends React.Component<any, any> {

  constructor(props, context) {
    super(props, context);

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

  private HasLoadApiServers: boolean;

  private InitApp(): void {
    if (App.Context.AppError != null) {
      return;
    }

    if (App.Context.ApiServers == null) {
      //if (!this.HasLoadApiServers) {
        App.Store.dispatch(LoadApiServers());
      //}
      //this.HasLoadApiServers = true;
      return;
    }

    if (App.Context.ApiServers.length <= 0 && App.Context.AppError == null) {
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

    if (App.CurrentUser.ApiServer == null) {
      App.Store.dispatch(SetActiveApiServer(App.Context.ApiServers[0]));
      return;
    }
  }

  private Error(title: string, text: string | JSX.Element): JSX.Element {
    return (<Error Title={title} Text={text} />);
  }

  render() {
    let children = null;
    let allowRender = true;

    let { Visible, AppError, ApiServers } = App.Context;

    Debug.Render('SmallServerAdmin');

    if (AppError != null) {
      children = this.Error(AppError.Title, AppError.Text);
      allowRender = false;
    }

    if (ApiServers == null) {
      allowRender = false;
    }

    if (App.CurrentUser.ApiServer == null) {
      allowRender = false
    }

    if (!Visible) {
      allowRender = false;
    }

    if (allowRender) {
      children = this.props.children;
    }

    // this.props.dispatch
    const messages = defineMessages({
      hello: {
        id: 'hello',
        defaultMessage: 'Hello world!!!',
      }
    });

    return (
      <div>
        {children}

        <Overlay />
        <DialogManager/>
      </div>
    );
  }

}

export default connect(state => ({
  CurrentUser: state.CurrentUser,
  AppContext: state.AppContext
}))(SmallServerAdmin);
