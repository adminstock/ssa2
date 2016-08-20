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
import IMainContext from 'Core/IMainContext';
import CurrentUser from 'Core/CurrentUser';
import Component from 'Core/Component';

export default class Header extends Component<any, any> {
  
  constructor(props, context) {
    super(props, context);
  }
  
  /**
   * Sets language.
   *
   * @param newLanguage New language: en, ru, de etc.
   */
  private SetLanguage(newLanguage: string): void {
    CurrentUser.Language = newLanguage;
  }

  private GetServerIcon(): string {
    if (CurrentUser.ManagedServer == null) {
      return null;
    }

    let result = '';
    
    let server = CurrentUser.ManagedServer;

    if (server.OS) {
      let name = '';
      let family = '';

      if (server.OS.Name != null) {
        name = server.OS.Name.toLowerCase();
      }

      if (server.OS.Family != null) {
        family = server.OS.Family.toLowerCase();
      }

      if (name.indexOf('debian') != -1) {
        result = 'os-icon24-debian';
      }
      else if (name.indexOf('ubuntu') != -1) {
        result = 'os-icon24-ubuntu';
      }
      else if (name.indexOf('freebsd') != -1) {
        result = 'os-icon24-freebsd';
      }
      else if (name.indexOf('redhat') != -1) {
        result = 'os-icon24-redhat';
      }
      else if (name.indexOf('centos') != -1) {
        result = 'os-icon24-centos';
      }
      else if (name.indexOf('windows') != -1) {
        result = 'os-icon24-windows';

        if (name.indexOf('2012') != -1 || name.indexOf('2016') != -1) {
          result = 'os-icon24-windows2012';
        }
      }
      else if (name.indexOf('osx') != -1 || name.indexOf('os x') != -1 || name.indexOf('mac') != -1) {
        result = 'os-icon24-osx';
      }

      if (result == '' && family != '') {
        if (family.indexOf('linux') != -1) {
          result = 'os-icon24-linux';
        }
      }
    }

    return 'os-icon24 ' + result;
  }


  render() {
    let serverName = '';

    if (CurrentUser.ManagedServer != null) {
      serverName = CurrentUser.ManagedServer.FileName;

      if (CurrentUser.ManagedServer.Name != null && CurrentUser.ManagedServer.Name != '') {
        serverName = CurrentUser.ManagedServer.Name;
      }
    }

    return (
      <nav className="navbar navbar-default">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".panel-nav">
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" title="All servers"><span className="fa fa-server"></span></a>
            <a href="/" className="navbar-brand" title="Dashboard">
              <i className={this.GetServerIcon()}></i>
              {serverName}
            </a>
            <span className="navbar-brand hidden-xs">/</span>
            <span className="navbar-brand hidden-xs">
              TODO Page title
            </span>
          </div>
          <ul className="nav navbar-nav navbar-right collapse navbar-collapse panel-nav lang">
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                <i className="lang lang-noselect"></i>
                <span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                <li><a onClick={this.SetLanguage.bind(this, ['en'])}><i className="lang lang-en"></i></a></li>
                <li><a onClick={this.SetLanguage.bind(this, ['ru'])}><i className="lang lang-ru"></i></a></li>
                <li><a onClick={this.SetLanguage.bind(this, ['de'])}><i className="lang lang-de"></i></a></li>
              </ul>
            </li>
            <li><a href="/logout.php"><span className="glyphicon glyphicon-log-out"></span> Logout</a></li>
          </ul>
        </div>
      </nav>
    )
  }

}