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

import Typeahead from 'react-bootstrap-typeahead';

import App from 'Core/App';
import Component from 'Core/Component';

import { Server, ServerStatus } from 'Models/Server';
import { OperatingSystemFamily, OperatingSystem } from 'Models/OperatingSystem';

import IOperatingSystemFormProps from 'IOperatingSystemFormProps';
import IOperatingSystemFormState from 'IOperatingSystemFormState';

export default class OperatingSystemForm extends Component<IOperatingSystemFormProps, IOperatingSystemFormState> {

  /** Gets OS name. */
  public get Name(): string {
    return this.state.Name;
  }

  /** Gets OS family. */
  public get Family(): string {
    return this.state.Family;
  }

  /** Gets OS version. */
  public get Version(): string {
    return this.state.Version;
  }

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

  private Input_TextChanged(elementId: string, stateKey: string, value?: string): void {
    // Debug.Call3('Input_TextChanged', elementId, stateKey, value);

    if (value) {
      this.setState({ [stateKey]: value });
    } else {
      this.setState({ [stateKey]: (document.getElementById(elementId) as HTMLInputElement).value });
    }
  }

  private Family_OnClick(e: Event): void {
    this.setState({
      Family: $(e.target).data('family') || null
    });
  }

  render() {
    Debug.Render3('OperatingSystemForm');

    const disabled = this.props.Disabled;

    const family = (this.state.Family || '').toLocaleLowerCase();

    const inputProps = {
      placeholder: `Type 'c'`,
      value: '',
      onChange: () => { }
    };

    return (
      <Form horizontal>
        <FormGroup controlId="OperatingSystemForm_Family" validationState={ null }>
          <Col xs={12} sm={4} md={3} lg={3} componentClass={ControlLabel}>
            <FormattedMessage id="LBL_FAMILY" defaultMessage="Family" />:
          </Col>
          <Col xs={12} sm={8} md={9} lg={9}>
            <ButtonToolbar>
              <ButtonGroup onClick={ this.Family_OnClick.bind(this) }>
                <Button disabled={ disabled } active={ !OperatingSystemFamily.IsKnownFamily(family) }><FormattedMessage id="MDL_CONTROL_UNKNOWN" defaultMessage="Unknown" /></Button>
                <Button disabled={ disabled } active={ family == 'unix' } data-family={ OperatingSystemFamily.FAMILY_UNIX }>Unix</Button>
                <Button disabled={ disabled } active={ family == 'linux' } data-family={ OperatingSystemFamily.FAMILY_LINUX }>Linux</Button>
                <Button disabled={ disabled } active={ family == 'bsd' } data-family={ OperatingSystemFamily.FAMILY_BSD }>BSD</Button>
                <Button disabled={ disabled } active={ family == 'windows' } data-family={ OperatingSystemFamily.FAMILY_WINDOWS }>Windows</Button>
              </ButtonGroup>
            </ButtonToolbar>
          </Col>
        </FormGroup>
        <FormGroup controlId="OperatingSystemForm_Name" validationState={ null }>
          <Col xs={12} sm={4} md={3} lg={3} componentClass={ControlLabel}>
            <FormattedMessage id="LBL_NAME" defaultMessage="Name" />:
          </Col>
          <Col xs={12} sm={8} md={9} lg={9}>
            <Typeahead
              name="OperatingSystemForm_Name"
              options={ OperatingSystemFamily.GetSupporedOSNames(this.state.Family) }
              selected={ [this.state.Name] }
              onInputChange={ (value) => { this.Input_TextChanged.apply(this, ['OperatingSystemForm_Name', 'Name', value]); } }
            />
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