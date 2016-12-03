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
import { Server, ServerStatus } from 'Models/Server';
import ProcessingIndicator from 'UI/ProcessingIndicator';
import IServersListState from 'IServersListState';
import IServersListProps from 'IServersListProps';
import ServerItem from 'ServerItem';
import ServerEditor from 'ServerEditor';
import { OutputMode } from 'OutputMode';
import { SetServer } from 'Actions/Global';
import { LoadServers, TestConnection } from '../Actions/ServerActions';

import {
  Table,
  Button,
  Row,
  Col
} from 'react-bootstrap';

/**
 * Represents a list of servers to manage.
 */
export default class ServersList extends Component<IServersListProps, IServersListState> {

  constructor(props, context) {
    super(props, context);

    this.state = {
      Servers: new Array<Server>(),
      Loading: true,
      Testing: false,
      OutputMode: this.props.OutputMode || OutputMode.List,
      ShowEditor: false,
      SelectedServer: this.props.SelectedServer || ''
    };
  }

  componentWillMount() {
    Debug.Call3('ServersList.componentWillMount', this.props);

    this.LoadServers().then(() => {
      if (this.props.SelectedServer && this.props.SelectedServer != '') {
        this.setState({ ShowEditor: true, SelectedServer: this.props.SelectedServer });
      }
    });
  }

  componentDidMount() {
    Debug.Call3('ServersList.componentDidMount');

    if (this.props.OutputMode != OutputMode.Thumbnail && this.props.OutputMode != OutputMode.ThumbnailLarge) {
      return;
    }

    // height correction
    // TODO: find the best solution

    let maxHeight = 0;

    $('.server-item-wrapper').each((index, element) => {
      if ($(element).height() > maxHeight) { maxHeight = $(element).height(); }
    });

    $('.server-item-wrapper').height(maxHeight);
  }

  componentWillReceiveProps(nextProps: IServersListProps) {
    Debug.Call3('ServersList.componentWillReceiveProps', nextProps);

    let newState = null;

    if (nextProps.OutputMode != this.state.OutputMode) {
      newState = { OutputMode: nextProps.OutputMode };
    }

    if (nextProps.SelectedServer != this.props.SelectedServer) {
      if (newState == null) { newState = {}; }

      if (nextProps.SelectedServer && nextProps.SelectedServer != '') {
        let fileName = nextProps.SelectedServer;

        //if (nextProps.SelectedServer == 'new') {
        //  fileName = '';
        // }

        $.extend(newState, { ShowEditor: true, SelectedServer: fileName });
      } else {
        $.extend(newState, { ShowEditor: false });
      }
    }

    if (newState) {
      this.setState(newState);
    }
  }

  componentWillUnmount() {
    Debug.Call3('ServersList.componentWillUnmount');
  }

  /**
   * Loads list of servers.
   */
  public LoadServers(): Promise<any> {
    Debug.Call3('ServersList.LoadServers');

    return this.setState2({ Loading: true }).then(() => {
      return this.dispatch(LoadServers());
    }).then((result) => {
      return this.setState2({ Servers: result, Loading: false });
    }).then(() => {
      this.TestCurrentServerConnection();
    });
  }

  private ConnectToServer(server: Server): void {
    Debug.Call3('ServersList.ConnectToServer', server);

    server.Status = ServerStatus.Connecting;
    
    this.setState2({ Testing: true }).then(() => {
      this.TestConnection(server, true);
    });
  }

  private TestConnection(server: Server, setServer: boolean): void {
    Debug.Call3('ServersList.TestConnection', server);

    this.dispatch(TestConnection(server)).then((result) => {
      Debug.Level3('ServersList.TestConnection.Success', server);

      // set status to tested server
      server.Status = ServerStatus.Connected; // TODO: Tested
      server.StatusMessage = null;

      if (setServer) {
        // reset status of all servers
        this.state.Servers.forEach((s) => {
          if (s.FileName != server.FileName && (s.Status & ServerStatus.Connected)) {
            s.Status = ServerStatus.None;
          }
        });

        // set tested server as current server
        this.dispatch(SetServer(server));
      }

      this.setState({ Testing: false });
    }).catch((error) => {
      Debug.Level3('ServersList.TestConnection.Error', server);
      server.Status = ServerStatus.ConnectionError;
      server.StatusMessage = error.Text || error.Code;
      this.setState({ Testing: false });
    });
  }

  private TestCurrentServerConnection(): void {
    if (App.CurrentServer == null) {
      return;
    }

    let currentServerName = App.CurrentServer.FileName;

    for (let i = 0; i < this.state.Servers.length; i++) {
      if (this.state.Servers[i].FileName == currentServerName) {
        this.state.Servers[i].Status = ServerStatus.Testing;

        this.setState2({ Testing: true }).then(() => {
          this.TestConnection(this.state.Servers[i], false);
        });

        break;
      }
    }
  }

  private SetStatusToCurrentServer(newStatus: ServerStatus): void {
    if (App.CurrentServer == null) {
      return;
    }

    let currentServerName = App.CurrentServer.FileName;

    for (let i = 0; i < this.state.Servers.length; i++) {
      if (this.state.Servers[i].FileName == currentServerName) {
        this.state.Servers[i].Status = newStatus;
        break;
      }
    }
  }

  /**
   * Sets of replaces server to state.
   *
   * @param server Server to set.
   */
  public SetServerToState(server: Server): void {
    Debug.Call3('ServersList.SetServerToState', server);

    // get server index
    let index = this.state.Servers.findIndex((ms) => ms.FileName == server.FileName);

    Debug.Level3('Server Index', index);

    if (index == -1) {
      let servers = this.state.Servers;
      if (!servers) {
        servers = [];
      }
      servers.push(server);

      this.setState({ Servers: servers });
    } else {
      // update server in state
      this.setState(ReactUpdate(this.state, { Servers: { $splice: [[index, 1, server]] } }));
    }
  }

  render() {
    Debug.Render2('ServersList', this.props);

    if (this.state.Loading) {
      return (<ProcessingIndicator Text={ 'Loading. Please wait...' } />);
    }

    let list = [];

    if (this.state.Servers != null) {
      this.state.Servers.forEach((server, index) => {
        const onEdit = (this.props.OnEdit ? this.props.OnEdit.bind(this, server) : null);
        const onDelete = (this.props.OnDelete ? this.props.OnDelete.bind(this, server) : null);

        list.push(
          <ServerItem
            Server={server}
            OutputMode={ this.state.OutputMode }
            key={'server-' + index}
            OnConnect={ this.ConnectToServer.bind(this) }
            OnEdit={ onEdit }
            OnDelete={ onDelete }
            Disabled={ this.state.Testing }
            ShowControl={ this.props.ShowControl }
          />
        );
      });
    }

    let servers = null;

    if (this.state.OutputMode == OutputMode.List) {
      // list
      servers = (
        <Table hover className="cell-align-middle">
          <tbody>{list}</tbody>
        </Table>
      );
    } else {
      // thumbs
      servers = (<Row>{list}</Row>);
    }

    return (
      <div>
        {servers}
      </div>
    );
  }

}