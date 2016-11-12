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
import { createStore } from 'redux';
import { browserHistory } from 'react-router';
import { Modal, Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

import { Server } from 'Models/Server';

import ApiServer from 'Models/ApiServer';
import ApiRequest from 'API/ApiRequest';
import ApiError from 'API/ApiError';

import IAppStore from 'IAppStore';
import IAppContext from 'IAppContext';
import ICurrentUser from 'ICurrentUser';
import IOverlay from 'UI/Overlay/IOverlay';

import IMakeRequestProps from 'IMakeRequestProps';

import Dialog from 'UI/Dialog/Dialog';
import DialogManager from 'UI/Dialog/DialogManager';
import DialogSettings from 'UI/Dialog/DialogSettings';

import { RootReducer } from 'Reducers/Combination';

import { Session, Cookies } from 'Helpers/Storage';
import TextHelper from 'Helpers/TextHelper';

/**
 * The main class of the application.
 */
export default class App {

  private static _Store: Redux.Store<IAppStore>;

  /** Gets instance of the application store. */
  public static get Store(): Redux.Store<IAppStore> {
    return App._Store;
  }

  /** Gets global application state. */
  public static get Context(): IAppContext {
    return App.Store.getState().AppContext;
  }

  /** Gets current user. */
  public static get CurrentUser(): ICurrentUser {
    return App.Store.getState().CurrentUser;
  }

  /** Gets current server. */
  public static get CurrentServer(): Server  {
    return App.Store.getState().CurrentUser.Server;
  }

  /** Gets current page. */
  public static get CurrentPage(): any {
    return App.Store.getState().CurrentPage;
  }

  /** Gets overlay info. */
  public static get Overlay(): IOverlay {
    return App.Store.getState().Overlay;
  }

  constructor() {
    Debug.Warn('"App" is static class. No need to create an instance of this class.');
  }

  /**
   * Initializes the application.
   */
  public static Init(enhancer?: any): void {
    const initialState = {
      intl: {
        defaultLocale: 'en',
        locale: 'en',
        messages: {}
      }
    };

    App._Store = createStore<IAppStore>(RootReducer, initialState, enhancer);
    Debug.Init('App.Store', App._Store.getState());
  }

  public static Dispatch<A extends Redux.Action>(action: A): A {
    return App.Store.dispatch(action);
  }

  public static FormatMessage(id: string, defaultMessage: string, values?: any): string {
    if (App.Store.getState().intl.messages[id] === undefined) {
      return defaultMessage;
    }

    let result: string = App.Store.getState().intl.messages[id];

    if (values === undefined || values == null) {
      return result;
    } else {
      return result.replace(/\{([^\}]+)\}/g, (match, key) => {
        return values[key] || match;
      });
    }
  }

  /**
   * Redirect to a specified URL or to route.
   *
   * @param url The absolute or relative address.
   * @param query The query parameters.
   */
  public static Redirect(url: string, query?: any): void {
    Debug.Call('Redirect', url);

    if (url.toLowerCase().startsWith('http:') || url.toLowerCase().startsWith('https:')) {
      if (query !== undefined && query != null) {
        window.location.href = url + '?' + $.param(query);
      } else {
        window.location.href = url;
      }
    } else {
      if (query !== undefined && query != null) {
        browserHistory.push({ pathname: url, query: query });
      } else {
        browserHistory.push(url);
      }
    }
  }

  /**
   * Gets data from sessionStorage.
   *
   * @param key
   */
  public static GetSession<T>(key: string, defaultValue?: any): T {
    return Session.Get<T>(key, defaultValue);
  }

  /**
   * Sets data to sessionStorage.
   *
   * @param key
   * @param value
   */
  public static SetSession(key: string, value: any): void {
    Session.Set(key, value);
  }

  /**
   * Gets data from localStorage.
   *
   * @param key
   */
  public static GetValue<T>(key: string, defaultValue?: any): T {
    if (window.localStorage.getItem(key) == null || window.localStorage.getItem(key) == '') {
      if (defaultValue !== undefined) {
        return defaultValue;
      } else {
        return null;
      }
    } else {
      return JSON.parse(window.localStorage.getItem(key));
    }
  }

  /**
   * Sets data to localStorage.
   *
   * @param key
   * @param value
   */
  public static SetValue(key: string, value: any): void {
    if (value == null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }

  public static RandomKey(prefix?: string, size?: number): string {
    return TextHelper.RandomKey(prefix, size);
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
      buttonTitle = (<FormattedMessage id="btnOk" defaultMessage="Ok" />);
    }

    s.Header = title || (<FormattedMessage id="dlgTitleMessage" defaultMessage="Message" />);
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
      buttonOkTitle = (<FormattedMessage id="btnOk" defaultMessage="Ok" />);
    }

    if (buttonCancelTitle === undefined || buttonCancelTitle == null || buttonCancelTitle == '') {
      buttonCancelTitle = (<FormattedMessage id="btnCancel" defaultMessage="Cancel" />);
    }

    s.Header = title || <FormattedMessage id="dlgTitleConfirm" defaultMessage="Confirm" />;
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

  public static MakeRequest<TRequest, TResponse>(method: string, data?: any, settings?: IMakeRequestProps<TRequest, TResponse>): Promise<TResponse>;

  public static MakeRequest<TRequest, TResponse>(method: string, data?: any, disableDefaultErrorHandler?: boolean): Promise<TResponse>;

  public static MakeRequest<TRequest, TResponse>(settings: IMakeRequestProps<TRequest, TResponse>): Promise<TResponse>;

  public static MakeRequest<TRequest, TResponse>(settings: { (): IMakeRequestProps<TRequest, TResponse> }): Promise<TResponse>;

  // string | IMakeRequestProps<TRequest, TResponse> | { (): IMakeRequestProps<TRequest, TResponse> }
  // IMakeRequestProps<TRequest, TResponse> | boolean

  public static MakeRequest<TRequest, TResponse>(methodNameOrSettings: any, data?: any, settings?: any): Promise<TResponse> {
    Debug.Call2('App.MakeRequest', methodNameOrSettings, data, settings);

    if (typeof settings === 'boolean') {
      let s: IMakeRequestProps<TRequest, TResponse> = {
        Method: methodNameOrSettings.toString(),
        Data: data,
        DisableDefaultErrorHandler: (settings as boolean),
      };

      settings = s;
    }

    if (typeof methodNameOrSettings === 'string') {
      let s: IMakeRequestProps<TRequest, TResponse> = {
        Method: methodNameOrSettings.toString(),
        Data: data || (settings ? settings.Data : null),
        CompleteCallback: (settings ? settings.CompleteCallback : null),
        SuccessCallback: (settings ? settings.SuccessCallback : null),
        ErrorCallback: (settings ? settings.ErrorCallback : null),
        DisableDefaultErrorHandler: (settings ? settings.DisableDefaultErrorHandler : null),
        Server: (settings ? settings.Server : null),
        Url: (settings ? settings.Url : null)
      };

      settings = s;
    }
    else if (typeof settings === 'function') {
      settings = methodNameOrSettings();
    } else {
      settings = methodNameOrSettings;
    }

    Debug.Call3('App.MakeRequest', settings);

    let result = new Promise<TResponse>((resolve, reject) => {

      if (settings.DisableDefaultErrorHandler == undefined || settings.DisableDefaultErrorHandler == null) {
        settings.DisableDefaultErrorHandler = false;
      }

      let api = new ApiRequest<any, TResponse>(
        settings.Method,
        settings.Data,
        settings.Url || App.CurrentUser.ApiServer.Url,
        (App.CurrentUser ? App.CurrentUser.AccessToken : null),
        settings.Server || (App.CurrentServer ? App.CurrentServer.FileName : null)
      );

      api.SuccessCallback = (response) => {
        resolve(response);

        if (typeof settings.SuccessCallback === 'function') {
          settings.SuccessCallback(response);
        }
      }

      api.ErrorCallback = (error) => {

        if (error.Code == 'ACCESS_DENIED') {
          // reset token
          //TODO
          //App.Store.dispatch(SetAccessToken(null));

          // redirect to login
          //App.Redirect('/login', { query: window.location.href });
          return;
        }

        reject(error);
        
        if (typeof settings.ErrorCallback === 'function') {
          // custom handler
          settings.ErrorCallback(error);
        }
        else {
          // show error message
          if (!settings.DisableDefaultErrorHandler) {
            App.DefaultApiErrorHandler(error);
          }
        }
      }

      if (typeof settings.CompleteCallback === 'function') {
        api.CompleteCallback = () => {
          settings.CompleteCallback();
        }
      }

      api.Execute();
    });

    return result;
  }

  /**
   * Default API error handler.
   *
   * @param error Error instance.
   */
  public static DefaultApiErrorHandler(error: ApiError): void {
    let message: string = '', trace: string = null;

    if (typeof error.Text !== 'undefined' && error.Text != '') {
      message = error.Text;
      trace = error.Trace;
    }
    else if (error instanceof Error) {
      // exception of JavaScript
      if (typeof (error as any).message !== 'undefined') {
        message += (error as any).message;
      }

      if (typeof (error as any).stack !== 'undefined') {
        trace = (error as any).stack;
      }

      if (message == '') {
        message = error.toString();
      }
    } else if (typeof error === 'object') {
      message = JSON.stringify(error);
    } else {
      message = error.toString();
    }

    App.Alert({
      title: (<FormattedMessage id="dlgTitleError" defaultMessage="Error" />),
      message: <div>{message} {trace ? (<div><hr /><pre>{trace}</pre></div>) : ''}</div>
    });
  }

  public static AbortAllRequests(): void {
    ApiRequest.AbortAll();
  }

  // #endregion

}