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

import * as React from 'react';
import { render } from 'react-dom';
import DocumentTitle from 'react-document-title';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';
import { Modal, Button } from 'react-bootstrap';

import Dialog from 'UI/Dialog/Dialog';
import DialogManager from 'UI/Dialog/DialogManager';
import DialogSettings from 'UI/Dialog/DialogSettings';

// TODO: Grouping Layout UI
import Header from 'UI/Layout/Header';
import Menu from 'UI/Layout/Menu';

import CookiesHelper from 'Helpers/CookiesHelper';

export default class Main extends React.Component<any, any> {

  static contextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object.isRequired
  }

  static childContextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object.isRequired,
    setTitle: React.PropTypes.func.isRequired,
    setLanguage: React.PropTypes.func,
    Alert: React.PropTypes.func
  }

  constructor(props, context) {
    super(props, context);

    Debug.Log(this);
    
    this.state = {
      title: 'SmallServerAdmin'
    };
  }

  public getChildContext(): any {
    return {
      router: (this.context as any).router,
      setTitle: this.setTitle.bind(this),
      setLanguage: this.setLanguage.bind(this),
      Alert: this.Alert.bind(this)
    };
  }

  /**
   * Sets a new title to window.
   *
   * @param value Text to set.
   */
  public setTitle(value: string): void {
    Debug.Log('setTitle', value);

    this.setState({ title: value });
  }

  /**
   * Sets language.
   *
   * @param newLanguage New language: en, ru, de etc.
   */
  public setLanguage(newLanguage: string): void {
    Debug.Log('setLanguage', newLanguage);

    CookiesHelper.Add('lang', newLanguage, 365);

    window.location.reload(true);
  }

  // #region ..dialogs..

  public Alert(message?: string | JSX.Element, title?: string | JSX.Element, buttonTitle?: string, closeHandler?: { (dialog: Dialog): void; }): void {
    let settings = new DialogSettings();

    if (buttonTitle === undefined || buttonTitle == null || buttonTitle == '') {
      buttonTitle = __('Ok');
    }

    settings.Header = title || __('Message');
    settings.Body = message;
    settings.Footer = (<Button bsStyle="default" onClick={settings.OnCloseDialog.bind(settings)}>{buttonTitle}</Button>);

    if (typeof closeHandler === 'function') {
      settings.ClosedHandler = (sender, args) => {
        closeHandler(sender);
      }
    }

    DialogManager.CreateDialog(settings);
  }

  public Confirm(): void {
    
  }

  // #endregion

  render() {
    Debug.Log('Main.render');

    return (
      <DocumentTitle title={this.state.title}>
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
          </footer>

          <DialogManager />
        </div>
      </DocumentTitle>
    )
  }

}