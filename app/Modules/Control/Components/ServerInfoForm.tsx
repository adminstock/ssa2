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

import IServerInfoFormProps from 'IServerInfoFormProps';
import IServerInfoFormState from 'IServerInfoFormState';

export default class ServerInfoForm extends Component<IServerInfoFormProps, IServerInfoFormState> {

  /** Gets server name. */
  public get Name(): string {
    return this.state.ServerName;
  }

  /** Gets server description. */
  public get Description(): string {
    return this.state.ServerDescription;
  }

  constructor(props?, context?) {
    super(props, context);

    this.state = {
      ServerName: this.props.ServerName,
      ServerDescription: this.props.ServerDescription
    };
  }

  componentWillReceiveProps(nextProps: IServerInfoFormProps) {
    Debug.Call3('ServerInfoForm.componentWillReceiveProps', nextProps);

    this.setState(nextProps);
  }

  private Input_TextChanged(elementId: string, stateKey: string): void {
    let value = (document.getElementById(elementId) as HTMLInputElement).value;
    let newState = ReactUpdate(this.state, { [stateKey]: { $set: value } } );

    this.setState(newState);
  }

  render() {
    Debug.Render3('ServerInfoForm');

    let disabled = this.props.Disabled;

    return (
      <Form horizontal>
        <FormGroup controlId="ServerInfo_Name" validationState={ null }>
          <Col xs={12} sm={4} md={3} lg={3} componentClass={ControlLabel}>
            <FormattedMessage id="LBL_NAME" defaultMessage="Name" />:
          </Col>
          <Col xs={12} sm={8} md={9} lg={9}>
            <FormControl
              type="text"
              maxLength={ 50 }
              disabled={ disabled }
              value={ this.state.ServerName }
              onChange={ this.Input_TextChanged.bind(this, 'ServerInfo_Name', 'ServerName') }
            />
          </Col>
        </FormGroup>
        <FormGroup controlId="ServerInfo_Description" validationState={ null }>
          <Col xs={12} sm={4} md={3} lg={3} componentClass={ControlLabel}>
            <FormattedMessage id="LBL_DESCRIPTION" defaultMessage="Description" />:
          </Col>
          <Col xs={12} sm={8} md={9} lg={9}>
            <FormControl
              componentClass="textarea"
              rows={ 5 }
              disabled={ disabled }
              value={ this.state.ServerDescription }
              onChange={ this.Input_TextChanged.bind(this, 'ServerInfo_Description', 'ServerDescription') }
            />
          </Col>
        </FormGroup>
      </Form>
    );
  }

}