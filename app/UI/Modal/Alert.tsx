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
import { Modal, Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import IAlertProps from 'IAlertProps';
import IButton from 'IButton';

export default class Alert extends React.Component<IAlertProps, any> {

  constructor(props, context) {
    super(props, context);
  }

  private GetData(value: any): Array<any> {
    let result = [];

    Object.keys(value).map((key, index) => {
      result.push({ ['data-' + key]: value[key] });
    });

    return result;
  }

  render() {
    const title = (this.props.Title || <FormattedMessage id="dlgTitleMessage" defaultMessage="Message" />);

    const button: IButton = this.props.ButtonOk || {};
    const buttonText = (button.Text || <FormattedMessage id="BTN_OK" defaultMessage="Ok" />);
    const buttonBsStyle = (button.BsStyle || 'default');
    const buttonBsSize = button.BsSize;
    const buttonData = button.Data;
    let buttonAttributes = button.Attributes;

    if (buttonData) {
      buttonAttributes = Object.assign({}, buttonAttributes, [...this.GetData(buttonData)]);
    }

    return (
      <Modal show={ this.props.Visible } onHide={ this.props.OnHide.bind(this) }>
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this.props.Text }
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle={ buttonBsStyle }
            bsSize={ buttonBsSize }
            onClick={ this.props.OnHide.bind(this) }
            { ...buttonAttributes }
          >
            { buttonText }
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

}