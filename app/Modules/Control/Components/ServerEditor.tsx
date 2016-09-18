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
  Row, Col,
  Form, FormGroup, FormControl,
  ControlLabel,
  Alert,
  Accordion,
  Panel,
  Table
} from 'react-bootstrap';

import App from 'Core/App';
import Component from 'Core/Component';

import { Server, ServerStatus } from 'Models/Server';
import Module from 'Models/Module';
import ModuleSettings from 'Models/ModuleSettings';
import OperatingSystem from 'Models/OperatingSystem';

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
      Server: this.props.Server,
      Processing: false,
      LoadingModules: false
    };
  }

  //componentWillMount() {
  //  Debug.Call3('ServerEditor.componentWillMount');
  //}

  componentWillReceiveProps(nextProps: any) {
    Debug.Call3('ServerEditor.componentWillReceiveProps', nextProps);

    this.setState(nextProps);
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

  private Save(): void {
    Debug.Log('Save', this.ConnectionSettings.Data, this.ServerInfo.Name, this.ServerInfo.Description, this.ModulesList.state.Modules);
  }

  render() {
    Debug.Render3('ServerEditor');

    if (this.state.Server == null) {
      return null;
    }

    let title = <FormattedMessage id="MDL_CONTROL_NEW_SERVER" defaultMessage="New server" />;

    if (this.props.Server != null) {
      title = <FormattedMessage id="LBL_SERVER" defaultMessage="Server" />;
    }

    let disabled = this.state.Processing || this.state.LoadingModules;

    if (this.state.Server.OS == null) {
      this.state.Server.OS = new OperatingSystem();
    }

    if ((this.state.Server.Modules == null || this.state.Server.Modules.length <= 0)) {
      this.state.Server.Modules = new Array<ModuleSettings>();
    }

    return (
      <Modal show={ this.props.Visible } backdrop="static" onHide={ this.OnHide.bind(this) }>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Accordion>
            <Panel header={ App.FormatMessage('MDL_CONTROL_CONNECTION', 'Connection') } eventKey="1">
              <ConnectionSettingsForm
                Disabled={ disabled }
                ConnectionSettings={ this.state.Server.Connection }
                ref={(ref) => this.ConnectionSettings = ref }
              />
            </Panel>
            <Panel header={ App.FormatMessage('MDL_CONTROL_INFO', 'Info') } eventKey="2">
              <ServerInfoForm
                Disabled={ disabled }
                ServerName={ this.state.Server.Name }
                ServerDescription={ this.state.Server.Description }
                ref={(ref) => this.ServerInfo = ref }
              />
            </Panel>
            <Panel header={ App.FormatMessage('MDL_CONTROL_OS', 'Operating System') } eventKey="3">
              <OperatingSystemForm
                Disabled={ disabled }
                Name={ this.state.Server.OS.Name }
                Family={ this.state.Server.OS.Family }
                Version={ this.state.Server.OS.Version }
                ref={(ref) => this.OperatingSystem = ref }
              />
            </Panel>
            <Panel header={ App.FormatMessage('MDL_CONTROL_MODULES', 'Modules') } eventKey="4">
              <ModulesList
                Disabled={ disabled }
                Modules={ this.state.Server.Modules }
                OnLoading={ this.ModuleList_OnLoading.bind(this) }
                OnLoaded={ this.ModuleList_OnLoaded.bind(this) }
                ref={(ref) => this.ModulesList = ref }
              />
            </Panel>
          </Accordion>
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