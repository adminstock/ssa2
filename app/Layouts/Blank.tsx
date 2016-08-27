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
import { render } from 'react-dom';
import DocumentTitle from 'react-document-title';
import IMainContext from 'Core/IMainContext';

/**
 * Blank layout.
 */
export default class Blank extends React.Component<any, any> implements IMainContext {

  public router: ReactRouter.RouterOnContext;

  static contextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object.isRequired
  }

  static childContextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object.isRequired
  }

  static defaultProps = {
    Title: 'SmallServerAdminV2'
  }

  constructor(props, context) {
    super(props, context);

    Debug.Init(this);
  }

  public getChildContext(): any {
    return {
      router: (this.context as any).router
    };
  }
  
  render() {
    Debug.Render('Blank');

    return (
      <DocumentTitle title={this.props.Title}>
        <div>
          {this.props.children}
        </div>
      </DocumentTitle>
    )
  }

}