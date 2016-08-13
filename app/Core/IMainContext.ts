import * as React from 'react';
import Dialog from 'UI/Dialog/Dialog';

/**
 * Implements the main application context.
 */
export interface IMainContext {

  router: any,

  /**
   * Sets language.
   *
   * @param newLanguage New language: en, ru, de etc.
   */
  SetLanguage(newLanguage: string): void;

  /**
   * Displays an alert box with a specified message and an OK button.
   *
   * @param message Message text.
   */
  Alert(message?: string): void;

  /**
   * Displays an alert box with a specified message and an OK button.
   *
   * @param message Any elements. For example: <div>Hello world!</div>
   */
  Alert(message?: JSX.Element): void;

  /**
   * Displays an alert box with a specified message and an OK button.
   *
   * @param settings Set of key/value pairs that configure the Alert dialog. All settings are optional.
   */
  Alert(settings?: { message?: string | JSX.Element, title?: string | JSX.Element, buttonTitle?: string, callback?: { (dialog: Dialog): void; } }): void;

  /**
   * Displays an alert box with a specified message and an OK button.
   *
   * @param settings Text, elements or message settings.
   */
  Alert(settings?: any): void;

  /**
   * Displays a dialog box with a specified message, along with an OK and a Cancel button.
   *
   * @param message Specifies the text to display in the confirm box.
   * @param callback Callback function.
   */
  Confirm(message?: string, callback?: { (dialog: Dialog, confirmed: boolean): void; }): void;

  /**
   * Displays a dialog box with a specified message, along with an OK and a Cancel button.
   *
   * @param message Specifies any elements to display in the confirm box.
   * @param callback Callback function.
   */
  Confirm(message?: JSX.Element, callback?: { (dialog: Dialog, confirmed: boolean): void; }): void;

  /**
   * Displays a dialog box with a specified message, along with an OK and a Cancel button.
   *
   * @param settings Set of key/value pairs that configure the Confirm dialog. All settings are optional.
   */
  Confirm(settings?: { message?: string | JSX.Element, title?: string | JSX.Element, buttonOkTitle?: string, buttonCancelTitle?: string, callback?: { (dialog: Dialog, confirmed: boolean): void; } }): void;

  /**
   * Displays a dialog box with a specified message, along with an OK and a Cancel button.
   *
   * @param settings Set of key/value pairs that configure the Confirm dialog. All settings are optional.
   */
  Confirm(settings?: any): void;

}

export default IMainContext;