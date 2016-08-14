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
import { browserHistory } from 'react-router';
import { Modal, Button } from 'react-bootstrap';

import ApiServer from 'Models/ApiServer';
import ApiRequest from 'API/ApiRequest';

import IMainContext from 'IMainContext';

import Dialog from 'UI/Dialog/Dialog';
import DialogManager from 'UI/Dialog/DialogManager';
import DialogSettings from 'UI/Dialog/DialogSettings';

import CurrentUser from 'CurrentUser';

/**
 * The main class of the application.
 */
export default class App {

  private static _Context: IMainContext = null;

  /** Gets current context. */
  public static get Context(): IMainContext {
    return App._Context;
  }

  /** Provides current user. */
  public static CurrentUser = CurrentUser;

  constructor() {
    Debug.Warn('"App" is static class. No need to create an instance of this class.');
  }

  /**
   * Sets context. It is used only once in the main application component.
   *
   * @param context
   */
  public static SetContext(context: IMainContext): void {
    App._Context = context;
  }
  
  /**
   * Redirect to a specified URL or to route.
   *
   * @param url The absolute or relative address.
   */
  public static Redirect(url: string): void {
    Debug.Call('App.Redirect', url);

    if (url.toLowerCase().startsWith('http:') || url.toLowerCase().startsWith('https:')) {
      window.location.href = url;
    } else {
      browserHistory.push(url);
    }
  }

  // #region ..Alert..

  /**
   * Displays an alert box with a specified message and an OK button.
   *
   * @param message Message text.
   */
  public static Alert(message?: string): void;

  /**
   * Displays an alert box with a specified message and an OK button.
   *
   * @param message Any elements. For example: <div>Hello world!</div>
   */
  public static Alert(message?: JSX.Element): void;

  /**
   * Displays an alert box with a specified message and an OK button.
   *
   * @param settings Set of key/value pairs that configure the Alert dialog. All settings are optional.
   */
  public static Alert(settings?: { message?: string | JSX.Element, title?: string | JSX.Element, buttonTitle?: string, callback?: { (dialog: Dialog): void; } }): void;

  /**
   * Displays an alert box with a specified message and an OK button.
   *
   * @param settings Text, elements or message settings.
   */
  public static Alert(settings?: any): void {
    Debug.Call('App.Alert', typeof settings, settings);

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
    s.Footer = (<Button bsStyle="default" onClick={s.OnCloseDialog.bind(s) }>{buttonTitle}</Button>);

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
  public static Confirm(message?: string, callback?: { (dialog: Dialog, confirmed: boolean): void; }): void;

  /**
   * Displays a dialog box with a specified message, along with an OK and a Cancel button.
   *
   * @param message Specifies any elements to display in the confirm box.
   * @param callback Callback function.
   */
  public static Confirm(message?: JSX.Element, callback?: { (dialog: Dialog, confirmed: boolean): void; }): void;

  /**
   * Displays a dialog box with a specified message, along with an OK and a Cancel button.
   *
   * @param settings Set of key/value pairs that configure the Confirm dialog. All settings are optional.
   */
  public static Confirm(settings?: { message?: string | JSX.Element, title?: string | JSX.Element, buttonOkTitle?: string, buttonCancelTitle?: string, callback?: { (dialog: Dialog, confirmed: boolean): void; } }): void;

  /**
   * Displays a dialog box with a specified message, along with an OK and a Cancel button.
   *
   * @param settings Set of key/value pairs that configure the Confirm dialog. All settings are optional.
   */
  public static Confirm(settings?: any): void {
    Debug.Call('App.Confirm', typeof settings, settings);

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
        <Button bsStyle="default" onClick={() => { Debug.Log('Confirmed', true); s.State = true; s.OnCloseDialog.apply(s); } }>{buttonOkTitle}</Button>
        <Button bsStyle="default" onClick={() => { Debug.Log('Confirmed', false); s.State = false; s.OnCloseDialog.apply(s); } }>{buttonCancelTitle}</Button>
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

  public static MakeRequest<TRequest, TResponse>(method: string, data?: TRequest, successCallback?, errorCallback?): void {
    let api = new ApiRequest<any, TResponse>(method, data);

    api.SuccessCallback = () => {
      if (typeof successCallback === 'function') {
        successCallback();
      }
    }

    api.ErrorCallback = (error) => {

      if (error.Code == 'ACCESS_DENIED') {
        // reset token
        CurrentUser.AccessToken = null;

        // show login form
        DialogManager.ShowDialog('login');
      } else {
        // show error message
        App.Alert({
          title: __('Error'),
          message: <div>{error.Text} {error.Trace != null ? (<div><hr /><pre>{error.Trace}</pre></div>) : ''}</div>
        });
      }
    }

    api.Execute();
  }

  public static AbortAllRequests(): void {
    ApiRequest.AbortAll();
  }

  // #endregion

}