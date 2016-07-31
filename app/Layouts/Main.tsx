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

import IMainContext from 'IMainContext';
import IMainState from 'IMainState';

// TODO: Grouping Layout UI
import Header from 'UI/Layout/Header';
import Menu from 'UI/Layout/Menu';
import Login from 'UI/Layout/Login';

import CurrentUser from 'Core/CurrentUser';

import ApiRequest from 'Helpers/ApiRequest';

/**
 * The main layout.
 */
export default class Main extends React.Component<any, IMainState> implements IMainContext {

  public router: any;

  static contextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object.isRequired
  }

  static childContextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object.isRequired,
    SetTitle: React.PropTypes.func.isRequired,
    SetLanguage: React.PropTypes.func,
    Alert: React.PropTypes.func,
    Confirm: React.PropTypes.func
  }

  constructor(props, context) {
    super(props, context);

    Debug.Log(this);
    
    this.state = {
      Title: 'SmallServerAdmin'
    };

    // add login form
    DialogManager.AddDialog(<Login key="login" />);
  }

  public getChildContext(): any {
    return {
      router: (this.context as any).router,
      SetTitle: this.SetTitle.bind(this),
      SetLanguage: this.SetLanguage.bind(this),
      Alert: this.Alert.bind(this),
      Confirm: this.Confirm.bind(this),
    };
  }

  /**
   * Sets a new title to window.
   *
   * @param value Text to set.
   */
  public SetTitle(value: string): void {
    Debug.Log('SetTitle', value);

    this.setState({ Title: value });
  }

  /**
   * Sets language.
   *
   * @param newLanguage New language: en, ru, de etc.
   */
  public SetLanguage(newLanguage: string): void {
    Debug.Log('SetLanguage', newLanguage);

    CurrentUser.Language = newLanguage;

    window.location.reload(true);
  }

  // #region ..Alert..

  /**
   * Displays an alert box with a specified message and an OK button.
   *
   * @param message Message text.
   */
  public Alert(message?: string);

  /**
   * Displays an alert box with a specified message and an OK button.
   *
   * @param message Any elements. For example: <div>Hello world!</div>
   */
  public Alert(message?: JSX.Element);

  /**
   * Displays an alert box with a specified message and an OK button.
   *
   * @param settings Set of key/value pairs that configure the Alert dialog. All settings are optional.
   */
  public Alert(settings?: { message?: string | JSX.Element, title?: string | JSX.Element, buttonTitle?: string, callback?: { (dialog: Dialog): void; } });

  /**
   * Displays an alert box with a specified message and an OK button.
   *
   * @param settings Text, elements or message settings.
   */
  public Alert(settings?: any): void {
    Debug.Log('Main.Alert', typeof settings, settings);

    let s = new DialogSettings();

    let text, title, buttonTitle, callback;
    
    if (typeof settings === 'object' && typeof settings.type !== 'undefined') {
      text = settings;
    }
    else if (typeof settings === 'object' && typeof settings.type === 'undefined') {
      text = settings.message;
      title = settings.title;
      buttonTitle = settings.buttonTitle;
      callback = settings.callback;
    }
    else if (typeof settings === 'function') {
      text = settings();
    }
    else {
      text = settings;
    }
    
    if (buttonTitle === undefined || buttonTitle == null || buttonTitle == '') {
      buttonTitle = __('Ok');
    }

    s.Header = title || __('Message');
    s.Body = text;
    s.Footer = (<Button bsStyle="default" onClick={s.OnCloseDialog.bind(s)}>{buttonTitle}</Button>);

    if (typeof callback === 'function') {
      s.ClosedHandler = (sender, args) => {
        callback(sender);
      }
    }

    DialogManager.CreateDialog(s);
  }

  // #endregion
  // #region ..Confirm..

  /**
   * Displays a dialog box with a specified message, along with an OK and a Cancel button.
   *
   * @param message Specifies the text to display in the confirm box.
   * @param callback Callback function.
   */
  public Confirm(message?: string, callback?: { (dialog: Dialog, confirmed: boolean): void; });

  /**
   * Displays a dialog box with a specified message, along with an OK and a Cancel button.
   *
   * @param message Specifies any elements to display in the confirm box.
   * @param callback Callback function.
   */
  public Confirm(message?: JSX.Element, callback?: { (dialog: Dialog, confirmed: boolean): void; });

  /**
   * Displays a dialog box with a specified message, along with an OK and a Cancel button.
   *
   * @param settings Set of key/value pairs that configure the Confirm dialog. All settings are optional.
   */
  public Confirm(settings?: { message?: string | JSX.Element, title?: string | JSX.Element, buttonOkTitle?: string, buttonCancelTitle?: string, callback?: { (dialog: Dialog, confirmed: boolean): void; } });

  /**
   * Displays a dialog box with a specified message, along with an OK and a Cancel button.
   *
   * @param settings Set of key/value pairs that configure the Confirm dialog. All settings are optional.
   */
  public Confirm(settings?: any): void {
    Debug.Log('Main.Confirm', typeof settings, settings);

    let s = new DialogSettings();

    let text, title, buttonOkTitle, buttonCancelTitle, callback;

    if (typeof settings === 'object' && typeof settings.type !== 'undefined') {
      text = settings;
    }
    else if (typeof settings === 'object' && typeof settings.type === 'undefined') {
      text = settings.message;
      title = settings.title;
      buttonOkTitle = settings.buttonOkTitle;
      buttonCancelTitle = settings.buttonCancelTitle;
      callback = settings.callback;
    }
    else if (typeof settings === 'function') {
      text = settings();
    }
    else {
      text = settings;
    }

    if (buttonOkTitle === undefined || buttonOkTitle == null || buttonOkTitle == '') {
      buttonOkTitle = __('Ok');
    }

    if (buttonCancelTitle === undefined || buttonCancelTitle == null || buttonCancelTitle == '') {
      buttonCancelTitle = __('Cancel');
    }

    s.Header = title || __('Confirm');
    s.Body = text;
    s.Footer = (
      <div>
        <Button bsStyle="default" onClick={() => { Debug.Log('Confirmed', true); s.State = true; s.OnCloseDialog.apply(s); }}>{buttonOkTitle}</Button>
        <Button bsStyle="default" onClick={() => { Debug.Log('Confirmed', false); s.State = false; s.OnCloseDialog.apply(s); }}>{buttonCancelTitle}</Button>
      </div>
    );

    s.ClosingHandler = (sender, args) => {
      if (s.State === undefined || s.State == null) {
        s.State = false;
      }
    }

    if (typeof callback === 'function') {
      s.ClosedHandler = (sender, args) => {
        callback(sender, (s.State as boolean));
      }
    }

    DialogManager.CreateDialog(s);
  }

  // #endregion
  // #region ..API Requests..

  public MakeRequest<TRequest, TResponse>(method: string, data?: TRequest, successCallback?, errorCallback?): void {
    let api = new ApiRequest<any, TResponse>(method, data);

    api.SuccessCallback = () => {
      if (typeof successCallback === 'function') {
        successCallback();
      }
    }

    api.ErrorCallback = (error) => {

      if (error.Code == 'ERR_FORBIDDEN') {
        // reset token
        CurrentUser.AccessToken = null;

        // show login form
        DialogManager.ShowDialog('login');
      }
    }

    api.Execute();
  }

  // #endregion


  render() {
    Debug.Log('Main.render');

    return (
      <DocumentTitle title={this.state.Title}>
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