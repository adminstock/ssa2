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
import { render } from 'react-dom';
import DocumentTitle from 'react-document-title';
import { Router, Route, Link } from 'react-router';
import { Modal, Button } from 'react-bootstrap';

import DialogManager from 'UI/Dialog/DialogManager';

import IMainContext from 'Core/IMainContext';

import Header from 'Layouts/Components/Header';
import Menu from 'Layouts/Components/Menu';

import App from 'Core/App';
import CurrentUser from 'Core/CurrentUser';

/**
 * The main layout.
 */
export default class Main extends React.Component<any, any> implements IMainContext {

  public router: ReactRouter.RouterOnContext;

  static contextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object.isRequired
  }

  static childContextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object.isRequired
  }

  static defaultProps = {
    Title: 'SmallServerAdminV2'
  }

  constructor(props, context) {
    super(props, context);

    Debug.Init(this);
  }

  public getChildContext(): any {
    return {
      router: (this.context as any).router
    };
  }
  
  render() {
    Debug.Render('Main', this.props.children);

    return (
      <DocumentTitle title={this.props.Title}>
        <div>
          <Header />
          <div id="container" className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-4 col-md-3 col-lg-3">
                <Menu />
              </div>
              <div className="col-xs-12 col-sm-8 col-md-9 col-lg-9">
                {this.props.children}
              </div>
            </div>
          </div>
          <footer className="text-center small">
            <hr />
            SmallServerAdmin v{SSA_VERSION} ({SSA_DATE_RELEASE})
            <br />
            WebAPI.PHP v2.0.0-alpha (unreleased)
            <br />
            Debian GNU/Linux 8.4 (jessie) &middot; PHP v5.4.0
          </footer>

          <DialogManager />
        </div>
      </DocumentTitle>
    )
  }

}