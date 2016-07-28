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

export default class DialogManager extends React.Component<any, IDialogManagerState> {

  private static UpdateStateNeed: boolean = false;

  private static Items = new Array<Dialog>();

  static statics = {
    Items: DialogManager.Items,
    AddDialog: DialogManager.AddDialog,
    CreateDialog: DialogManager.CreateDialog,
    CloseDialog: DialogManager.CloseDialog
  };

  constructor(props?, context?) {
    super(props, context);

    Debug.Log(this);

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
    
    Debug.Log('DialogManager.UpdateState', 'processing');

    this.setState({ Items: DialogManager.Items }, () => {
      Debug.Log('DialogManager.UpdateState', 'successfully');
      DialogManager.UpdateStateNeed = false;
      window.setTimeout($this.UpdateState.bind($this), 100);
    });
  }

  public static AddDialog(element: JSX.Element): Dialog {
    let dialog = new Dialog();

    dialog.Visible = true;
    dialog.Element = element;

    DialogManager.Items.push(dialog);
    DialogManager.UpdateStateNeed = true;

    return dialog;
  }

  public static CreateDialog(settings: DialogSettings): Dialog {
    let $this = this;

    let dialog = new Dialog(settings);

    dialog.Visible = true;

    Debug.Log('DialogManager.NewDialog', dialog.Key);

    let modal = [];

    if (settings != null) {
      const parts = ['Header', 'Body', 'Footer'];

      for (let i = 0; i < parts.length; i++) {
        let current = parts[i];

        if (settings[current] != null) {
          let added = false;

          Debug.Log('typeof settings.' + current, typeof settings[current], settings[current]);

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
                <Modal.Header key={TextHelper.RandomKey('modal_header_')} closeButton={settings.ShowCloseButton}>
                  <Modal.Title key={TextHelper.RandomKey('modal_title_')}>{settings[current]}</Modal.Title>
                </Modal.Header>
              );
            }
            else if (current == 'Body') {
              modal.push(<Modal.Body key={TextHelper.RandomKey('modal_body_')}>{settings[current]}</Modal.Body>);
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
      <Modal key={'modal_' + dialog.Key} show={dialog.Visible} onHide={() => { $this.CloseDialog(dialog.Key); }}>{modal}</Modal>
    );

    DialogManager.Items.push(dialog);
    DialogManager.UpdateStateNeed = true;

    return dialog;
  }
  
  public static CloseDialog(key: string): void {
    let dialog = DialogManager.Items.filter((d) => d.Key === key)[0];

    if (dialog.Settings !== undefined && dialog.Settings != null) {
      let args = new EventArgs();

      if (dialog.Settings.ClosingHandler !== undefined && dialog.Settings.ClosingHandler !== null && typeof dialog.Settings.ClosingHandler === 'function') {
        Debug.Log('Dialog.ClosingHandler', dialog.Key);
        dialog.Settings.ClosingHandler(dialog, args);
      }

      Debug.Log('Dialog.CloseDialog', dialog.Key, args);

      if (args.Cancel) {
        // handler is cancelled
        return;
      }

      // remove dialog
      DialogManager.Items = DialogManager.Items.filter((d) => d.Key !== key);

      if (dialog.Settings.ClosedHandler !== undefined && dialog.Settings.ClosedHandler !== null && typeof dialog.Settings.ClosedHandler === 'function') {
        Debug.Log('Dialog.ClosedHandler', dialog.Key);

        args = new EventArgs();
        dialog.Settings.ClosedHandler(dialog, args);

        if (args.Cancel) {
          Debug.Warn('It is impossible to cancel the ClosedHandler.');
        }
      }
    } else {
      Debug.Log('DialogManager.CloseDialog', key);

      // remove dialog
      DialogManager.Items = DialogManager.Items.filter((d) => d.Key !== key);
    }

    DialogManager.UpdateStateNeed = true;

    // Debug.Log(this.state.Items);
  }

  public static Update(): void {
    DialogManager.UpdateStateNeed = true;
  }

  render() {
    Debug.Log('DialogManager.render', DialogManager.Items, this.state);

    let items = [];

    DialogManager.Items.forEach((dialog: Dialog) => {
      items.push(dialog.Element);
    });

    return (<div>{items}</div>);
  }

}