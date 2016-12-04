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

import * as ReactDOM from 'react-dom';

import ActionType from 'ActionType';
import IModalProps from 'IModalProps';
import IResultProps from 'IResultProps';
import IAlertSettings from 'IAlertSettings';
import IConfirmSettings from 'IConfirmSettings';
import IButton from 'IButton';

/**
 * Displays an alert box with a specified message and an OK button.
 *
 * @param message Message text.
 */
export function Alert(message?: string);

/**
 * Displays an alert box with a specified message and an OK button.
 *
 * @param message Any elements. For example: <div>Hello world!</div>
 */
export function Alert(message?: JSX.Element);

/**
 * Displays an alert box with a specified message and an OK button.
 *
 * @param settings Set of key/value pairs that configure the Alert dialog. All settings are optional.
 */
export function Alert(settings?: IAlertSettings);

/**
 * Displays an alert box with a specified message and an OK button.
 *
 * @param settings Text, elements or message settings.
 */
export function Alert(settings?: any) {
  return (dispatch: Redux.Dispatch<Promise<boolean>>, getState) => {
    // make alert
    let ok: IButton = {};
    let modal: IModalProps = {
      Type: 'alert',
      Key: RandomKey(),
      Title: null,
      Text: null,
      Buttons: [ ok ],
      UseHtml: true
    };

    if (IsJSX(settings)) {
      // is JSX
      modal.Text = JsxToHtml(settings);
    }
    else if (typeof settings === 'object') {
      // IAlertSettings
      const s = (settings as IAlertSettings);

      if (IsJSX(s.Text)) {
        modal.Text = JsxToHtml(s.Text);
      } else {
        modal.Text = HtmlEncode(s.Text);
      }

      if (IsJSX(s.Title)) {
        modal.Title = JsxToHtml(s.Title);
      } else {
        modal.Title = HtmlEncode(s.Title);
      }

      if (s.ButtonOk) {
        if (IsJSX(s.ButtonOk.Text)) {
          ok.Text = JsxToHtml(s.ButtonOk.Text);
        } else {
          ok.Text = HtmlEncode(s.ButtonOk.Text);
        }

        ok.BsStyle = s.ButtonOk.BsStyle;
        ok.BsSize = s.ButtonOk.BsSize;
        ok.Attributes = s.ButtonOk.Attributes;
        ok.Data = s.ButtonOk.Data;
      }
    }
    else if (typeof settings === 'function') {
      // function
      const text = settings();

      if (IsJSX(text)) {
        modal.Text = JsxToHtml((text as JSX.Element));
      } else {
        modal.Text = HtmlEncode(text);
      }
    }
    else {
      // string
      modal.Text = HtmlEncode(settings);
    }

    // add and show alert
    dispatch(AddModal(modal));

    // waiting closing
    return new Promise<boolean>((resolve) => {
      const interval = window.setInterval(() => {
        if (getState().ModalManager.Items.filter(itm => itm.Key == modal.Key).length <= 0) {
          // clear timer
          window.clearInterval(interval);
          // resolve
          return resolve(true);
        }
      }, 250);
    });
  };
}

/**
 * Displays a dialog box with a specified message, along with an OK and a Cancel button.
 *
 * @param message Specifies the text to display in the confirm box.
 * @param callback Callback function.
 */
export function Confirm(message?: string);

/**
 * Displays a dialog box with a specified message, along with an OK and a Cancel button.
 *
 * @param message Specifies any elements to display in the confirm box.
 * @param callback Callback function.
 */
export function Confirm(message?: JSX.Element): void;

/**
 * Displays a dialog box with a specified message, along with an OK and a Cancel button.
 *
 * @param settings Set of key/value pairs that configure the Confirm dialog. All settings are optional.
 */
export function Confirm(settings?: IConfirmSettings);

/**
 * Displays a dialog box with a specified message, along with an OK and a Cancel button.
 *
 * @param settings Set of key/value pairs that configure the Confirm dialog. All settings are optional.
 */
export function Confirm(settings?: any) {
  return (dispatch: Redux.Dispatch<Promise<boolean>>, getState) => {
    // make confirm
    let ok: IButton = {};
    let cancel: IButton = {};
    let modal: IModalProps = {
      Type: 'confirm',
      Key: RandomKey(),
      Title: null,
      Text: null,
      Buttons: [ ok, cancel ],
      UseHtml: true
    };

    if (IsJSX(settings)) {
      // is JSX
      modal.Text = JsxToHtml(settings);
    }
    else if (typeof settings === 'object') {
      // IAlertSettings
      const s = (settings as IConfirmSettings);

      if (IsJSX(s.Text)) {
        modal.Text = JsxToHtml(s.Text);
      } else {
        modal.Text = HtmlEncode(s.Text);
      }

      if (IsJSX(s.Title)) {
        modal.Title = JsxToHtml(s.Title);
      } else {
        modal.Title = HtmlEncode(s.Title);
      }

      if (s.ButtonOk) {
        if (IsJSX(s.ButtonOk.Text)) {
          ok.Text = JsxToHtml(s.ButtonOk.Text);
        } else {
          ok.Text = HtmlEncode(s.ButtonOk.Text);
        }

        ok.BsStyle = s.ButtonOk.BsStyle;
        ok.BsSize = s.ButtonOk.BsSize;
        ok.Attributes = s.ButtonOk.Attributes;
        ok.Data = s.ButtonOk.Data;
      }

      if (s.ButtonCancel) {
        if (IsJSX(s.ButtonCancel.Text)) {
          cancel.Text = JsxToHtml(s.ButtonCancel.Text);
        } else {
          cancel.Text = HtmlEncode(s.ButtonCancel.Text);
        }

        cancel.BsStyle = s.ButtonCancel.BsStyle;
        cancel.BsSize = s.ButtonCancel.BsSize;
        cancel.Attributes = s.ButtonCancel.Attributes;
        cancel.Data = s.ButtonCancel.Data;
      }
    }
    else if (typeof settings === 'function') {
      // function
      const text = settings();

      if (IsJSX(text)) {
        modal.Text = JsxToHtml((text as JSX.Element));
      } else {
        modal.Text = HtmlEncode(text);
      }
    }
    else {
      // string
      modal.Text = HtmlEncode(settings);
    }

    // add and show alert
    dispatch(AddModal(modal));

    // waiting closing
    return new Promise<boolean>((resolve) => {
      const interval = window.setInterval(() => {
        if (getState().ModalManager.Items.filter(itm => itm.Key == modal.Key).length <= 0) {
          // clear timer
          window.clearInterval(interval);
          // get result
          let result = (getState().ModalManager.Results as IResultProps[]).find(itm => itm.Key == modal.Key).Value;
          // remove result from state
          dispatch(RemoveResult(modal.Key));
          // resolve
          return resolve((result as boolean));
        }
      }, 250);
    });
  };
}

/**
 * Adds and display new modal.
 *
 * @param modal Modal settings.
 */
export function AddModal(modal: IModalProps) {
  return {
    type: ActionType.ADD_MODAL,
    modal: modal
  };
}

/**
 * Removes modal by key.
 *
 * @param key Key of modal to remove.
 */
export function RemoveModal(key: string) {
  return {
    type: ActionType.REMOVE_MODAL,
    key: key
  };
}

/**
 * Sets modal result.
 * @param key
 * @param value
 */
export function SetResult(key: string, value: any) {
  return {
    type: ActionType.SET_MODAL_RESULT,
    key: key,
    value: value
  };
}

/**
 * Removes modal result.
 * @param key
 */
export function RemoveResult(key: string) {
  return {
    type: ActionType.REMOVE_MODAL_RESULT,
    key: key
  };
}

function IsJSX(value: any): boolean {
  return typeof value === 'object' && typeof value.type !== 'undefined';
}

function RandomKey(): string {
  return 'modal_' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
}

function JsxToHtml(value: JSX.Element | string): string {
  if (!value) {
    return null;
  }

  let result = document.createElement('div');
  ReactDOM.render((value as JSX.Element), result);
  return result.innerHTML;
}

function HtmlEncode(value) {
  if (!value) {
    return null;
  }

  let result = document.createElement('div');
  result.innerHTML = value;
  return result.innerText;
}