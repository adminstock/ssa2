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
import { Modal, Button } from 'react-bootstrap';
import Component from 'Core/Component';
import ServersList from 'ServersList';
import { OutputMode } from 'OutputMode';
import IServersListDialogProps from 'IServersListDialogProps';

export default class ServersListDialog extends Component<IServersListDialogProps, any> {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    Debug.Render3('ServersListDialog', this.props);
    return (
      <Modal show={ this.props.Visible } onHide={ this.props.OnHide.bind(this) }>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4 className="modal-title">
              <i className="fa fa-server"></i>
              { ' ' }
              <FormattedMessage id="DLG_SERVERS" defaultMessage="Servers" />
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ServersList ShowControl={ false } OutputMode={ OutputMode.List } />
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="default" onClick={ this.props.OnHide.bind(this) }>
            <FormattedMessage id="BTN_CLOSE" defaultMessage="Close" />
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

}