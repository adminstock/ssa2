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

import ConnectionSettings from 'Models/ConnectionSettings';

import IConnectionSettingsFormProps from 'IConnectionSettingsFormProps';
import IConnectionSettingsFormState from 'IConnectionSettingsFormState';

export default class ConnectionSettingsForm extends Component<IConnectionSettingsFormProps, IConnectionSettingsFormState> {

  /** Gets connections settings. */
  public get Data(): ConnectionSettings {
    return this.state.ConnectionSettings;
  }

  constructor(props?, context?) {
    super(props, context);

    this.state = {
      ConnectionSettings: this.props.ConnectionSettings,
      Validation: {}
    };
  }

  componentWillReceiveProps(nextProps: IConnectionSettingsFormProps) {
    Debug.Call3('ConnectionSettingsForm.componentWillReceiveProps', nextProps);

    this.setState(nextProps);
  }

  // componentDidMount
  // componentDidUpdate() {
  // }

  private RequiredPassword_Changed(e: Event): void {
    let newState = ReactUpdate(this.state, { ConnectionSettings: { RequiredPassword: { $set: (e.target as HTMLInputElement).checked } } });

    //Debug.Log('newState', newState);

    this.setState(newState);
  }

  private Input_TextChanged(elementId: string, stateKey: string): void {
    let value = (document.getElementById(elementId) as HTMLInputElement).value;
    let newState = ReactUpdate(this.state, { ConnectionSettings: { [stateKey]: { $set: value } } });

    //Debug.Log('newState', newState);

    this.setState(newState);
  }

  public IsValid(): boolean {
    let isValid = true;
    let validation = {};

    $('input', '#ConnectionSettings_Form').each((i, input: HTMLInputElement) => {
      if (!input.checkValidity()) {
        Object.assign(validation, { [$(input).attr('id')]: 'error' });

        if (isValid) {
          $(input).focus();
          isValid = false;
        }
      }
    });

    if (isValid) {
      this.setState({ Validation: {} });
    } else {
      this.setState({ Validation: validation });
    }

    return isValid;
  }

  render() {
    Debug.Render3('ConnectionSettings');

    let connectionSettings = this.state.ConnectionSettings || new ConnectionSettings();
        
    let disabled = this.props.Disabled;

    return (
      <Form id="ConnectionSettings_Form" horizontal>
        <FormGroup controlId="ConnectionSettings_Host" validationState={ this.state.Validation['ConnectionSettings_Host'] }>
          <Col xs={12} sm={4} md={3} lg={3} componentClass={ControlLabel}>
            <FormattedMessage id="LBL_HOST" defaultMessage="Host" />:
          </Col>
          <Col xs={12} sm={8} md={9} lg={9}>
            <FormControl
              type="text"
              maxLength={100}
              required
              disabled={ disabled }
              value={ connectionSettings.Host }
              onChange={ this.Input_TextChanged.bind(this, 'ConnectionSettings_Host', 'Host') }
            />
            <FormControl.Feedback />
          </Col>
        </FormGroup>
        <FormGroup controlId="ConnectionSettings_Port" validationState={ this.state.Validation['ConnectionSettings_Port'] }>
          <Col xs={12} sm={4} md={3} lg={3} componentClass={ControlLabel}>
            <FormattedMessage id="LBL_PORT" defaultMessage="Port" />:
          </Col>
          <Col xs={12} sm={6} md={5} lg={3}>
            <FormControl
              type="number"
              maxLength={4}
              min={0}
              max={65535}
              required
              disabled={ disabled }
              value={ connectionSettings.Port }
              onChange={ this.Input_TextChanged.bind(this, 'ConnectionSettings_Port', 'Port') }
            />
            <FormControl.Feedback />
          </Col>
        </FormGroup>
        <FormGroup controlId="ConnectionSettings_User" validationState={ this.state.Validation['ConnectionSettings_User'] }>
          <Col xs={12} sm={4} md={3} lg={3} componentClass={ControlLabel}>
            <FormattedMessage id="LBL_USERNAME" defaultMessage="Username" />:
          </Col>
          <Col xs={12} sm={8} md={9} lg={9}>
            <FormControl
              type="text"
              maxLength={255}
              required
              disabled={ disabled }
              value={ connectionSettings.User }
              onChange={ this.Input_TextChanged.bind(this, 'ConnectionSettings_User', 'User') }
            />
            <FormControl.Feedback />
          </Col>
        </FormGroup>
        <FormGroup controlId="ConnectionSettings_Password">
          <Col xs={12} sm={4} md={3} lg={3} componentClass={ControlLabel}>
            <FormattedMessage id="LBL_PASSWORD" defaultMessage="Password" />:
          </Col>
          <Col xs={12} sm={8} md={9} lg={9}>
            <FormControl
              type="password"
              maxLength={ 255 }
              disabled={ disabled }
              value={ connectionSettings.Password }
              onChange={ this.Input_TextChanged.bind(this, 'ConnectionSettings_Password', 'Password') }
            />
            <FormControl.Feedback />
          </Col>
        </FormGroup>
        <FormGroup controlId="ConnectionSettings_RequiredPassword">
          <Col xs={12} sm={4} md={3} lg={3} componentClass={ControlLabel} />
          <Col xs={12} sm={8} md={9} lg={9}>
            <Checkbox disabled={ disabled } checked={ connectionSettings.RequiredPassword } onChange={ this.RequiredPassword_Changed.bind(this) }>
              <FormattedMessage id="MDL_CONTROL_REQUIRES_PASSWORD" defaultMessage="always requires a password (recommended)" />
            </Checkbox>
          </Col>
        </FormGroup>
      </Form>
    );
  }

}