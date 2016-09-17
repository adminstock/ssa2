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

import IServerEditorState from 'IServerEditorState';
import ConnectionSettings from 'ConnectionSettings';

import ModuleInfo from 'ModuleInfo';

export default class ServerEditor extends Component<any, IServerEditorState> {

  constructor(props?, context?) {
    super(props, context);

    this.state = {
      Server: this.props.Server,
      AllModules: null,
      Processing: false,
      LoadingModules: false,
      ShowModuleInfo: false,
      SelectedModule: null
    };
  }

  componentWillMount() {
    Debug.Call3('ServerEditor.componentWillMount');

    if (this.state.AllModules == null) {
      this.LoadModules();
    }
  }

  private LoadModules(): void {
    Debug.Call3('LoadModules');

    this.setState({
      LoadingModules: true
    }, () => {
      App.MakeRequest<any, Array<Module>>({
        Method: 'Control.GetModules',
        SuccessCallback: (result) => {
          this.setState({ AllModules: result, LoadingModules: false });
        },
        ErrorCallback: (error) => {
          App.DefaultApiErrorHandler(error);
        }
      });
    });
  }

  private ModuleInfoShow(module: Module): void {
    this.setState({
      ShowModuleInfo: true,
      SelectedModule: module
    });
  }

  private ModuleInfoHide(): void {
    this.setState({
      ShowModuleInfo: false
    });
  }

  render() {
    Debug.Render3('ServerEditor');

    let title = <FormattedMessage id="MDL_CONTROL_NEW_SERVER" defaultMessage="New server" />;

    if (this.props.Server != null) {
      title = <FormattedMessage id="LBL_SERVER" defaultMessage="Server" />;
    }

    let disabled = false;

    let allModules = [];

    if (this.state.AllModules != null) {
      this.state.AllModules.forEach((m, i) => {
        allModules.push(
          <tr key={ 'module-' + i }>
            <td>
              <Checkbox checked={ m.Enabled }>{ m.Name }</Checkbox>
            </td>
            <td>
              <Button bsSize="small" onClick={ this.ModuleInfoShow.bind(this, m) }>
                <i className="glyphicon glyphicon-info-sign"></i>
              </Button>
            </td>
            <td>
              <Button bsSize="small">
                <i className="glyphicon glyphicon-cog"></i>
              </Button>
            </td>
          </tr>
        );
      });
    }

    return (
      <div>
        <Modal show={ this.props.Visible } backdrop="static" onHide={ () => { } }>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Accordion>
              <Panel header={ App.FormatMessage('MDL_CONTROL_CONNECTION', 'Connection') } eventKey="1">
                <ConnectionSettings />
              </Panel>
              <Panel header={ App.FormatMessage('MDL_CONTROL_INFO', 'Info') } eventKey="2">
                <Form horizontal>
                  <FormGroup controlId="loginFormPassword" validationState={ null }>
                    <Col xs={12} sm={4} md={3} lg={3} componentClass={ControlLabel}>
                      <FormattedMessage id="LBL_NAME" defaultMessage="Name" />:
                    </Col>
                    <Col xs={12} sm={8} md={9} lg={9}>
                      <FormControl type="text" maxLength={50} disabled={disabled} />
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="loginFormPassword" validationState={ null }>
                    <Col xs={12} sm={4} md={3} lg={3} componentClass={ControlLabel}>
                      <FormattedMessage id="LBL_DESCRIPTION" defaultMessage="Description" />:
                    </Col>
                    <Col xs={12} sm={8} md={9} lg={9}>
                      <FormControl componentClass="textarea" rows={5} disabled={disabled} />
                    </Col>
                  </FormGroup>
                </Form>
              </Panel>
              <Panel header={ App.FormatMessage('MDL_CONTROL_MODULES', 'Modules') } eventKey="3">
                <Table>
                  <tbody>
                    { allModules }
                  </tbody>
                </Table>
              </Panel>
            </Accordion>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" disabled={ this.state.Processing }>
              { this.state.Processing ? <i className="fa fa-refresh fa-spin fa-fw"></i> : null }
              <FormattedMessage id="BTN_SAVE" defaultMessage="Save" />
            </Button>
            <Button bsStyle="default" disabled={ this.state.Processing }>
              <FormattedMessage id="BTN_CANCEL" defaultMessage="Cancel" />
            </Button>
          </Modal.Footer>
        </Modal>

        <ModuleInfo Visible={ this.state.ShowModuleInfo } Module={ this.state.SelectedModule } OnHide={ this.ModuleInfoHide.bind(this) } />
      </div>
    );
  }

}