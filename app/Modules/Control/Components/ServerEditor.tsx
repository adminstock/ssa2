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
import { FormattedMessage } from 'react-intl';
import
{
  Modal,
  Button, ButtonGroup, ButtonToolbar, Checkbox,
  Table, Row, Col,
  Form, FormGroup, FormControl,
  ControlLabel,
  Alert,
  PanelGroup, Panel
} from 'react-bootstrap';

import App from 'Core/App';
import Component from 'Core/Component';

import { Server, ServerStatus } from 'Models/Server';
import Module from 'Models/Module';
import ModuleSettings from 'Models/ModuleSettings';
import { OperatingSystem } from 'Models/OperatingSystem';
import ConnectionSettings from 'Models/ConnectionSettings';

import IServerEditorProps from 'IServerEditorProps';
import IServerEditorState from 'IServerEditorState';

import ConnectionSettingsForm from 'ConnectionSettingsForm';
import ServerInfoForm from 'ServerInfoForm';
import OperatingSystemForm from 'OperatingSystemForm';
import ModulesList from 'ModulesList';

export default class ServerEditor extends Component<IServerEditorProps, IServerEditorState> {

  private ConnectionSettings: ConnectionSettingsForm;
  private ServerInfo: ServerInfoForm;
  private OperatingSystem: OperatingSystemForm;
  private ModulesList: ModulesList;

  constructor(props?, context?) {
    super(props, context);

    this.state = {
      Server: null,
      Processing: false,
      LoadingModules: false,
      ActiveKey: this.props.ActiveKey
    };
  }

  componentWillMount() {
    Debug.Call3('ServerEditor.componentWillMount');

    this.Init();
  }

  componentWillReceiveProps(nextProps: IServerEditorProps) {
    Debug.Call3('ServerEditor.componentWillReceiveProps', nextProps);

    let needInit = (this.props.FileName != nextProps.FileName);

    this.setState(nextProps, () => {
      if (needInit) {
        this.Init();
      }
    });
  }

  private Init(): void {
    Debug.Call3('ServerEditor.Init', this.props.FileName);

    // reset server
    this.setState({ Server: this.NormalizeServer(null) }, () => {
      // load, if filename is not empty
      if (this.props.FileName != '') {
        this.Load();
      }
    });
  }

  private OnHide(): void {
    Debug.Call3('ServerEditor.OnHide', this.state.Server);

    this.props.OnHide();
  }

  private ModuleList_OnLoading(): void {
    this.setState({ LoadingModules: true });
  }

  private ModuleList_OnLoaded(): void {
    this.setState({ LoadingModules: false });
  }

  private NormalizeServer(server: Server): Server {
    Debug.Call3('ServerEditor.NormalizeServer', server);
    
    if (server == null) {
      server = new Server();
    }

    server.Name = server.Name || '';
    server.Description = server.Description || '';
    server.FileName = server.FileName || '';

    if (server.Connection == null) {
      server.Connection = new ConnectionSettings();
    }

    server.Connection.Host = server.Connection.Host || '';
    server.Connection.Password = server.Connection.Password || '';
    server.Connection.User = server.Connection.User || '';
    server.Connection.Port = server.Connection.Port || 22;
    server.Connection.RequiredPassword = (server.Connection.RequiredPassword === undefined ? true : server.Connection.RequiredPassword);

    if (server.OS == null) {
      server.OS = new OperatingSystem();
    }

    server.OS.Family = server.OS.Family || '';
    server.OS.Name = server.OS.Name || '';
    server.OS.Version = server.OS.Version || '';
    
    if ((server.Modules == null || server.Modules.length <= 0)) {
      server.Modules = new Array<ModuleSettings>();
    }

    return server;
  }

  /**
   * Loads server data from server :)
   */
  private Load(): void {
    Debug.Call3('ServerEditor.Load', this.props.FileName);

    this.setState({ Processing: true }, () => {
      App.MakeRequest<any, Server>('Control.GetServer', { FileName: this.props.FileName }).then((result) => {
        this.setState({ Server: this.NormalizeServer(result), Processing: false });
      }).catch((error) => {
        this.setState({ Processing: false }, () => {
          App.DefaultApiErrorHandler(error);
        });
      });
    });
  }

  /**
   * Saves server data.
   */
  private Save(): void {
    Debug.Call3('ServerEditor.Save');


  }

  render() {
    Debug.Render3('ServerEditor');

    if (this.state.Server == null) {
      return null;
    }

    let title = <FormattedMessage id="MDL_CONTROL_NEW_SERVER" defaultMessage="New server" />;

    if (this.props.FileName != '') {
      title = <FormattedMessage id="LBL_SERVER" defaultMessage="Server" />;
    }

    let disabled = this.state.Processing || this.state.LoadingModules;

    let progress = null;

    if (this.state.Processing || this.state.LoadingModules) {
      progress = (<i className="glyphicon glyphicon-refresh fa-spin"></i>);
    }

    return (
      <Modal show={ this.props.Visible } backdrop="static" onHide={ this.OnHide.bind(this) }>
        <Modal.Header closeButton>
          <Modal.Title>{ title } { progress }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PanelGroup activeKey={ this.state.ActiveKey } accordion onSelect={ (activeKey) => this.setState({ ActiveKey: activeKey }) }>
            <Panel header={ App.FormatMessage('MDL_CONTROL_CONNECTION', 'Connection') } eventKey="1">
              <ConnectionSettingsForm
                Disabled={ disabled }
                ConnectionSettings={ this.state.Server.Connection }
                ref={ (ref) => this.ConnectionSettings = ref }
              />
            </Panel>
            <Panel header={ App.FormatMessage('MDL_CONTROL_INFO', 'Info') } eventKey="2">
              <ServerInfoForm
                Disabled={ disabled }
                ServerName={ this.state.Server.Name }
                ServerDescription={ this.state.Server.Description }
                ref={ (ref) => this.ServerInfo = ref }
              />
            </Panel>
            <Panel header={ App.FormatMessage('MDL_CONTROL_OS', 'Operating System') } eventKey="3">
              <OperatingSystemForm
                Disabled={ disabled }
                Name={ this.state.Server.OS.Name }
                Family={ this.state.Server.OS.Family }
                Version={ this.state.Server.OS.Version }
                ref={ (ref) => this.OperatingSystem = ref }
              />
            </Panel>
            <Panel header={ App.FormatMessage('MDL_CONTROL_MODULES', 'Modules') } eventKey="4">
              <ModulesList
                Disabled={ disabled }
                Modules={ this.state.Server.Modules }
                OnLoading={ this.ModuleList_OnLoading.bind(this) }
                OnLoaded={ this.ModuleList_OnLoaded.bind(this) }
                ref={ (ref) => this.ModulesList = ref }
              />
            </Panel>
          </PanelGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" disabled={ this.state.Processing } onClick={ this.Save.bind(this) }>
            { this.state.Processing ? <i className="fa fa-refresh fa-spin fa-fw"></i> : null }
            <FormattedMessage id="BTN_SAVE" defaultMessage="Save" />
          </Button>
          <Button bsStyle="default" disabled={ this.state.Processing } onClick={ this.OnHide.bind(this) }>
            <FormattedMessage id="BTN_CANCEL" defaultMessage="Cancel" />
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

}