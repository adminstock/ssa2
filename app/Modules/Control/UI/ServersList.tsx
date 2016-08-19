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
import { Button } from 'react-bootstrap';
import Server from 'Models/Server';
import IServersListState from 'IServersListState';
import ProcessingIndicator from 'UI/ProcessingIndicator';

/**
 * Represents a list of servers to manage.
 */
export default class ServersList extends Component<any, IServersListState> {

  constructor(props, context) {
    super(props, context);

    this.state = {
      Servers: new Array<Server>(),
      Loading: true
    };
  }

  componentWillMount() {
    this.LoadServers();
  }

  /**
   * Loads list of servers.
   */
  private LoadServers(): void {
    App.MakeRequest<any, Array<Server>>({
      Method: 'Control.GetServers',
      SuccessCallback: (result) => {
        this.setState({ Servers: result, Loading: false });
      }
    });
  }

  render() {
    Debug.Render3('ServersList', this.state.Loading);

    if (this.state.Loading) {
      return (<ProcessingIndicator Text={ __('Loading. Please wait...') } />);
    }

    let list = [];

    //ng-class="{'success': (server.Address == Config.ServerAddress && server.Name == Config.ServerName) && !CurrentServerConnectionError && !ConnectionTesting, 'danger': (server.Address == Config.ServerAddress && server.Name == Config.ServerName) && CurrentServerConnectionError, 'warning': (server.Address == Config.ServerAddress && server.Name == Config.ServerName) && ConnectionTesting, 'text-muted': server.Disabled}"

    let currentServer = App.CurrentUser.ManagedServer;

    this.state.Servers.forEach((server, index) => {
      let className = 'col-xs-8 col-sm-8 col-md-8 col-lg-8';
      let serverName = (<h4>{server.Address}</h4>);

      if (server.Name != null && server.Name != '') {
        serverName = (<h4>{server.Name} <small>({server.Address})</small></h4>);
      }

      let serverDescription = null;

      if (server.Description != null && server.Description != '') {
        serverDescription = (<small>{server.Description}</small>);
      }

      // <?=($this->NoControl != 'TRUE' ? 'col-xs-8 col-sm-8 col-md-8 col-lg-8' : 'col-xs-10 col-sm-10 col-md-10 col-lg-10')?>
      list.push(
        <tr key={'server' + index} className={className}>
          <td className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
            {serverName}
            {serverDescription}

            {(() => {
              if (server.Address == currentServer) {
                return (<small className="red"><span class="glyphicon glyphicon-exclamation-sign"></span> {__('Unable to connect to the server.')}</small>);
              }
            })()}
          </td>
          <td class="col-xs-2 col-sm-2 col-md-2 col-lg-2 text-center">

          </td>
        </tr>
      );
    });

    return (
      <table class="table table-hover cell-align-middle">
        <tbody>{list}</tbody>
      </table>
    );
  }

}