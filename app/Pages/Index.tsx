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

import * as React from 'react';
import { Link } from 'react-router';
import Page from 'Core/Page';

/**
 * The main page.
 */
export default class Index extends Page<any, any> {

  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
  }

  render() {
    return (<div>
      <h1>{__("Hello world!")}</h1>
      <span className="glyphicon glyphicon-music"></span>
      <Link to="/Users">Users</Link>
    </div>);
  }

}