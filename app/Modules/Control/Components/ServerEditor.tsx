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
import Module from '../Models/Module';
import ModuleSettings from 'Models/ModuleSettings';
import { OperatingSystem } from 'Models/OperatingSystem';
import ConnectionSettings from 'Models/ConnectionSettings';

import IServerEditorProps from 'IServerEditorProps';
import IServerEditorState from 'IServerEditorState';

import ConnectionSettingsForm from 'ConnectionSettingsForm';
import ServerInfoForm from 'ServerInfoForm';
import OperatingSystemForm from 'OperatingSystemForm';
import ModulesList from 'ModulesList';

import { LoadServer, SaveServer } from '../Actions/ServerActions';

export default class ServerEditor extends Component<IServerEditorProps, IServerEditorState> {

  private ConnectionSettings: any;// ConnectionSettingsForm;
  private ServerInfo: ServerInfoForm;
  private OperatingSystem: OperatingSystemForm;
  private ModulesList: ModulesList;

  constructor(props?, context?) {
    super(props, context);

    this.state = {
      Server: null,
      Loading: false,
      Saving: false,
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

  private Panel_OnSelect(activeKey: string): void {
    Debug.Call3('Panel_OnSelect', this.state.ActiveKey, '=>', activeKey);

    let server = this.state.Server;

    switch (this.state.ActiveKey) {
      case 'connectionSettings':
        server.Connection = this.ConnectionSettings.Data;
        break;

      case 'serverInfo':
        server.Name = this.ServerInfo.Name;
        server.Description = this.ServerInfo.Description;
        break;

      case 'os':
        server.OS.Name = this.OperatingSystem.Name;
        server.OS.Family = this.OperatingSystem.Family;
        server.OS.Version = this.OperatingSystem.Version;
        break;

      case 'modules':
        server.Modules = this.ModulesList.Items;
        break;
    }

    this.setState({ Server: server, ActiveKey: activeKey });
  }

  private IsValid(): boolean {
    return this.ConnectionSettings.IsValid();
  }

  /**
   * Loads server data from server :)
   */
  private Load(): void {
    Debug.Call3('ServerEditor.Load', this.props.FileName);

    this.setState2({
      Loading: true
    }).then(() => {
      return this.dispatch(LoadServer(this.props.FileName));
    }).then((result) => {
      return this.setState2({ Server: this.NormalizeServer(result), Loading: false });
    }).catch((error) => {
      this.setState({ Loading: false }, () => {
        App.DefaultApiErrorHandler(error);
      });
    });
  }

  /**
   * Saves server data.
   */
  private Save(): void {
    Debug.Call3('ServerEditor.Save');

    // validation
    if (!this.IsValid()) {
      return;
    }

    let server = this.state.Server;
    server.Connection = this.ConnectionSettings.Data;
    server.OS.Name = this.OperatingSystem.Name;
    server.OS.Family = this.OperatingSystem.Family;
    server.OS.Version = this.OperatingSystem.Version;
    server.Name = this.ServerInfo.Name;
    server.Description = this.ServerInfo.Description;
    server.Modules = this.ModulesList.Items;
    server.FileName = this.props.FileName;

    // save
    this.setState2({ Saving: true, Server: server }).then(() => {
      return this.dispatch(SaveServer(server));
    }).then((savedServer) => {
      return this.setState2({ Saving: false, Server: this.NormalizeServer(savedServer) });
    }).then(() => {
      this.props.OnSave(this.state.Server, !server.FileName || server.FileName == '');
    }).catch((error) => {
      this.setState({ Saving: false }, () => App.DefaultApiErrorHandler(error));
    });
  }

  render() {
    Debug.Render3('ServerEditor', this.props.Visible);

    if (!this.props.Visible || this.state.Server == null) {
      return null;
    }

    let title = <FormattedMessage id="MDL_CONTROL_NEW_SERVER" defaultMessage="New server" />;

    if (this.props.FileName != '') {
      title = <FormattedMessage id="LBL_SERVER" defaultMessage="Server" />;
    }

    let disabled = this.state.Loading || this.state.LoadingModules || this.state.Saving;

    let progress = null;

    if (this.state.Loading || this.state.LoadingModules || this.state.Saving) {
      progress = (<i className="glyphicon glyphicon-refresh fa-spin"></i>);
    }

    return (
      <Modal id="serverEditor" show={ this.props.Visible } backdrop="static" onHide={ this.OnHide.bind(this) }>
        <Modal.Header closeButton={ !disabled }>
          <Modal.Title>{ title } { progress }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PanelGroup activeKey={ this.state.ActiveKey } accordion onSelect={ this.Panel_OnSelect.bind(this) }>
            <Panel header={ App.FormatMessage('MDL_CONTROL_CONNECTION', 'Connection') } eventKey="connectionSettings" data-name="connectionSettings">
              <ConnectionSettingsForm
                Disabled={ disabled }
                ConnectionSettings={ this.state.Server.Connection }
                ref={ (ref) => this.ConnectionSettings = ref }
              />
            </Panel>
            <Panel header={ App.FormatMessage('MDL_CONTROL_INFO', 'Info') } eventKey="serverInfo" data-name="serverInfo">
              <ServerInfoForm
                Disabled={ disabled }
                ServerName={ this.state.Server.Name }
                ServerDescription={ this.state.Server.Description }
                ref={ (ref) => this.ServerInfo = ref }
              />
            </Panel>
            <Panel header={ App.FormatMessage('MDL_CONTROL_OS', 'Operating System') } eventKey="os" data-name="os">
              <OperatingSystemForm
                Disabled={ disabled }
                Name={ this.state.Server.OS.Name }
                Family={ this.state.Server.OS.Family }
                Version={ this.state.Server.OS.Version }
                ref={ (ref) => this.OperatingSystem = ref }
              />
            </Panel>
            <Panel header={ App.FormatMessage('MDL_CONTROL_MODULES', 'Modules') } eventKey="modules" data-name="modules">
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
          <Button bsStyle="primary" disabled={ disabled } onClick={ this.Save.bind(this) }>
            { this.state.Saving ? <i className="fa fa-refresh fa-spin fa-fw"></i> : null }
            <FormattedMessage id="BTN_SAVE" defaultMessage="Save" />
          </Button>
          <Button bsStyle="default" disabled={ this.state.Saving } onClick={ this.OnHide.bind(this) }>
            <FormattedMessage id="BTN_CANCEL" defaultMessage="Cancel" />
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

}