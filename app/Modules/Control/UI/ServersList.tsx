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
import Server from 'Models/Server';
import ProcessingIndicator from 'UI/ProcessingIndicator';
import IServersListState from 'IServersListState';
import IServersListProps from 'IServersListProps';
import ServerItem from 'ServerItem';
import { OutputMode } from 'OutputMode';

import {
  Table,
  Button,
  Grid,
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
      OutputMode: this.props.OutputMode || OutputMode.List
    };
  }

  componentWillMount() {
    this.LoadServers();
  }

  componentWillReceiveProps(nextProps: IServersListProps) {
    Debug.Call3('ServersList.componentWillReceiveProps', nextProps);

    if (nextProps.OutputMode != this.state.OutputMode) {
      this.setState({ OutputMode: nextProps.OutputMode });
    }
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
    Debug.Render2('ServersList', this.state.Loading);

    if (this.state.Loading) {
      return (<ProcessingIndicator Text={ __('Loading. Please wait...') } />);
    }

    let list = [];

    this.state.Servers.forEach((server, index) => {
      list.push(<ServerItem Server={server} OutputMode={ this.state.OutputMode } key={'server-' + index} />);
    });

    let servers = null;

    if (this.state.OutputMode == OutputMode.List) {
      servers = (
        <Table hover>
          <tbody>{list}</tbody>
        </Table>
      );
    } else {
      servers = (<Grid><Row>{list}</Row></Grid>);
    }

    return (
      <div>
        {servers}
      </div>
    );
  }

}