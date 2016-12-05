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
import IMainContext from 'IMainContext';

import { Alert, Confirm } from 'UI/Modal/Actions';
import IAlertSettings from 'UI/Modal/IAlertSettings';
import IConfirmSettings from 'UI/Modal/IConfirmSettings';

/**
 * The base class for user controls.
 */
export default class Component<P, S> extends React.Component<P, S> {

  context: IMainContext;

  // registration of the context type, already defined into the containing component
  static contextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object.isRequired,
    intl: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired
  }

  constructor(props?, context?) {
    super(props, context);
    Debug.Init3('Component', this);
  }

  // public dispatch(action: any): any;

  // public dispatch<A extends Redux.Action>(action: A): A;

  // public dispatch<A>(action: A): A;

  /*public dispatch<R, E>(asyncAction: (dispatch: Redux.Dispatch<any> | R, getState?: () => any, extraArgument?: E) => R): R {
    return this.context.dispatch<R, E>(asyncAction);
  }*/

  /** Gets dispatch of the context. */
  public dispatch = this.context.dispatch;

  /** Gets router of the context. */
  public router = this.context.router;

  public intl = this.context.intl;

  /** Gets current location. */
  public get Location(): HistoryModule.Location {
    return (this.props as any).location;
  }

  /** Gets state of the current location. */
  public GetLocationState<T>(): T {
    return (this.props as any).location.state;
  }

  /**
   * Sets state and return Promise.
   *
   * @param state
   * @param callback
   */
  public setState2(state: S, callback?: () => any): Promise<S> {
    return new Promise((resolve) => {
      this.setState(state, () => {
        resolve(this.state);

        if (typeof callback === 'function') {
          callback();
        }
      });
    });
  }

  // #region ..Alert..

  /**
   * Displays an alert box with a specified message and an OK button.
   *
   * @param message Message text.
   */
  public alert(message?: string): Promise<boolean>;

  /**
   * Displays an alert box with a specified message and an OK button.
   *
   * @param message Any elements. For example: <div>Hello world!</div>
   */
  public alert(message?: JSX.Element): Promise<boolean>;

  /**
   * Displays an alert box with a specified message and an OK button.
   *
   * @param settings Set of key/value pairs that configure the Alert dialog. All settings are optional.
   */
  public alert(settings?: IAlertSettings): Promise<boolean>;

  /**
   * Displays an alert box with a specified message and an OK button.
   *
   * @param settings Text, elements or message settings.
   */
  public alert(settings?: any): Promise<boolean> {
    return this.dispatch(Alert(settings));
  }

  // #endregion
  // #region ..Confirm..

  /**
   * Displays a dialog box with a specified message, along with an OK and a Cancel button.
   *
   * @param message Specifies the text to display in the confirm box.
   * @param callback Callback function.
   */
  public confirm(message?: string): Promise<boolean>;

  /**
   * Displays a dialog box with a specified message, along with an OK and a Cancel button.
   *
   * @param message Specifies any elements to display in the confirm box.
   * @param callback Callback function.
   */
  public confirm(message?: JSX.Element): Promise<boolean>;

  /**
   * Displays a dialog box with a specified message, along with an OK and a Cancel button.
   *
   * @param settings Set of key/value pairs that configure the Confirm dialog. All settings are optional.
   */
  public confirm(settings?: IConfirmSettings): Promise<boolean>;

  /**
   * Displays a dialog box with a specified message, along with an OK and a Cancel button.
   *
   * @param settings Set of key/value pairs that configure the Confirm dialog. All settings are optional.
   */
  public confirm(settings?: any): Promise<boolean> {
    return this.dispatch(Confirm(settings));
  }

  // #endregion

}