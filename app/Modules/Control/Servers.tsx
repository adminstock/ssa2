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
import { FormattedMessage } from 'react-intl';

import Page from 'Core/Page';
import App from 'Core/App';
import IAppStore from 'Core/IAppStore';
import ServersList from 'Components/ServersList';
import ServerEditor from 'Components/ServerEditor';
//import ServerEditor from 'Modules/Control/Components/ServerEditor';
import { OutputMode } from 'Components/OutputMode';
import { Server } from 'Models/Server';

import { LoadServers, TestConnection } from 'Modules/Control/Actions/ServerActions';

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
import IServersState from 'IServersState';
import IServersProps from 'IServersProps';

export class Servers extends Page<IServersProps, IServersState> {

  static defaultProps = {
    Title: 'Servers',
    CurrentUser: null
  }

  private List: ServersList;

  constructor(props, context) {
    super(props, context);

    let outputMode = App.GetValue<OutputMode>('Control.Servers.OutputMode');

    this.state = {
      OutputMode: outputMode || OutputMode.List,
      SelectedServer: ''
    };
  }

  componentWillReceiveProps(nextProps: any) {
    Debug.Call3('Servers.componentWillReceiveProps', nextProps);

    this.Init(nextProps);
  }

  componentWillMount() {
    Debug.Call3('Servers.componentWillMount');

    this.Init(this.props);
  }

  private Init(props: any): void {
    Debug.Call3('Servers.Init', props);

    if (props.location.state && props.location.state.newServer) {
      this.setState({
        ShowEditor: true,
        SelectedServer: ''
      });
    }
    else if (props.location.state && props.location.state.saved) {
      this.setState2({
        ShowEditor: false,
        SelectedServer: ''
      }).then(() => {
        if (props.location.state.isNew) {
          this.List.LoadServers();
        } else {
          this.List.SetServerToState(props.location.state.server);
        }
      });
    }
    else if (props.params) {
      this.setState({
        ShowEditor: (props.params.fileName ? true : false),
        SelectedServer: props.params.fileName || ''
      });
    }
  }

  private OutputMode_Click(newMode: OutputMode): void {
    this.setState({ OutputMode: newMode }, () => {
      App.SetValue('Control.Servers.OutputMode', newMode);
    });
  }

  private ServerEditor_Closed(): void {
    Debug.Call('ServerEditor_Closed');

    // remove filename from url
    this.router.push('/control/servers');
  }

  private ServerEditor_Saved(server: Server, isNew: boolean): void {
    Debug.Call('ServerEditor_Saved', server, isNew);

    // remove filename from url
    this.router.push({ pathname: '/control/servers', state: { saved: true, isNew: isNew, server: server } });
  }

  private ServerEditor_Show(server: Server): void {
    Debug.Call('ServerEditor_Show', server);

    if (server == null) {
      this.router.push('/control/servers/new');
    } else {
      this.router.push('/control/servers/' + server.FileName);
    }
  }

  private ServerEditor_Deleted(server: Server): void {
    Debug.Call('ServerEditor_OnDelete', server);

    let serverName = null;

    if (server.Connection != null && server.Connection.Host != '') {
      serverName = server.Connection.Host;
    }

    if (server.Name != null && server.Name != '' && (server.Connection == null || server.Name != server.Connection.Host)) {
      serverName = server.Name + ' (' + server.Connection.Host + ')';
    }

    if (serverName == null) {
      serverName = server.FileName;
    }

    App.Confirm({
      message: <div>{ 'Are you sure you want to delete the' } <strong>{ serverName }</strong>?</div>,
      buttonOkTitle: 'Yes, delete the server',
      callback: (d, confirmed) => {

      }
    });
  }

  render() {
    Debug.Render2('Servers', this.props);

    let alertMessage = null;

    if (this.props.CurrentUser.Server == null) {
      alertMessage = (
        <Alert bsStyle="danger">
          <p><FormattedMessage id="MDL_CONTROL_SELECT_SERVER" defaultMessage="To continue, you need to select the server." /></p>
          <p><FormattedMessage id="MDL_CONTROL_OR_CREATE_SERVER" defaultMessage="If not in the list of available servers, create a new server." /></p>
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
                <Button bsStyle="primary" onClick={ this.ServerEditor_Show.bind(this, null) }><Glyphicon glyph="plus" /> <FormattedMessage id="module.control.servers.addServer" defaultMessage="Add server" /></Button>
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
            SelectedServer={ this.props.params ? this.props.params.fileName : null }
            OnEdit={ this.ServerEditor_Show.bind(this) }
            OnDelete={ this.ServerEditor_Deleted.bind(this) }
            ref={ (ref) => this.List = ref }
          />

          <ServerEditor
            Visible={ this.state.ShowEditor }
            FileName={ this.state.SelectedServer }
            OnHide={ this.ServerEditor_Closed.bind(this) }
            OnSave={ this.ServerEditor_Saved.bind(this) }
            ActiveKey="connectionSettings"
          />
        </div>
      </DocumentTitle>
    );
  }

}

export default connect<IAppStore, IServersProps, any>(
  state => ({ CurrentUser: state.CurrentUser })
)(Servers);