/*
 * Copyright © AdminStock Team (www.adminstock.net), 2016. All rights reserved.
 * Copyright © Aleksey Nemiro, 2016. All rights reserved.
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

/**
 * Represents a request to the WebAPI of SmallServerAdmin.
 */
export default class ApiRequest<T> {

  /** The handler successful execution of the request. */
  public SuccessCallback: { (sender: ApiRequest<T>, response: T): void; } = null;

  /** The error handler. */
  public ErrorCallback: { (sender: ApiRequest<T>, response: any): void; } = null;

  /** The request complete handler. */
  public CompleteCallback: { (sender: ApiRequest<T>): void; } = null;

  private _Url: string;

  /** The address to which to send the request. */
  public get Url(): string {
    return this._Url;
  }

  private _Data: any;

  /** The request parameters. */
  public get Data(): any {
    return this._Data;
  }

  private _Key: string;

  /** Unique key of the request. */
  public get Key(): string {
    return this._Key;
  }

  /** Access token of the current user. */
  private Token: string;
  
  constructor(method: string, data?: any, url?: string) {
    if (method === null || method == '') {
      throw new Error('Method is required. Value cannot be empty.');
    }

    if (url === undefined || url == null || url == '') {
      url = 'TODO';
    }

    if (!url.endsWith('/')) {
      url += '/';
    }

    data = data || {};

    data = { Server: 'todo config file name', ApiMethod: method, Data: data };

    this._Url = url + method;
    this._Data = data;
    this._Key = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    this.Token = window.sessionStorage.getItem('AccessToken');
  }

  /**
   * Sends a request to the API.
   */
  public Execute(): void {
    let $this = this;

    Debug.Log('Token', this.Token);
    Debug.Log('ApiRequest.Execute', this.Key, this.Url, this.Data);

    $.ajax({
			type: 'POST',
			contentType: 'application/json',
      url: $this.Url,
      data: JSON.stringify($this.Data),

      headers: {
        "Authorization": "SSA-TOKEN " + $this.Token
      },

      success: (result: T) => {
        Debug.Log('ApiRequest.Success', $this.Key, $this.Url, result);
        if ($this.SuccessCallback != null) {
          $this.SuccessCallback($this, result);
        }
      },

      error: (x: JQueryXHR, textStatus: string, errorThrown: any) => {
        Debug.Log('ApiRequest.Error', $this.Key, $this.Url, textStatus, errorThrown);
        if ($this.ErrorCallback != null) {
          $this.ErrorCallback($this, null);
        }
      },

      complete: (x: JQueryXHR, textStatus: string) => {
        if ($this.CompleteCallback != null) {
          $this.CompleteCallback($this);
        }
      }
    });
  }

}