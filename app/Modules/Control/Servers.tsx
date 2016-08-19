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
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';
import Page from 'Core/Page';
import App from 'Core/App';
import ServersList from 'Modules/Control/UI/ServersList';
import { OutputMode } from 'Modules/Control/UI/OutputMode';

import {
  Table,
  ButtonToolbar,
  ButtonGroup,
  Button,
  Glyphicon,
  Image
} from 'react-bootstrap';

export default class Servers extends Page<any, any> {

  static defaultProps = {
    Title: __('Servers')
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      OutputMode: OutputMode.List
    };
  }

  componentWillMount() {
    //App.MakeRequest('Users.GetUsers', {page: 1 });
  }

  private OutputMode_Click(newMode: OutputMode) {
    this.setState({ OutputMode: newMode });
  }

  render() {
    Debug.Render2('Servers');

    return (
      <DocumentTitle title={this.props.Title}>
        <div>
          <h2 className="pull-left">
            { __('Servers') }
          </h2>

          <h2 className="pull-right">
            <ButtonToolbar>
              <ButtonGroup>
                <Button active={ this.state.OutputMode == OutputMode.List } onClick={ this.OutputMode_Click.bind(this, OutputMode.List) }><Glyphicon glyph="th-list" /></Button>
                <Button active={ this.state.OutputMode == OutputMode.Thumbnail } onClick={ this.OutputMode_Click.bind(this, OutputMode.Thumbnail) }><Glyphicon glyph="th-large" /></Button>
              </ButtonGroup>

              <ButtonGroup>
                <Button bsStyle="primary"><Glyphicon glyph="plus" /> { __('Add server') }</Button>
              </ButtonGroup>
            </ButtonToolbar>
          </h2>

          <div className="clearfix"></div>

          <ServersList OutputMode={ this.state.OutputMode } />
        </div>
      </DocumentTitle>
    );
  }

}