﻿/*
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
import { ButtonToolbar, ButtonGroup, Button, Col, Image, Alert } from 'react-bootstrap';
import { Server, ServerStatus } from 'Models/Server';
import { OperatingSystemFamily } from 'Models/OperatingSystem';
import IServerItemProps from 'IServerItemProps';
import { OutputMode } from 'OutputMode';

/**
 * Represents server info in table row.
 */
export default class ServerRow extends Component<IServerItemProps, any> {

  constructor(props, context) {
    super(props, context);
  }
  
  render() {
    let server = this.props.Server;

    if (this.props.OutputMode == OutputMode.Thumbnail || this.props.OutputMode == OutputMode.ThumbnailLarge) {
      let xs = 6, sm = 4, md = 3, lg = 3;

      if (this.props.OutputMode == OutputMode.ThumbnailLarge) {
        xs = 12, sm = 6, md = 4, lg = 4;
      }

      let disabled = (
        server.Disabled || this.props.Disabled ||
        ((server.Status & ServerStatus.Connected) == ServerStatus.Connected) ||
        ((server.Status & ServerStatus.Connecting) == ServerStatus.Connecting) ||
        ((server.Status & ServerStatus.Testing) == ServerStatus.Testing)
      );

      let serverName = null, serverNameClass = 'server-item-title';
      let serverNameIcon = null;
      let btnConnectClassName = '';
      let btnConnectTitle = '';

      let errorMessage = null;

      // connection button
      if (server.Disabled) {
        btnConnectTitle = 'Disabled';
        btnConnectClassName += ' btn-default';
        serverNameIcon = (<i className="glyphicon glyphicon-ban-circle"></i>);
      } else {
        if (server.Status & ServerStatus.ConnectionError) {
          btnConnectTitle = 'Connect'; // __('Try again');
          btnConnectClassName += ' btn-default';
          serverNameIcon = (<i className="glyphicon glyphicon-exclamation-sign"></i>);
          serverNameClass += ' red';

          if (server.StatusMessage && server.StatusMessage != '') {
            errorMessage = (<Alert bsStyle="danger">{ server.StatusMessage }</Alert>);
          }
          else {
            errorMessage = (<Alert bsStyle="danger">{ 'Unable to connect to the server.' }</Alert>);
          }
        }
        else if (server.Status & ServerStatus.Connecting || server.Status & ServerStatus.Testing) {
          btnConnectClassName += ' btn-warning';
          btnConnectTitle = (server.Status & ServerStatus.Connecting ? 'Connecting...' : 'Testing...');
          serverNameIcon = (<i className="fa fa-spinner fa-pulse fa-fw"></i>);
          serverNameClass += ' brown';
        }
        else if (server.Status & ServerStatus.Connected) {
          btnConnectClassName += ' btn-success';
          btnConnectTitle = 'Connected';
          serverNameIcon = (<i className="glyphicon glyphicon-ok-sign"></i>);
          serverNameClass += ' green';
        }
        else {
          btnConnectTitle = 'Connect';
          btnConnectClassName += ' btn-default';
        }
      }

      // server name
      if (server.Connection != null && server.Connection.Host != '') {
        serverName = (<div className={serverNameClass}>{serverNameIcon} {server.Connection.Host}</div>);
      }

      if (server.Name != null && server.Name != '' && (server.Connection == null || server.Name != server.Connection.Host)) {
        serverName = (<div className={serverNameClass}>{serverNameIcon} {server.Name}<br /><small>({server.Connection.Host})</small></div>);
      }

      if (serverName == null) {
        serverName = (<div className={serverNameClass}>{serverNameIcon} {server.FileName}</div>);
      }

      // edit and delete buttons
      let editControl = null, deleteControl = null;

      if (this.props.ShowControl) {
        let controlTitleHidden = 'hidden-xs hidden-sm hidden-md';

        if (this.props.OutputMode == OutputMode.Thumbnail) {
          controlTitleHidden = 'hidden';
        }

        editControl = (<Button bsSize="small" bsStyle="primary" disabled={ this.props.Disabled } onClick={ this.props.OnEdit.bind(this, server) }><i className="glyphicon glyphicon-edit"></i><span className={controlTitleHidden}> { 'Edit' }</span></Button>);
        deleteControl = (<Button bsSize="small" bsStyle="danger" disabled={ this.props.Disabled } onClick={ this.props.OnDelete.bind(this, server) }><i className="glyphicon glyphicon-trash"></i><span className={controlTitleHidden}> { 'Delete' }</span></Button>);
      }

      return (
        <Col xs={xs} sm={sm} md={md} lg={lg} className="server-item-wrapper">
          <div className="server-item-control-wrapper">
            <div className="server-item-control">
              <div className="server-item-content">
                <ButtonGroup>
                  {errorMessage}

                  <Button id={'btn-server-' + server.FileName} bsSize="small" bsStyle={ null } className={ btnConnectClassName } disabled={ disabled } onClick={ this.props.OnConnect.bind(this, server) }>
                    {btnConnectTitle}
                  </Button>
                  {editControl}
                  {deleteControl}
                </ButtonGroup>
              </div>
            </div>
            <Image src={ OperatingSystemFamily.GetPreviewImageUrl(server.OS) } responsive />
          </div>
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
        btnConnectTitle = 'Disabled';
        btnConnectClassName += ' btn-gray';
      } else {
        if (server.Status & ServerStatus.ConnectionError) {
          btnConnectTitle = 'Try again';
          btnConnectClassName += ' btn-danger';
        }
        else if (server.Status & ServerStatus.Connecting || server.Status & ServerStatus.Testing || (App.CurrentServer != null && server.FileName == App.CurrentServer.FileName)) {
          btnConnectClassName += ' hidden';
        } else {
          btnConnectTitle = 'Connect';
          btnConnectClassName += ' btn-silver';
        }
      }

      let connectionStatus = null;

      if (server.Status & ServerStatus.ConnectionError) {
        connectionStatus = (
          <small className="red">
            <i className="glyphicon glyphicon-exclamation-sign"></i> { ' ' }
            {(() => {
              if (server.StatusMessage && server.StatusMessage != '') {
                return (<span>{server.StatusMessage}</span>);
              }
              else {
                return (<span>Unable to connect to the server.</span>);
              }
            })()}
          </small>
        );
      }

      let serverInfoCellClass = 'col-xs-10 col-sm-10 col-md-10 col-lg-10';
      let editControl = null, deleteControl = null;

      if (this.props.ShowControl) {
        serverInfoCellClass = 'col-xs-8 col-sm-8 col-md-8 col-lg-8';

        editControl = (
          <td className="col-xs-1 col-sm-1 col-md-1 col-lg-1">
            <Button bsSize="small" bsStyle="primary" disabled={ this.props.Disabled } onClick={ this.props.OnEdit.bind(this, server) }><i className="glyphicon glyphicon-edit"></i><span className="hidden-xs hidden-sm hidden-md"> { 'Edit' }</span></Button>
          </td>
        );

        deleteControl = (
          <td className="col-xs-1 col-sm-1 col-md-1 col-lg-1">
            <Button bsSize="small" bsStyle="danger" disabled={ this.props.Disabled } onClick={ this.props.OnDelete.bind(this, server) }><i className="glyphicon glyphicon-trash"></i><span className="hidden-xs hidden-sm hidden-md"> { 'Delete' }</span></Button>
          </td>
        );
      }

      return (
        <tr className={rowClass}>
          <td className={serverInfoCellClass}>
            {serverName}
            {serverDescription}
            {connectionStatus}
          </td>
          <td className="col-xs-2 col-sm-2 col-md-2 col-lg-2 text-center">
            <Button bsSize="small" bsStyle={ null } className={btnConnectClassName} disabled={ server.Disabled || this.props.Disabled } onClick={ this.props.OnConnect.bind(this, server) }>
              {btnConnectTitle}
            </Button>
            
            <div className={ (server.Status & ServerStatus.Connected ? 'green' : 'hidden') }>{ 'Connected' }</div>
            <div className={ (server.Status & ServerStatus.Testing ? 'brown' : 'hidden') }>
              <span className="fa fa-spinner fa-pulse fa-fw"></span> { ' ' }
              { 'Testing...' }
            </div>
            <div className={ (server.Status & ServerStatus.Connecting ? 'brown' : 'hidden') }>
              <span className="fa fa-spinner fa-pulse fa-fw"></span> { ' ' }
              { 'Connecting...' }
            </div>
          </td>
          {editControl}
          {deleteControl}
        </tr>
      );

    }
  }

}