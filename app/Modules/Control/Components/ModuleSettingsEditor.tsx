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
  Button, ButtonToolbar, ButtonGroup,
  Row, Col,
  ControlLabel,
  Panel,
  Tabs, Tab,
  Form, FormGroup, FormControl,
  Checkbox
} from 'react-bootstrap';

import Typeahead from 'react-bootstrap-typeahead';

import App from 'Core/App';
import Component from 'Core/Component';

import Module from '../Models/Module';
import ModuleSettingsElement from '../Models/ModuleSettingsElement'

import IModuleSettingsEditorState from 'IModuleSettingsEditorState';
import IModuleSettingsEditorProps from 'IModuleSettingsEditorProps';

export default class ModuleSettingsEditor extends Component<IModuleSettingsEditorProps, IModuleSettingsEditorState> {

  /** Gets settings. */
  public get Settings(): any {
    return this.state.Settings;
  }

  /** Gets name of the module. */
  public get Name(): string {
    return this.state.Module.Name;
  }

  constructor(props?, context?) {
    super(props, context);

    this.state = {
      Visible: this.props.Visible,
      Module: this.props.Module,
      Settings: this.props.Settings,
      ActiveTab: null,
      Validators: {},
      Focus: null
    };
  }

  componentWillReceiveProps(nextProps: any) {
    Debug.Call3('ModuleSettingsEditor.componentWillReceiveProps', nextProps);

    this.setState(nextProps);
  }

  componentDidUpdate() {
    Debug.Call3('ModuleSettingsEditor.componentDidUpdate', this.state.Focus);

    if (this.state.Focus != null) {
      // TODO: find the best solution
      window.setTimeout(() => $(this.state.Focus).focus(), 500);
    }
  }

  private OnHide(): void {
    this.props.OnHide();
  }

  private OnSave(): void {
    let isValid = true;
    let validators = {};
    let activeTab = null;
    let focus = null;

    $('form', '#moduleSettingsEditor').each((i, form) => {
      $('input', form).each((i, input: HTMLInputElement) => {
        if (!input.checkValidity()) {
          Object.assign(validators, { [$(input).data('name')]: 'error' });

          if (isValid) {
            focus = input;

            if ($(input).parents('.tab-pane').length > 0) {
              activeTab = $(input).parents('.tab-pane').attr('data-name');
            }

            isValid = false;
          }
        }
      });
    });

    if (isValid) {
      this.setState({ Validators: null, ActiveTab: null, Focus: null });
      this.props.OnSave();
    } else {
      //Debug.Log('OnSave', validators, activeTab);
      this.setState({ Validators: validators, ActiveTab: activeTab, Focus: focus });
    }
  }

  private Tabs_OnSelect(key: string): void {
    this.setState({ ActiveTab: key });
  }

  private Input_OnChange(name: string, value: string): void {
    //Debug.Call3('Input_OnChange', name, value);

    let newState = ReactUpdate(this.state, { Settings: { [name]: { $set: value } } });

    this.setState(newState);
  }

  private Input_CheckChanged(name: string, value: boolean): void {
    //Debug.Call3('Input_CheckChanged', name, value);

    let newState = ReactUpdate(this.state, { Settings: { [name]: { $set: value } } });

    this.setState(newState);
  }
  
  private MakeElement(element: ModuleSettingsElement, elementKey: string): JSX.Element {
    //Debug.Call3('MakeElement', element, this.state.Settings[element.Name]);
    
    let value = '';
    
    if (this.state.Settings && typeof this.state.Settings[element.Name] !== 'undefined') {
      value = this.state.Settings[element.Name];
    }

    let elementOutput = null;
    let items: Array<JSX.Element> = null;

    switch ((element.Type || '').toLowerCase()) {
      case 'text':
        if (element.Data === undefined || element.Data == null || element.Data.length <= 0) {
          elementOutput = (
            <FormControl
              type="text"
              key={ elementKey }
              data-name={ element.Name }
              value={ value.toString() }
              onChange={ (e) => this.Input_OnChange.apply(this, [element.Name, (e.target as HTMLInputElement).value]) }
              { ...element.Attributes }
            />);
        } else {
          elementOutput = (
            <Typeahead
              key={ elementKey }
              name={ elementKey }
              data-name={ element.Name }
              options={ element.Data }
              selected={ [value.toString()] }
              onInputChange={ (value) => { this.Input_OnChange.apply(this, [element.Name, value]); } }
              { ...element.Attributes }
            />);
        }
        break;

      case 'textarea':
        elementOutput = (
          <FormControl
            key={ elementKey }
            data-name={ element.Name }
            componentClass="textarea"
            value={ value.toString() }
            onChange={ (e) => this.Input_OnChange.apply(this, [element.Name, (e.target as HTMLInputElement).value]) }
            { ...element.Attributes || { rows: 5 } }
          />);
        break;

      case 'dropdownlist':
      case 'dropdown':
      case 'combobox':
      case 'select':
      case 'list':
        items = new Array<JSX.Element>();

        element.Data.forEach((option, optionIndex) => {
          let optionValue = option;
          let optionTitle = option;

          if (element.DataDisplayField && element.DataDisplayField != '') {
            optionTitle = option[element.DataDisplayField] || option;
          }

          if (element.DataValueField && element.DataValueField != '') {
            optionValue = option[element.DataValueField] || option;
          }

          items.push(
            <option
              key={ elementKey + '_option_' + optionIndex }
              value={ optionValue.toString() }
            >
              { optionTitle }
            </option>);
          // selected={ optionValue.toString() == value.toString() }
        });

        elementOutput = (
          <FormControl
            key={ elementKey }
            data-name={ element.Name }
            componentClass="select"
            { ...element.Attributes || (element.Type.toLowerCase() == 'list' ? { size: 5 } : null) }
            onChange={ (e) => this.Input_OnChange.apply(this, [element.Name, (e.target as HTMLInputElement).value]) }
            defaultValue={ value.toString() }
          >
            { items }
          </FormControl>);
        break;

      case 'checkbox':
        elementOutput = (
          <Checkbox
            key={ elementKey }
            data-name={ element.Name }
            checked={ value }
            onChange={ (e) => this.Input_CheckChanged.apply(this, [element.Name, (e.target as HTMLInputElement).checked]) }
            { ...element.Attributes }
          />);
        break;

      case 'radio':
        items = new Array<JSX.Element>();

        element.Data.forEach((option, optionIndex) => {
          let optionValue = option;
          let optionTitle = option;

          if (element.DataDisplayField && element.DataDisplayField != '') {
            optionTitle = option[element.DataDisplayField] || option;
          }

          if (element.DataValueField && element.DataValueField != '') {
            optionValue = option[element.DataValueField] || option;
          }

          items.push(
            <Button
              key={ elementKey + '_radio_' + optionIndex }
              active={ optionValue.toString() == value.toString() }
              data-value={ optionValue.toString() }
            >
              { optionTitle }
            </Button>);
        });

        elementOutput = (
          <ButtonToolbar key={ elementKey }>
            <ButtonGroup onClick={ (e) => this.Input_OnChange.apply(this, [element.Name, $(e.target).data('value')]) } { ...element.Attributes }>
              { items }
            </ButtonGroup>
          </ButtonToolbar>);
        break;

      default:
        elementOutput = (<div key={ elementKey } className="form-control-static red">Unsupported type: <strong>{ element.Type }</strong></div>);
        break;
    }

    return (
      <FormGroup key={ elementKey + '_group' } controlId="todo" validationState={ this.state.Validators[element.Name] || null }>
        <Col xs={12} sm={4} md={3} lg={3} componentClass={ControlLabel}>
          <FormattedMessage id={ element.Title || element.Name } defaultMessage={ element.Title || element.Name } />:
        </Col>
        <Col xs={12} sm={8} md={9} lg={9}>
          { elementOutput }
        </Col>
      </FormGroup>  
    );
  }

  render() {
    Debug.Render3('ModuleSettingsEditor', this.state.Visible);

    if (!this.state.Visible && this.state.Module == null) {
      return null;
    }

    let tabs = null;
    let activeTab = this.state.ActiveTab;

    if (this.state.Module.Settings && this.state.Module.Settings.length > 0) {
      tabs = new Array<JSX.Element>();

      this.state.Module.Settings.forEach((tab, tabIndex) => {
        let tabKey = 'mod_sttgs_tab_' + tabIndex;
        let tabContent = new Array<JSX.Element>();

        tab.Sections.forEach((section, sectionIndex) => {
          let sectionKey = tabKey + '_section_' + sectionIndex;
          let sectionContent = new Array<JSX.Element>();

          section.Elements.forEach((element, elementIndex) => {
            let elementKey = sectionKey + '_element_' + elementIndex;

            sectionContent.push(this.MakeElement(element, elementKey));
          });

          tabContent.push(
            <fieldset key={sectionKey} className="module-settings-section">
              {(() => {
                if (tab.Sections.length > 1) {
                  return <legend><FormattedMessage id={ section.Title } defaultMessage={ section.Title } /></legend>;
                }
              })()}
              <Form horizontal>
                { sectionContent }
              </Form>
            </fieldset>
          );
        });

        tabs.push(<Tab key={ tabKey } eventKey={ tab.Title } title={ App.FormatMessage(tab.Title, tab.Title) } data-name={ tab.Title }>{ tabContent }</Tab>);

        if (!activeTab) {
          activeTab = tab.Title;
        }
      });
    }
    
    return (
      <Modal id="moduleSettingsEditor" backdrop="static" show={ this.state.Visible } onHide={ this.OnHide.bind(this) }>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="glyphicon glyphicon-cog"></i> { ' ' }
            <FormattedMessage id="LBL_SETTINGS" defaultMessage="Settings" />: { ' ' }
            { this.state.Module.Title && this.state.Module.Title != '' ? this.state.Module.Title : this.state.Module.Name }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(() => {
            if (tabs.length > 1) {
              return (
                <Tabs id="module-settings" activeKey={ activeTab } onSelect={ this.Tabs_OnSelect.bind(this) }>
                  { tabs }
                </Tabs>
              );
            } else {
              return <div>{ tabs[0] }</div>;
            }
          })()}
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={ this.OnSave.bind(this) }>
            <FormattedMessage id="BTN_APPLY" defaultMessage="Apply" />
          </Button>
          <Button bsStyle="default" onClick={ this.OnHide.bind(this) }>
            <FormattedMessage id="BTN_CANCEL" defaultMessage="Cancel" />
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

}