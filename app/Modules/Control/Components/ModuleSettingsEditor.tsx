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
  Panel,
  Tabs, Tab,
  Form, FormGroup, FormControl
} from 'react-bootstrap';

import Typeahead from 'react-bootstrap-typeahead';

import App from 'Core/App';
import Component from 'Core/Component';

import Module from '../Models/Module';
import ModuleSettingsElement from '../Models/ModuleSettingsElement'

import IModuleSettingsEditorState from 'IModuleSettingsEditorState';
import IModuleSettingsEditorProps from 'IModuleSettingsEditorProps';

export default class ModuleSettingsEditor extends Component<IModuleSettingsEditorProps, IModuleSettingsEditorState> {

  constructor(props?, context?) {
    super(props, context);

    this.state = {
      Visible: this.props.Visible,
      Module: this.props.Module,
      Settings: this.props.Settings,
    };
  }

  componentWillReceiveProps(nextProps: any) {
    Debug.Call3('ModuleSettingsEditor.componentWillReceiveProps', nextProps);

    this.setState(nextProps);
  }

  private OnHide(): void {
    //this.props.OnHide();
  }

  private MakeElement(element: ModuleSettingsElement): JSX.Element {
    Debug.Call3('MakeElement', element, this.state.Settings[element.Name]);
    let value = '';
    
    if (this.state.Settings && typeof this.state.Settings[element.Name] !== 'undefined') {
      value = this.state.Settings[element.Name];
    }

    let elementOutput = null;

    switch ((element.Type || '').toLowerCase()) {
      case 'text':
        if (element.Data === undefined || element.Data == null || element.Data.length <= 0) {
          elementOutput = <FormControl type="text" value={ value } { ...element.Attributes } />;
        } else {
          // onInputChange={ (value) => Debug.Log(value) }
          elementOutput = (
            <Typeahead
              name="elementttt"
              options={ element.Data }
              selected={ [value.toString()] }
              { ...element.Attributes }
            />);
        }
        break;

      case 'textarea':
        elementOutput = <FormControl componentClass="textarea" value={ value } { ...element.Attributes || { rows: 5 } } />;
        break;

      case 'dropdownlist':
      case 'dropdown':
      case 'combobox':
      case 'select':
        let items = new Array<JSX.Element>();

        element.Data.forEach((option, optionIndex) => {
          let optionValue = option;
          let optionTitle = option;

          if (element.DataDisplayField && element.DataDisplayField != '') {
            optionTitle = option[element.DataDisplayField] || option;
          }

          if (element.DataValueField && element.DataValueField != '') {
            optionValue = option[element.DataValueField] || option;
          }

          items.push(<option key={ 'option_' + optionIndex } value={ optionValue }>{ optionTitle }</option>);
        });

        elementOutput = <FormControl componentClass="select" { ...element.Attributes }>{ items }</FormControl>;
        break;

      case 'list':
      case 'checkbox':
      case 'radio':

      default:
        elementOutput = (<div className="red">Unsupported type: <strong>{ element.Type }</strong></div>);
        break;
    }

    return (
      <FormGroup controlId="todo" validationState={ null }>
        <Col xs={12} sm={4} md={3} lg={3} componentClass={ControlLabel}>
          <FormattedMessage id={ element.Name } defaultMessage={ element.Name } />:
        </Col>
        <Col xs={12} sm={8} md={9} lg={9}>
          { elementOutput }
        </Col>
      </FormGroup>  
    );
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
        let tabContent = new Array<JSX.Element>();

        tab.Sections.forEach((section, sectionIndex) => {

          let sectionContent = new Array<JSX.Element>();

          section.Elements.forEach((element, elementIndex) => {
            sectionContent.push(this.MakeElement(element));
          });

          tabContent.push(<section><h4>{ section.Name }</h4><Form horizontal>{ sectionContent }</Form></section>);
        });

        form.push(<Tab key={'mod_sttgs_tab_' + tabIndex} eventKey={tab.Name} title={tab.Name}>{tabContent}</Tab>);
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
          <Tabs id="module-settings">
            {form}
          </Tabs>
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