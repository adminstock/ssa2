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
  Button, ButtonToolbar, ButtonGroup, 
  Row, Col,
  Form, FormGroup, FormControl,
  ControlLabel,
} from 'react-bootstrap';

import App from 'Core/App';
import Component from 'Core/Component';

import { Server, ServerStatus } from 'Models/Server';
import OperatingSystem from 'Models/OperatingSystem';

import IOperatingSystemFormProps from 'IOperatingSystemFormProps';
import IOperatingSystemFormState from 'IOperatingSystemFormState';

export default class OperatingSystemForm extends Component<IOperatingSystemFormProps, IOperatingSystemFormState> {

  constructor(props?, context?) {
    super(props, context);

    this.state = {
      Name: this.props.Name,
      Family: this.props.Family,
      Version: this.props.Version
    };
  }

  componentWillReceiveProps(nextProps: IOperatingSystemFormProps) {
    Debug.Call3('OperatingSystemForm.componentWillReceiveProps', nextProps);

    this.setState(nextProps);
  }

  private Input_TextChanged(elementId: string, stateKey: string): void {
    this.setState({ [stateKey]: (document.getElementById(elementId) as HTMLInputElement).value });
  }

  render() {
    Debug.Render3('OperatingSystemForm');

    let disabled = false;

    let family = (this.state.Family || '').toLocaleLowerCase();
    
    return (
      <Form horizontal>
        <FormGroup controlId="OperatingSystemForm_Name" validationState={ null }>
          <Col xs={12} sm={4} md={3} lg={3} componentClass={ControlLabel}>
            <FormattedMessage id="LBL_NAME" defaultMessage="Name" />:
          </Col>
          <Col xs={12} sm={8} md={9} lg={9}>
            <FormControl
              type="text"
              maxLength={ 50 }
              disabled={ disabled }
              value={ this.state.Name }
              onChange={ this.Input_TextChanged.bind(this, 'OperatingSystemForm_Name', 'Name') }
            />
          </Col>
        </FormGroup>
        <FormGroup controlId="OperatingSystemForm_Family" validationState={ null }>
          <Col xs={12} sm={4} md={3} lg={3} componentClass={ControlLabel}>
            <FormattedMessage id="LBL_FAMILY" defaultMessage="Family" />:
          </Col>
          <Col xs={12} sm={8} md={9} lg={9}>
            <ButtonToolbar>
              <ButtonGroup>
                <Button active={ true }><FormattedMessage id="MDL_CONTROL_UNKNOWN" defaultMessage="Unknown" /></Button>
                <Button active={ family == 'unix' }>Unix</Button>
                <Button active={ family == 'linux' }>Linux</Button>
                <Button active={ family == 'bsd' }>BSD</Button>
                <Button active={ family == 'windows' }>Windows</Button>
              </ButtonGroup>
            </ButtonToolbar>
          </Col>
        </FormGroup>
        <FormGroup controlId="OperatingSystemForm_Version" validationState={ null }>
          <Col xs={12} sm={4} md={3} lg={3} componentClass={ControlLabel}>
            <FormattedMessage id="LBL_VERSION" defaultMessage="Version" />:
          </Col>
          <Col xs={12} sm={8} md={9} lg={9}>
            <FormControl
              type="text"
              maxLength={ 25 }
              disabled={ disabled }
              value={ this.state.Version }
              onChange={ this.Input_TextChanged.bind(this, 'OperatingSystemForm_Version', 'Version') }
            />
          </Col>
        </FormGroup>
      </Form>
    );
  }

}