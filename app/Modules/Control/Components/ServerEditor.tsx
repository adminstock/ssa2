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

import
{
  Modal,
  Button, ButtonGroup, ButtonToolbar,
  Row, Col,
  Form, FormGroup, FormControl,
  ControlLabel,
  Alert,
  Accordion,
  Panel
} from 'react-bootstrap';

import App from 'Core/App';
import Component from 'Core/Component';

import { Server, ServerStatus } from 'Models/Server';

export default class ServerEditor extends Component<any, any> {

  constructor(props?, context?) {
    super(props, context);

    this.state = {
      Server: this.props.Server || new Server(),
      Processing: false
    };
  }

  render() {
    Debug.Render3('ServerEditor');

    let title = __('New server');
    let submitTitle = __('Create');

    if (this.props.Company != null) {
      title = __('Server');
      submitTitle = __('Save');
    }

    return (
      <Modal show={this.props.Visible} backdrop="static" onHide={ () => { } }>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Accordion>
            <Panel header={ __('Connection') } eventKey="1">
              1
            </Panel>
            <Panel header={ __('Info') } eventKey="2">
              2
            </Panel>
            <Panel header={ __('Modules') } eventKey="3">
              3
            </Panel>
          </Accordion>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" disabled={ this.state.Processing }>
            { this.state.Processing ? <i className="fa fa-refresh fa-spin fa-fw"></i> : null }
            {submitTitle}
          </Button>
          <Button bsStyle="default" disabled={ this.state.Processing }>
            { __('Cancel') }
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

}