﻿/*
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
import DocumentTitle from 'react-document-title';
import Page from 'Core/Page';
import IPageProps from 'Core/IPageProps';
import App from 'Core/App';

export default class Edit extends Page<IPageProps, any> {

  static defaultProps = {
    Title: 'Users Editor'
  }

  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    this.SetBreadcrumbs('Users Editor');

    // test
    App.Alert('test1');
    App.Alert(<div>hello world</div>);
    App.Confirm(<div>hello world11111</div>);
    App.Confirm(<div>This is test<br />test<br />tessst</div>).then(confirmed => { Debug.Log('Confirmed', confirmed) });
    App.Confirm({ Text: '123', Title: 'Are you want?' }).then(confirmed => Debug.Log('Confirmed', confirmed));
  }

  render() {
    return (
      <DocumentTitle title={this.props.Title}>
        <div>TODO: User Editor</div>
      </DocumentTitle>
    );
  }

}