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
import { Link } from 'react-router';
import App from 'Core/App';
import Component from 'Core/Component';
import { Button, Col, Image } from 'react-bootstrap';
import { Server, ServerStatus } from 'Models/Server';
import IServerItemProps from 'IServerItemProps';
import { OutputMode } from 'OutputMode';

/**
 * Represents server info in table row.
 */
export default class ServerRow extends Component<IServerItemProps, any> {

  constructor(props, context) {
    super(props, context);
  }

  private GetServerImage(server: Server): string {
    let result = '';

    if (server.OS) {
      let name = '';
      let family = '';

      if (server.OS.Name != null) {
        name = server.OS.Name.toLowerCase();
      }

      if (server.OS.Family != null) {
        family = server.OS.Family.toLowerCase();
      }

      if (name.indexOf('debian') != -1) {
        result = 'debian.jpg';
      }
      else if (name.indexOf('ubuntu') != -1) {
        result = 'ubuntu.jpg';
      }
      else if (name.indexOf('freebsd') != -1) {
        result = 'freebsd.jpg';
      }
      else if (name.indexOf('redhat') != -1) {
        result = 'redhat.jpg';
      }
      else if (name.indexOf('centos') != -1) {
        result = 'centos.jpg';
      }
      else if (name.indexOf('windows') != -1) {
        if (name.indexOf('2008') != -1 && name.indexOf('r2') != -1) {
          result = 'windows2008r2.jpg';
        }
        else if (name.indexOf('2008') != -1 && name.indexOf('r2') == -1) {
          result = 'windows2008.jpg';
        }
        else if (name.indexOf('2012') != -1 && name.indexOf('r2') != -1) {
          result = 'windows2012r2.jpg';
        }
        else if (name.indexOf('2012') != -1 && name.indexOf('r2') == -1) {
          result = 'windows2012.jpg';
        }
        else if (name.indexOf('2016') != -1) {
          result = 'windows2016.jpg';
        }
        else {
          result = 'windows.jpg';
        }
      }
      else if (name.indexOf('osx') != -1 || name.indexOf('os x') != -1 || name.indexOf('mac') != -1) {
        result = 'osx.jpg';
      }

      if (result == '' && family != '') {
        if (family.indexOf('linux') != -1) {
          result = 'linux.jpg';
        }
        // TODO
        /*else if (family.indexOf('unix') != -1) {

        }
        else if (family.indexOf('windows') != -1 || family.indexOf('win32') != -1 || family.indexOf('winnt') != -1) {
        }*/
      }
    }

    if (result == '') {
      result = 'server.jpg';
    }

    return '/dist/images/' + result;
  }
  
  render() {
    let server = this.props.Server;

    if (this.props.OutputMode == OutputMode.Thumbnail || this.props.OutputMode == OutputMode.ThumbnailLarge) {
      let xs = 6, sm = 4, md = 3, lg = 3;

      if (this.props.OutputMode == OutputMode.ThumbnailLarge) {
        xs = 12, sm = 6, md = 4, lg = 4;
      }

      let serverName = null;

      if (server.Connection != null && server.Connection.Host != '') {
        serverName = (<h4>{server.Connection.Host}</h4>);
      }

      if (server.Name != null && server.Name != '' && (server.Connection == null || server.Name != server.Connection.Host)) {
        serverName = (<h4>{server.Name} <small>({server.Connection.Host}) </small></h4>);
      }

      if (serverName == null) {
        serverName = (<h4>{server.FileName}</h4>);
      }

      return (
        <Col xs={xs} sm={sm} md={md} lg={lg} className="server-item-wrapper">
          <Image src={ this.GetServerImage(server) } responsive />
          {serverName}
        </Col>
      );

    } else {

      let rowClass = '';

      if (server.Status & ServerStatus.Connected) {
        rowClass = 'success';
      }
      else if (server.Status & ServerStatus.Testing || server.Status & ServerStatus.Connecting) {
        rowClass = 'warning';
      }
      else if (server.Status & ServerStatus.ConnectionError) {
        rowClass = 'danger';
      }

      if (server.Disabled) {
        rowClass = 'text-muted';
      }

      let serverName = null;

      if (server.Connection != null && server.Connection.Host != '') {
        serverName = (<h4>{server.Connection.Host}</h4>);
      }

      if (server.Name != null && server.Name != '' && (server.Connection == null || server.Name != server.Connection.Host)) {
        serverName = (<h4>{server.Name} <small>({server.Connection.Host})</small></h4>);
      }

      if (serverName == null) {
        serverName = (<h4>{server.FileName}</h4>);
      }

      let serverDescription = null;

      if (server.Description != null && server.Description != '') {
        serverDescription = (<div><small>{server.Description}</small></div>);
      }

      let btnConnectClassName = 'col-xs-12 col-sm-12 col-md-12 col-lg-12';

      let btnConnectTitle = '';

      if (server.Disabled) {
        btnConnectTitle = __('Disabled');
        btnConnectClassName += ' btn-gray';
      } else {
        if (server.Status & ServerStatus.ConnectionError) {
          btnConnectTitle = __('Try again');
          btnConnectClassName += ' btn-danger';
        }
        else if (server.Status & ServerStatus.Connecting || server.Status & ServerStatus.Testing || server.FileName == App.CurrentUser.ManagedServerName) {
          btnConnectClassName += ' hidden';
        } else {
          btnConnectTitle = __('Connect');
          btnConnectClassName += ' btn-silver';
        }
      }

      // <?=($this->NoControl != 'TRUE' ? 'col-xs-8 col-sm-8 col-md-8 col-lg-8' : 'col-xs-10 col-sm-10 col-md-10 col-lg-10')?>

      let connectionStatus = null;

      if (server.Status & ServerStatus.ConnectionError) {
        connectionStatus = (<div><small className="red"><span className="glyphicon glyphicon-exclamation-sign"></span> { __('Unable to connect to the server.') }</small></div>);
      }

      return (
        <tr className={rowClass}>
          <td className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
            {serverName}
            {serverDescription}
            {connectionStatus}
          </td>
          <td className="col-xs-2 col-sm-2 col-md-2 col-lg-2 text-center">
            <Button bsSize="small" bsStyle={ null } className={btnConnectClassName} disabled={ server.Disabled || this.props.Disabled } onClick={ this.props.OnConnect.bind(this, server) }>
              {btnConnectTitle}
            </Button>
            
            <div className={ (server.Status & ServerStatus.Connected ? 'green' : 'hidden') }>{ __('Connected') }</div>
            <div className={ (server.Status & ServerStatus.Testing ? 'brown' : 'hidden') }>
              <span className="fa fa-spinner fa-pulse fa-fw"></span> { ' ' }
              { __('Testing...') }
            </div>
            <div className={ (server.Status & ServerStatus.Connecting ? 'brown' : 'hidden') }>
              <span className="fa fa-spinner fa-pulse fa-fw"></span> { ' ' }
              { __('Connecting...') }
            </div>
          </td>
        </tr>
      );

    }
  }

}