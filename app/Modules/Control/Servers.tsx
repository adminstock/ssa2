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
import ServersList from 'Modules/Control/Components/ServersList';
//import ServerEditor from 'Modules/Control/Components/ServerEditor';
import { OutputMode } from 'Modules/Control/Components/OutputMode';

import { connect } from 'react-redux';

import {
  Table,
  ButtonToolbar,
  ButtonGroup,
  Button,
  Glyphicon,
  Image,
  Alert
} from 'react-bootstrap';

import { SetBreadcrumbs } from 'Actions/Global';

export class Servers extends Page<any, any> {

  static defaultProps = {
    Title: __('Servers'),
    CurrentServer: null
  }

  private List: ServersList;

  constructor(props, context) {
    super(props, context);

    let outputMode = App.GetValue<OutputMode>('Control.Servers.OutputMode');

    this.state = {
      OutputMode: outputMode || OutputMode.List
    };

  }

  componentWillMount() {
    //App.MakeRequest('Users.GetUsers', {page: 1 });
    App.Store.dispatch(SetBreadcrumbs('Servers123'));
  }

  private OutputMode_Click(newMode: OutputMode): void {
    this.setState({ OutputMode: newMode }, () => {
      App.SetValue('Control.Servers.OutputMode', newMode);
    });
  }

  private NewServer(): void {
    Debug.Call('NewServer');

    this.List.NewServer();
  }

  render() {
    Debug.Render2('Servers');

    let alertMessage = null;

    if (App.Context.CurrentServer == null) {
      alertMessage = (
        <Alert bsStyle="danger">
          <p>{ __('To continue, you need to select the server.') }</p>
          <p>{ __('If not in the list of available servers, create a new server.') }</p>
        </Alert>
      );
    }

    return (
      <DocumentTitle title={this.props.Title}>
        <div>
          {alertMessage}

          <h2 className="pull-left">
            <ButtonToolbar>
              <ButtonGroup>
                <Button bsStyle="primary" onClick={ this.NewServer.bind(this) }><Glyphicon glyph="plus" /> { __('Add server') }</Button>
              </ButtonGroup>
            </ButtonToolbar>
          </h2>

          <h2 className="pull-right">
            <ButtonToolbar>
              <ButtonGroup>
                <Button active={ this.state.OutputMode == OutputMode.List } onClick={ this.OutputMode_Click.bind(this, OutputMode.List) }><Glyphicon glyph="th-list" /></Button>
                <Button active={ this.state.OutputMode == OutputMode.Thumbnail } onClick={ this.OutputMode_Click.bind(this, OutputMode.Thumbnail) }><Glyphicon glyph="th" /></Button>
                <Button active={ this.state.OutputMode == OutputMode.ThumbnailLarge } onClick={ this.OutputMode_Click.bind(this, OutputMode.ThumbnailLarge) }><Glyphicon glyph="th-large" /></Button>
              </ButtonGroup>
            </ButtonToolbar>
          </h2>

          <div className="clearfix"></div>

          <ServersList
            OutputMode={ this.state.OutputMode }
            ShowControl={ true }
            ref={ (ref) => this.List = ref }
          />
        </div>
      </DocumentTitle>
    );
  }

}

export default connect(
  state => ({ CurrentServer: state.CurrentServer })
)(Servers);