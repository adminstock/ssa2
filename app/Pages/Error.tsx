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
import DocumentTitle from 'react-document-title';
import App from 'Core/App';
import Page from 'Core/Page';
import { Overlay, OverlayType } from 'UI/Overlay';
import { Grid, PageHeader, Alert, Button } from 'react-bootstrap';

/**
 * Error page.
 */
export default class Error extends Page<any, any> {

  static defaultProps = {
    Title: __('Error'),
    returnUrl: '/'
  }

  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {

  }

  render() {
    return (
      <DocumentTitle title={this.props.Title}>
        <Grid>
          <PageHeader>Application Error</PageHeader>
          <Alert bsStyle="danger">
            <h4>{this.props.Title}</h4>
            {this.props.Text}
          </Alert>
        </Grid>
      </DocumentTitle>
    );
  }

}