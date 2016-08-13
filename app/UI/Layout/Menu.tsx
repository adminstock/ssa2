﻿/*
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

import * as React from 'react';
import { Link } from 'react-router';
import IMainContext from 'Core/IMainContext';

export default class Menu extends React.Component<any, any> {

  context: IMainContext;

  constructor(props, context) {
    super(props, context);

    Debug.Log(this);
  }

  render() {
    return (
      <div className="collapse navbar-collapse panel-nav">
        <nav className="navmenu navmenu-default" role="navigation">
          <ul className="nav navmenu-nav">
            <li><a>TODO</a></li>
            <li>
              <Link to="/Users">test</Link>
            </li>
            <li className="nav-divider"></li>
            <li>
              <a href="https://github.com/adminstock">@adminstock</a>
            </li>
          </ul>
        </nav>
      </div>
    )
  }

}