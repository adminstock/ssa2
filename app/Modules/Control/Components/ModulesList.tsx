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
  Checkbox,
  Table, Row, Col,
  Form, FormGroup, FormControl,
  ControlLabel,
  Alert
} from 'react-bootstrap';

import App from 'Core/App';
import Component from 'Core/Component';

import ProcessingIndicator from 'UI/ProcessingIndicator';

import Module from '../Models/Module';
import ModuleSettings from 'Models/ModuleSettings';

import IModulesListProps from 'IModulesListProps';
import IModulesListState from 'IModulesListState';

import ModuleInfo from 'ModuleInfo';
import ModuleSettingsEditor from 'ModuleSettingsEditor';

export default class ModulesList extends Component<IModulesListProps, IModulesListState> {

  /** Gets list of modules. */
  public get Items(): Array<ModuleSettings> {
    return this.state.Modules;
  }

  private ModuleSettingsEditor: ModuleSettingsEditor;

  constructor(props?, context?) {
    super(props, context);

    this.state = {
      Modules: this.props.Modules,
      LoadingModules: false,
      AllModules: null,
      SelectedModule: null,
      SelectedModuleSettings: null,
      ShowModuleInfo: false,
      ShowModuleSettings: false
    };
  }

  componentWillMount() {
    Debug.Call3('ModulesList.componentWillMount');

    if (this.state.AllModules == null) {
      this.LoadModules();
    }
  }

  componentWillReceiveProps(nextProps: IModulesListProps) {
    Debug.Call3('ModulesList.componentWillReceiveProps', nextProps);

    this.setState(nextProps);
  }

  private LoadModules(): void {
    Debug.Call3('ModulesList.LoadModules');

    this.setState({
      LoadingModules: true
    }, () => {

      this.props.OnLoading();

      App.MakeRequest<any, Array<Module>>('Control.GetModules').then((result) => {
        this.setState({ AllModules: result, LoadingModules: false }, () => this.props.OnLoaded());
      }).catch((error) => {
        this.setState({ LoadingModules: false }, () => {
          App.DefaultApiErrorHandler(error);
          this.props.OnLoaded();
        });
      });
    });
  }

  private ModuleInfoShow(module: Module): void {
    this.setState({
      ShowModuleInfo: true,
      SelectedModule: module
    });
  }

  private ModuleInfoHide(): void {
    this.setState({
      ShowModuleInfo: false
    });
  }

  private ModuleSettings_StatusChanged(moduleSettings: ModuleSettings): void {
    Debug.Call3('ModulesList.ModuleSettings_StatusChanged', moduleSettings);

    // get module index
    let index = this.state.Modules.findIndex((ms) => ms.Name == moduleSettings.Name);

    Debug.Level3('index', index);

    // update module in collection
    let updatedSettings = ReactUpdate(this.state.Modules[index], { Enabled: { $set: !moduleSettings.Enabled } });

    // update module in server
    this.setState(ReactUpdate(this.state, { Modules: { $splice: [[index, 1, updatedSettings]] } }), () => {
      Debug.Level3('updatedSettings', updatedSettings, this.state.Modules[index]);
    });
  }

  private ModuleSettingsShow(module: Module, serverSettings: any): void {
    Debug.Call3('ModuleSettingsShow', module, serverSettings);

    this.setState({
      ShowModuleSettings: true,
      SelectedModule: module,
      SelectedModuleSettings: serverSettings
    });
  }

  private ModuleSettingsEditor_OnHide(): void {
    this.setState({
      ShowModuleSettings: false
    });
  }

  private ModuleSettingsEditor_OnSave(): void {
    Debug.Call3('ModulesList.ModuleSettingsEditor_OnSave', this.ModuleSettingsEditor.Settings);

    let editor = this.ModuleSettingsEditor

    // get module index
    let index = this.state.Modules.findIndex((ms) => ms.Name == editor.Name);

    // update module in collection
    let updatedSettings = ReactUpdate(this.state.Modules[index], { Settings: { $set: editor.Settings } });

    // update module in server
    this.setState(ReactUpdate(this.state, { Modules: { $splice: [[index, 1, updatedSettings]] }, ShowModuleSettings: { $set: false }}));
  }

  render() {
    Debug.Render3('ModulesList');

    if (this.state.LoadingModules) {
      return (<ProcessingIndicator Text={ App.FormatMessage('LBL_LOADING', 'Loading...') } />);
    }

    if (this.state.AllModules == null) {
      return <Alert bsStyle="danger">No modules...</Alert>;
    }

    let disabled = this.props.Disabled || this.state.ShowModuleInfo || this.state.ShowModuleSettings;

    let allModules = [];

    if (this.state.AllModules != null) {

      let serverModules = this.state.Modules || new Array<ModuleSettings>();

      this.state.AllModules.forEach((m, i) => {
        let moduleSettings = serverModules.find((ms) => ms.Name == m.Name);

        if (moduleSettings == null) {
          // add default
          serverModules.push(new ModuleSettings(m.Name, true));
          moduleSettings = serverModules[serverModules.length - 1];
        }

        allModules.push(
          <tr key={ 'module-' + i }>
            <td className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
              <Checkbox
                disabled={ disabled }
                checked={ moduleSettings.Enabled }
                onChange={ this.ModuleSettings_StatusChanged.bind(this, moduleSettings) }
              >{ m.Title && m.Title != '' ? m.Title : m.Name }</Checkbox>
            </td>
            <td className="col-xs-1 col-sm-1 col-md-1 col-lg-1">
              <Button bsSize="small" onClick={ this.ModuleInfoShow.bind(this, m) }>
                <i className="glyphicon glyphicon-info-sign"></i>
              </Button>
            </td>
            <td className="col-xs-1 col-sm-1 col-md-1 col-lg-1">
              <Button bsSize="small" disabled={ disabled || !m.Settings } onClick={ this.ModuleSettingsShow.bind(this, m, moduleSettings.Settings) }>
                <i className="glyphicon glyphicon-cog"></i>
              </Button>
            </td>
          </tr>
        );
      });
    }

    return (
      <div>
        <Table>
          <tbody>
            { allModules }
          </tbody>
        </Table>

        <ModuleInfo Visible={ this.state.ShowModuleInfo } Module={ this.state.SelectedModule } OnHide={ this.ModuleInfoHide.bind(this) } />
        <ModuleSettingsEditor
          Visible={ this.state.ShowModuleSettings }
          Module={ this.state.SelectedModule }
          Settings={ this.state.SelectedModuleSettings }
          OnHide={ this.ModuleSettingsEditor_OnHide.bind(this) }
          OnSave={ this.ModuleSettingsEditor_OnSave.bind(this) }
          ref={ (ref) => this.ModuleSettingsEditor = ref }
        />
      </div>
    );
  }

}