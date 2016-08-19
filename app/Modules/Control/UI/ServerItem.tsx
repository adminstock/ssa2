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
import Server from 'Models/Server';
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

    if (this.props.OutputMode == OutputMode.Thumbnail) {

      let serverName = (<h4>{server.Address}</h4>);

      if (server.Name != null && server.Name != '') {
        serverName = (<h4>{server.Name} <small>({server.Address}) </small></h4>);
      }

      return (
        <Col xs={6} sm={4} md={3} lg={3} className="server-wrapper">
          <div className="server-image"></div>
          <Image src="/dist/images/server.png" responsive />
          <h4>{serverName}</h4>
        </Col>
      );

    } else {

      let className = 'col-xs-8 col-sm-8 col-md-8 col-lg-8';
      let serverName = (<h4>{server.Address}</h4>);

      if (server.Name != null && server.Name != '') {
        serverName = (<h4>{server.Name} <small>({server.Address}) </small></h4>);
      }

      let serverDescription = null;

      if (server.Description != null && server.Description != '') {
        serverDescription = (<small>{server.Description}</small>);
      }

      // <?=($this->NoControl != 'TRUE' ? 'col-xs-8 col-sm-8 col-md-8 col-lg-8' : 'col-xs-10 col-sm-10 col-md-10 col-lg-10')?>

      return (
        <tr className={className}>
          <td className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
            {serverName}
            {serverDescription}

            {(() => {
              if (server.Address == App.CurrentUser.ManagedServer) {
                return (<small className="red"><span className="glyphicon glyphicon-exclamation-sign"></span> {__('Unable to connect to the server.') }</small>);
              }
            })() }
          </td>
          <td className="col-xs-2 col-sm-2 col-md-2 col-lg-2 text-center">

          </td>
        </tr>
      );

    }
  }

}