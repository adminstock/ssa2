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
  Button,
  Row, Col,
  ControlLabel,
} from 'react-bootstrap';

import App from 'Core/App';
import Component from 'Core/Component';

import Module from 'Modules/Control/Models/Module';

import IModuleSettingsEditorState from 'IModuleSettingsEditorState';

export default class ModuleSettingsEditor extends Component<any, IModuleSettingsEditorState> {

  constructor(props?, context?) {
    super(props, context);

    this.state = {
      Visible: this.props.Visible,
      Module: this.props.Module
    };
  }

  componentWillReceiveProps(nextProps: any) {
    Debug.Call3('ModuleSettingsEditor.componentWillReceiveProps', nextProps);

    this.setState(nextProps);
  }

  private OnHide(): void {
    this.props.OnHide();
  }

  render() {
    Debug.Render3('ModuleSettingsEditor');

    if (!this.state.Visible && this.state.Module == null) {
      return null;
    }

    let form = null;

    if (this.state.Module.Settings && this.state.Module.Settings.length > 0) {
      form = new Array<JSX.Element>();

      this.state.Module.Settings.forEach((tab, tabIndex) => {
        form.push(<div>{tab.Name}</div>);  
      });
    }

    return (
      <Modal show={ this.state.Visible } onHide={ this.OnHide.bind(this) }>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="glyphicon glyphicon-cog"></i> { ' ' }
            <FormattedMessage id="LBL_SETTINGS" defaultMessage="Settings" />: { ' ' }
            { this.state.Module.Title && this.state.Module.Title != '' ? this.state.Module.Title : this.state.Module.Name }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {form}
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="default" onClick={ this.OnHide.bind(this) }>
            <FormattedMessage id="BTN_SAVE" defaultMessage="Save" />
          </Button>
          <Button bsStyle="default" onClick={ this.OnHide.bind(this) }>
            <FormattedMessage id="BTN_CANCEL" defaultMessage="Cancel" />
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

}