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

import Dialog from 'Dialog';
import EventArgs from 'Core/EventArgs';
import DialogManager from 'UI/Dialog/DialogManager';

/**
 * Represents settings of Dialog.
 */
export default class DialogSettings {

  private Dialog: Dialog;

  public Header: string | JSX.Element;

  public Body: string | JSX.Element;

  public Footer: string | JSX.Element;

  /**
   * Gets or sets a value indicating whether the Close button is displayed in the caption bar of dialog.
   * Default: true.
   */
  public ShowCloseButton: boolean = true;

  public ClosingHandler: { (sender: Dialog, e: EventArgs): void };

  public ClosedHandler: { (sender: Dialog, e: EventArgs): void };

  public ShowHandler: { (sender: Dialog, e: EventArgs): void };
  
  public constructor() {

  }

  public SetDialog(dialog: Dialog): void {
    if (this.Dialog != null) {
      Debug.Warn('Are you sure you do it right? Please check the logic. New dialog cannot be assigned. Please use different instances of DialogSettings.');
    }

    this.Dialog = dialog;
  }

  public OnCloseDialog(): void {
    if (!this.Dialog) {
      Debug.Log('OnCloseDialog', false);
    }
    else {
      Debug.Log('OnCloseDialog', true);

      DialogManager.CloseDialog(this.Dialog.Key);
    }
  }

}