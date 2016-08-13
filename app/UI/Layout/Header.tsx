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

export default class Header extends React.Component<any, any> {

  context: IMainContext;
  
  constructor(props, context) {
    super(props, context);

    Debug.Init(this);
  }
  
  /**
   * Sets language.
   *
   * @param newLanguage New language: en, ru, de etc.
   */
  private SetLanguage(newLanguage: string): void {
    CurrentUser.Language = newLanguage;
  }

  render() {
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
              TODO SERVER NAME
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