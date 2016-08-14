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
import App from 'Core/App';
import { Overlay, OverlayType } from 'UI/Overlay';

/**
 * Error page.
 */
export default class Error extends React.Component<any, any> {

  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {

  }

  render() {
    return <div><h1>TODO: Error page</h1>{this.props.msg}</div>;
  }

}