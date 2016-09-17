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
  Button, Checkbox,
  Row, Col,
  Form, FormGroup, FormControl,
  ControlLabel,
} from 'react-bootstrap';

import App from 'Core/App';
import Component from 'Core/Component';

import { Server, ServerStatus } from 'Models/Server';
import Module from 'Models/Module';

import IServerEditorState from 'IServerEditorState';

export default class ConnectionSettings extends Component<any, any> {

  constructor(props?, context?) {
    super(props, context);

    this.state = {};
  }

  render() {
    Debug.Render3('ConnectionSettings');

    let disabled = false;

    return (
      <Form horizontal>
        <FormGroup controlId="loginFormPassword" validationState={ null }>
          <Col xs={12} sm={4} md={3} lg={3} componentClass={ControlLabel}>
            <FormattedMessage id="LBL_HOST" defaultMessage="Host" />:
          </Col>
          <Col xs={12} sm={8} md={9} lg={9}>
            <FormControl type="text" maxLength={100} required disabled={disabled} />
            <FormControl.Feedback />
          </Col>
        </FormGroup>
        <FormGroup controlId="loginFormPassword" validationState={ null }>
          <Col xs={12} sm={4} md={3} lg={3} componentClass={ControlLabel}>
            <FormattedMessage id="LBL_PORT" defaultMessage="Port" />:
          </Col>
          <Col xs={12} sm={6} md={5} lg={3}>
            <FormControl type="number" maxLength={4} min={0} max={65535} required disabled={disabled} />
            <FormControl.Feedback />
          </Col>
        </FormGroup>
        <FormGroup controlId="loginFormPassword" validationState={ null }>
          <Col xs={12} sm={4} md={3} lg={3} componentClass={ControlLabel}>
            <FormattedMessage id="LBL_USERNAME" defaultMessage="Username" />:
          </Col>
          <Col xs={12} sm={8} md={9} lg={9}>
            <FormControl type="text" maxLength={255} required disabled={disabled} />
            <FormControl.Feedback />
          </Col>
        </FormGroup>
        <FormGroup controlId="loginFormPassword" validationState={ null }>
          <Col xs={12} sm={4} md={3} lg={3} componentClass={ControlLabel}>
            <FormattedMessage id="LBL_PASSWORD" defaultMessage="Password" />:
          </Col>
          <Col xs={12} sm={8} md={9} lg={9}>
            <FormControl type="password" maxLength={255} required disabled={disabled} />
            <FormControl.Feedback />
          </Col>
        </FormGroup>
        <FormGroup controlId="loginFormPassword" validationState={ null }>
          <Col xs={12} sm={4} md={3} lg={3} componentClass={ControlLabel} />
          <Col xs={12} sm={8} md={9} lg={9}>
            <Checkbox checked={ true }>
              <FormattedMessage id="MDL_CONTROL_REQUIRES_PASSWORD" defaultMessage="always requires a password (recommended)" />
            </Checkbox>
          </Col>
        </FormGroup>
      </Form>
    );
  }

}