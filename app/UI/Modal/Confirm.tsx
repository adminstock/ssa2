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
import IConfirmProps from 'IConfirmProps';
import IButton from 'IButton';

export default class Confirm extends React.Component<IConfirmProps, any> {

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
    const title = (this.props.Title || <FormattedMessage id="dlgTitleConfirm" defaultMessage="Confirm" />);

    const okButton: IButton = this.props.ButtonOk || {};
    const okButtonText = (okButton.Text || <FormattedMessage id="BTN_OK" defaultMessage="Ok" />);
    const okButtonBsStyle = (okButton.BsStyle || 'default');
    const okButtonBsSize = okButton.BsSize;
    const okButtonData = okButton.Data;
    let okButtonAttributes = okButton.Attributes;

    if (okButtonData) {
      okButtonAttributes = Object.assign({}, okButtonAttributes, [ ...this.GetData(okButtonData) ]);
    }

    const cancelButton: IButton = this.props.ButtonCancel || {};
    const cancelButtonText = (cancelButton.Text || <FormattedMessage id="BTN_CANCEL" defaultMessage="Cancel" />);
    const cancelButtonBsStyle = (cancelButton.BsStyle || 'default');
    const cancelButtonBsSize = cancelButton.BsSize;
    const cancelButtonData = cancelButton.Data;
    let cancelButtonAttributes = cancelButton.Attributes;

    if (cancelButtonData) {
      cancelButtonAttributes = Object.assign({}, cancelButtonData, [...this.GetData(cancelButtonData)]);
    }

    return (
      <Modal show={ this.props.Visible } onHide={ this.props.OnHide.bind(this, false) }>
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this.props.Text }
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle={ okButtonBsStyle }
            bsSize={ okButtonBsSize }
            onClick={ this.props.OnHide.bind(this, true) }
            { ...okButtonAttributes }
          >
            { okButtonText }
          </Button>
          <Button bsStyle={ cancelButtonBsStyle }
            bsSize={ cancelButtonBsSize }
            onClick={ this.props.OnHide.bind(this, false) }
            { ...cancelButtonAttributes }
          >
            { cancelButtonText }
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

}