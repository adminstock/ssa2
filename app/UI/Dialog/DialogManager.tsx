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

/*
                                                                          ...
                     .       .           .   .$############$.    .    =.$#=$$=.     .       .
                              .==. .===.   .=##################=.  .=$=$.   .==$       .
  .       .                 .=...#=$=$.=.=#########################$=....$#$.  .#$
               .      .    .=..$=.  .################################==$.   .#$  .=   .    .
  .                       .=.==.  .#=.$..##############################.$=.   .=. =.
                         $$$=.  $#.   .=################################=.$=.   . .#.
         ..             =$=. .==.   .####################################=.$=      $$
 . .                   =.=. $=.   .##################################..  .$=#=.     =.   .
                      $$.. =$    $#####=.###############################$.   .$$     =.
   .                 $=   ..    =##.   .$##################################=.         $$     .
  .                .=.       .$#..  .=########==$=#=#=######################.#.        .=.
                  .#. .   . ..    .#########$.==.$.$..$#$#####=#===.$#######===       . .=.
      .          .#.            .########==.   =#####..= .=..###===$ $######=.=$          =$
                .=.           .########==.    ..=$....==#..==$....=$  ######.##$           .=.
               .#.   .       .#########. .   ..==##$#.$.  .$.=$$$$=$  $####=  .#           ..=.
      .       .#.            =########$      ..     .=..   .=.        $####.   .=             $=.
 .          .$=.            $==#######.            ..      .$         .###=     .=.            .=$
  .       .=$.             .=  =#=.###$                     $$        .###.       .==.          ..$
        .=.            .  $$   .#=$===.            .$#       .=.      .==.           .=.
    ...#$             ..==.     ==.##$             =$$=#=..=#==.      $$=.            .#.         .
  .#=#=.            .=.          #$                         .  $.     ==$       .      .=.
  .= =#. .         =$            .##=$$.                .....  .$    .#$                .#.
 .=. .#.  .      .=.              $####$  .          .=$$$$$$#$ .    $#=.  .      .      ##=$$==...
     =$         .#.                =###$              .#.$$.$=.     .#..=$               .#.
     =#...     .##                  .=.#.               .==.       .#.   $#.    .===..    =.
  .     $#==####.#.       .    .=#$.    =$     .   .   ..         .#$  .  .=$$#=.    .====#$
.              $=   ..$=..$=.$=$.     . .=$.                     $==.       =$             =.
     .        $= ....   .$#$.              .=#. ..        .    .=..#..      $$.            .=
. .           .=     .    . .$.          .    .=$ .$..    . .$$...#$        =..             =.  .
  .           .=                          .    .$= ......$=$=$..=##.        =$ .  .         .=     .
               =.                           .   $=.....$====#=$..=. .     . =$ .        .    $$
               $$                               $$.             .=         .=                .=
      .        .=                               ..#.            =.  .  .   .=           .  .  .
  .             ..                             .  =..        . .#. .    .  $$    .           .
        .         .                                                                .  .
*/

import * as React from 'react';
import Dialog from 'Dialog';
import DialogSettings from 'DialogSettings';
import IDialogManagerState from 'IDialogManagerState';
import EventArgs from 'Core/EventArgs';
import { Modal, Button } from 'react-bootstrap';
import TextHelper from 'Helpers/TextHelper';

/**
 * Manager of dialog boxes.
 */
export default class DialogManager extends React.Component<any, IDialogManagerState> {

  private static UpdateStateNeed: boolean = false;

  private static Items = new Array<Dialog>();

  static statics = {
    Items: DialogManager.Items,
    AddDialog: DialogManager.AddDialog,
    CreateDialog: DialogManager.CreateDialog,
    CloseDialog: DialogManager.CloseDialog,
    HideAll: DialogManager.HideAll,
    HideDialog: DialogManager.HideDialog,
    ShowDialog: DialogManager.ShowDialog,
    ShowNext: DialogManager.ShowNext
  };

  constructor(props?, context?) {
    super(props, context);

    Debug.Init(this);

    this.state = {
      Items: DialogManager.Items
    };

    // watch state
    window.setTimeout(this.UpdateState.bind(this), 100);
  }

  private UpdateState(): void {
    let $this = this;

    if (!DialogManager.UpdateStateNeed) {
      window.setTimeout($this.UpdateState.bind($this), 100);
      return;
    }

    Debug.Call3('DialogManager.UpdateState', 'processing');

    this.setState({ Items: DialogManager.Items }, () => {
      Debug.Call3('DialogManager.UpdateState', 'successfully');
      DialogManager.UpdateStateNeed = false;
      window.setTimeout($this.UpdateState.bind($this), 100);
    });
  }

  /**
   * Adds and shows dialog.
   *
   * @param element Modal dialog or react component to add.
   */
  public static AddDialog(element: JSX.Element, visible?: boolean): Dialog {
    let dialog = new Dialog();

    if (element.key != undefined && element.key != null && element.key != '') {
      dialog.Key = element.key.toString();
    }

    Debug.Call('DialogManager.AddDialog', dialog.Key, visible);

    dialog.Visible = (visible == undefined || visible == null ? true : visible);
    dialog.Element = element;

    DialogManager.Items.push(dialog);
    DialogManager.UpdateStateNeed = true;

    return dialog;
  }

  /**
   * Creates and shows a new dialog with the specified parameters.
   *
   * @param settings Parameters.
   */
  public static CreateDialog(settings: DialogSettings): Dialog {
    let $this = this;

    let dialog = new Dialog(settings);

    dialog.Visible = true;

    Debug.Call('DialogManager.NewDialog', dialog.Key);

    let modal = [];

    if (settings != null) {
      const parts = ['Header', 'Body', 'Footer'];

      for (let i = 0; i < parts.length; i++) {
        let current = parts[i];

        if (settings[current] != null) {
          let added = false;

          Debug.Level3('typeof settings.' + current, typeof settings[current], settings[current]);

          if (typeof settings[current] === 'object') {

            if (typeof (settings[current] as any).type === 'function') {

              let currentType = (settings[current] as any).type;

              if (typeof currentType.name === 'string' && currentType.name.startsWith('Modal')) {
                modal.push(settings[current]);
                added = true;
              }

            }

          }

          if (!added) {
            if (current == 'Header') {
              modal.push
              (
                <Modal.Header key={TextHelper.RandomKey('modal_header_') } closeButton={settings.ShowCloseButton}>
                  <Modal.Title key={TextHelper.RandomKey('modal_title_') }>{settings[current]}</Modal.Title>
                </Modal.Header>
              );
            }
            else if (current == 'Body') {
              modal.push(<Modal.Body key={TextHelper.RandomKey('modal_body_') }>{settings[current]}</Modal.Body>);
            }
            else if (current == 'Footer') {
              modal.push(<Modal.Footer key={TextHelper.RandomKey('modal_footer_') }>{settings[current]}</Modal.Footer>);
            }
          }
        }
      }
    }

    dialog.Element =
      (
        <Modal key={'modal_' + dialog.Key} show={dialog.Visible} onHide={() => {
          if (dialog.Closed) {
            $this.CloseDialog(dialog.Key);
          }
        } }>{modal}</Modal>
      );

    // hide all
    DialogManager.HideAll(true);

    // add and show dialog
    DialogManager.Items.push(dialog);

    // update
    DialogManager.UpdateStateNeed = true;

    return dialog;
  }

  /**
   * Closes and removes dialog.
   *
   * @param key The key of dialog that must be closed.
   */
  public static CloseDialog(key: string): void {
    let dialogs = DialogManager.Items.filter((d) => d.Key === key);

    if (dialogs.length <= 0) {
      Debug.Warn('Dialog "' + key + '" not found.');
      return;
    }

    let dialog = dialogs[0];

    if (dialog.Settings !== undefined && dialog.Settings != null) {
      let args = new EventArgs();

      if (dialog.Settings.ClosingHandler !== undefined && dialog.Settings.ClosingHandler !== null && typeof dialog.Settings.ClosingHandler === 'function') {
        Debug.Call('Dialog.ClosingHandler', dialog.Key);
        dialog.Settings.ClosingHandler(dialog, args);
      }

      Debug.Call('Dialog.CloseDialog', dialog.Key, args);

      if (args.Cancel) {
        // handler is cancelled
        return;
      }

      // remove dialog
      DialogManager.Items = DialogManager.Items.filter((d) => d.Key !== key);

      if (dialog.Settings.ClosedHandler !== undefined && dialog.Settings.ClosedHandler !== null && typeof dialog.Settings.ClosedHandler === 'function') {
        Debug.Call('Dialog.ClosedHandler', dialog.Key);

        args = new EventArgs();
        dialog.Settings.ClosedHandler(dialog, args);

        if (args.Cancel) {
          Debug.Warn('It is impossible to cancel the ClosedHandler.');
        }
      }
    } else {
      Debug.Call('DialogManager.CloseDialog', key);

      // remove dialog
      DialogManager.Items = DialogManager.Items.filter((d) => d.Key !== key);
    }

    // show last dialog
    if (DialogManager.Items.length > 0) {
      DialogManager.Items[DialogManager.Items.length - 1].Visible = true;
    }

    DialogManager.UpdateStateNeed = true;

    // Debug.Log(this.state.Items);
  }

  /**
   * Hides all dialogs.
   */
  public static HideAll(donotUpdate?: boolean): void {
    Debug.Call('DialogManager.HideAll', donotUpdate);

    DialogManager.Items.forEach((dialog: Dialog) => {
      dialog.Visible = false;
    });

    if (!donotUpdate) {
      DialogManager.UpdateStateNeed = true;
    }
  }

  /**
   * Hides dialog.
   *
   * @param key The key of dialog that must be hidden.
   */
  public static HideDialog(key: string): boolean {
    Debug.Call('DialogManager.HideDialog', key);

    return DialogManager.SetDialogVisibleStatus(key, false);
  }

  /**
   * Shows dialog.
   *
   * @param key The key of dialog that must be hidden.
   */
  public static ShowDialog(key: string, state?: any): boolean {
    Debug.Call('DialogManager.ShowDialog', key);

    return DialogManager.SetDialogVisibleStatus(key, true, state);
  }

  // TODO: ShowNext - think

  public static ShowNext(): boolean {
    Debug.Call('DialogManager.ShowNext', DialogManager.Items.length);

    if (DialogManager.Items.length <= 0) {
      return false;
    }

    if (!DialogManager.Items[DialogManager.Items.length - 1].Visible) {
      DialogManager.Items[DialogManager.Items.length - 1].Visible = true;
      DialogManager.UpdateStateNeed = true;
    }

    return true;
  }

  /**
   * Checks the existence of a dialog.
   *
   * @param key The dialog key to check.
   */
  public static Exists(key: string): boolean {
    return DialogManager.Items.filter((d) => d.Key === key).length > 0;
  }

  private static SetDialogVisibleStatus(key: string, status: boolean, state?: any): boolean {
    let dialogs = DialogManager.Items.filter((d) => d.Key === key);

    Debug.Call3('DialogManager.SetDialogVisibleStatus', key, status, dialogs);

    if (dialogs.length <= 0) {
      Debug.Warn('Dialog "' + key + '" not found.');
      return false;
    }

    let dialog = dialogs[0];

    if (dialog.Visible != status) {
      dialog.Visible = status;

      //if (props != undefined) {
      //  dialog.Element = props;
      //}

      DialogManager.UpdateStateNeed = true;
    }

    return true;
  }

  /**
   * Commands to update the state.
   */
  public static Update(): void {
    DialogManager.UpdateStateNeed = true;
  }

  render() {
    Debug.Render3('DialogManager.render', DialogManager.Items, this.state);

    let items = [];

    DialogManager.Items.forEach((dialog: Dialog) => {
      if (dialog.Visible) {
        items.push(dialog.Element);
      }
    });

    return (<div>{items}</div>);
  }

}