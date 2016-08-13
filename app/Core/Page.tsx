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
import { Link } from 'react-router';
import IMainContext from 'IMainContext';
import Dialog from 'UI/Dialog/Dialog';

/**
 * The base class for pages.
 */
export default class Page<P, S> extends React.Component<P, S> {

  context: IMainContext;
  
  // registration of the context type, already defined into the containing component
  static contextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object.isRequired,
    SetLanguage: React.PropTypes.func,
    Alert: React.PropTypes.func,
    Confirm: React.PropTypes.func
  }

  constructor(props, context) {
    super(props, context);

    Debug.Log('Page', this);
  }

  /**
   * Sets language.
   *
   * @param newLanguage New language: en, ru, de etc.
   */
  public SetLanguage(newLanguage: string): void {
    this.context.SetLanguage(newLanguage);
  }

  // #region ..Alert..

  /**
   * Displays an alert box with a specified message and an OK button.
   *
   * @param message Message text.
   */
  public Alert(message?: string): void;

  /**
   * Displays an alert box with a specified message and an OK button.
   *
   * @param message Any elements. For example: <div>Hello world!</div>
   */
  public Alert(message?: JSX.Element): void;

  /**
   * Displays an alert box with a specified message and an OK button.
   *
   * @param settings Set of key/value pairs that configure the Alert dialog. All settings are optional.
   */
  public Alert(settings?: { message?: string | JSX.Element, title?: string | JSX.Element, buttonTitle?: string, callback?: { (dialog: Dialog): void; } }): void;

  /**
   * Displays an alert box with a specified message and an OK button.
   *
   * @param settings Text, elements or message settings.
   */
  public Alert(settings?: any): void {
    this.context.Alert(settings);
  }

  // #endregion
  // #region ..Confirm..

  /**
   * Displays a dialog box with a specified message, along with an OK and a Cancel button.
   *
   * @param message Specifies the text to display in the confirm box.
   * @param callback Callback function.
   */
  public Confirm(message?: string, callback?: { (dialog: Dialog, confirmed: boolean): void; }): void;

  /**
   * Displays a dialog box with a specified message, along with an OK and a Cancel button.
   *
   * @param message Specifies any elements to display in the confirm box.
   * @param callback Callback function.
   */
  public Confirm(message?: JSX.Element, callback?: { (dialog: Dialog, confirmed: boolean): void; }): void;

  /**
   * Displays a dialog box with a specified message, along with an OK and a Cancel button.
   *
   * @param settings Set of key/value pairs that configure the Confirm dialog. All settings are optional.
   */
  public Confirm(settings?: { message?: string | JSX.Element, title?: string | JSX.Element, buttonOkTitle?: string, buttonCancelTitle?: string, callback?: { (dialog: Dialog, confirmed: boolean): void; } }): void;

  /**
   * Displays a dialog box with a specified message, along with an OK and a Cancel button.
   *
   * @param settings Set of key/value pairs that configure the Confirm dialog. All settings are optional.
   */
  public Confirm(settings?: any): void {
    this.context.Confirm(settings);
  }

  // #endregion

}