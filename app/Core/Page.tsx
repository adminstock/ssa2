import * as React from 'react';
import { Link } from 'react-router';
import IMainContext from 'Layouts/IMainContext';
import Dialog from 'UI/Dialog/Dialog';

/**
 * The base class for pages.
 */
export default class Page<P, S> extends React.Component<P, S> {

  context: IMainContext;
  
  // registration of the context type, already defined into the containing component
  static contextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object.isRequired,
    SetTitle: React.PropTypes.func.isRequired,
    SetLanguage: React.PropTypes.func,
    Alert: React.PropTypes.func,
    Confirm: React.PropTypes.func
  }

  constructor(props, context) {
    super(props, context);
  }

  /**
   * Sets a new title to window.
   *
   * @param value Text to set.
   */
  public SetTitle(value: string): void {
    this.context.SetTitle(value);
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
    this.context.Confirm(settings);
  }

  // #endregion

}