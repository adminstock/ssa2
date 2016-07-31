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

import TextHelper from 'Helpers/TextHelper';
import DialogSettings from 'DialogSettings';

/**
 * Represents information about a server API.
 */
export default class Dialog {

  /** Unique key of the dialog. */
  public Key: string;

  private _Visible: boolean;

  /** Visible status. */
  public get Visible(): boolean {
    return this._Visible;
  }
  public set Visible(value: boolean) {
    this._Visible = value;

    if (this.Closed && value) {
      this._Visible = false;
    }
  }

  private _Closed: boolean;

  /** Closed status. */
  public get Closed(): boolean {
    return this._Closed;
  }
  public set Closed(value: boolean) {
    this._Closed = value;
  }

  /** Element. */
  public Element: JSX.Element;

  /** Dialog settings. Do not change the property. */
  public Settings: DialogSettings;

  constructor(settings?: DialogSettings) {
    this.Key = TextHelper.RandomKey('dialog_');
    this.Settings = settings;

    if (settings !== undefined && settings != null) {
      this.Settings.SetDialog(this);
    }
  }

}