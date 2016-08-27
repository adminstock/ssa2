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

import Server from 'Models/Server';

import ApiServer from 'Models/ApiServer';
import ApiRequest from 'API/ApiRequest';
import ApiError from 'API/ApiError';

import IMainContext from 'IMainContext';
import IAppContext from 'IAppContext';

import IMakeRequestProps from 'IMakeRequestProps';

import Dialog from 'UI/Dialog/Dialog';
import DialogManager from 'UI/Dialog/DialogManager';
import DialogSettings from 'UI/Dialog/DialogSettings';

import CurrentUser from 'CurrentUser';

import Config from 'Config';
import CookiesHelper from 'Helpers/CookiesHelper';

import MainReducer from 'Core/MainReducer';

import Session from 'Core/Session';

/**
 * The main class of the application.
 */
export default class App {

  private static _Store: Redux.Store<IAppContext>;

  public static get Store(): Redux.Store<IAppContext> {
    return App._Store;
  }

  /* private static _Context: IMainContext = null;

  /** Gets current context. */
  public static get Context(): IAppContext {
    return App.Store.getState();
  }

  /** Provides current user. */
  public static CurrentUser = CurrentUser;

  /** Provides access to config. */
  public static Config = Config;

  constructor() {
    Debug.Warn('"App" is static class. No need to create an instance of this class.');
  }

  /**
   * Sets context. It is used only once in the main application component.
   *
   * @param context
   
  public static SetContext(context: IMainContext): void {
    App._Context = context;
  }*/

  public static Init(enhancer?: any): void {
    const initState: IAppContext = {
      CurrentUser: {
        AccessToken: App.GetSession<string>('AccessToken'),
        Language: CookiesHelper.Get('lang')
      },
      CurrentPage: {
        Breadcrumbs: null,
        State: null
      },
      CurrentServer: null,
      ActiveApiServer: null,
      AvailableApiServers: null,
      AppError: null,
      Visible: true
    };

    App._Store = createStore<IAppContext>(MainReducer, initState, enhancer);
  }

  public static Dispatch<A extends Redux.Action>(action: A): A {
    return App.Store.dispatch(action);
  }

  /*public static LoadApiServers(returnUrl: string): void {
    //Overlay.Show(OverlayType.Loader | OverlayType.White, __('Initialization...'));

    $.ajax({
      cache: false,
      crossDomain: true,
      type: 'GET',
      dataType: 'json',
      url: '/servers.json',

      // handler of request succeeds
      success: (result: Array<ApiServer>) => {
        Debug.Response('LoadServers.Success', result);

        App.Store.dispatch(SetApiServers(result));

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
  */

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

  public static MakeRequest<TRequest, TResponse>(settings: IMakeRequestProps<TRequest, TResponse>): void {
    let api = new ApiRequest<any, TResponse>(
      settings.Method,
      settings.Data,
      settings.Url || App.Context.ActiveApiServer.Url,
      (App.Context.CurrentUser ? App.Context.CurrentUser.AccessToken : null),
      settings.Server || (App.Context.CurrentServer ? App.Context.CurrentServer.FileName : null)
    );

    api.SuccessCallback = (result) => {

      if (typeof settings.SuccessCallback === 'function') {
        settings.SuccessCallback(result);
      }

    }

    api.ErrorCallback = (error) => {

      if (error.Code == 'ACCESS_DENIED') {
        // reset token
        CurrentUser.AccessToken = null;

        // redirect to login
        App.Redirect('/login', { query: window.location.href });
        return;
      }

      if (typeof settings.ErrorCallback === 'function') {
        // custom handler
        settings.ErrorCallback(error);
      }
      else {
        // show error message
        App.DefaultApiErrorHandler(error);
      }

    }

    api.CompleteCallback = () => {
      if (typeof settings.CompleteCallback === 'function') {
        settings.CompleteCallback();
      }
    }

    api.Execute();
  }

  /**
   * Default API error handler.
   *
   * @param error Error instance.
   */
  public static DefaultApiErrorHandler(error: ApiError): void {
    App.Alert({
      title: __('Error'),
      message: <div>{error.Text} {error.Trace != null ? (<div><hr /><pre>{error.Trace}</pre></div>) : ''}</div>
    });
  }

  public static AbortAllRequests(): void {
    ApiRequest.AbortAll();
  }

  // #endregion

}