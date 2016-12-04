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
import { LinkContainer } from 'react-router-bootstrap';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Button } from 'react-bootstrap';

//import CurrentUser from 'Core/CurrentUser';
import Component from 'Core/Component';
import App from 'Core/App';
import IMainContext from 'Core/IMainContext';
import ServersListDialog from 'Modules/Control/Components/ServersListDialog';
import { OutputMode } from 'Modules/Control/Components/OutputMode';

import { LoadLanguage } from 'Actions/Global';

import IHeaderState from 'IHeaderState';

export class Header extends Component<any, IHeaderState> {
  
  constructor(props, context) {
    super(props, context);

    this.state = {
      ShowServerList: false
    }
  }

  componentWillMount() {
  }

  private CheckPageTitle(): void {
    if (this.state.CurrentPageTitle != document.title) {
      this.setState({
        CurrentPageTitle: document.title
      }, () => {
        window.setTimeout(() => { this.CheckPageTitle(); }, 100);
      });
    } else {
      window.setTimeout(() => { this.CheckPageTitle(); }, 100);
    }
  }
  
  /**
   * Sets language.
   *
   * @param newLanguage New language: en, ru, de etc.
   */
  private SetLanguage(newLanguage: string): void {
    App.Store.dispatch(LoadLanguage(newLanguage));
  }

  private GetServerIcon(): string {
    if (true == true) { // CurrentUser.ManagedServer == null
      return null;
    }

    let result = '';
    
    let server = null; //CurrentUser.ManagedServer;

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
        result = 'os-icon24-debian';
      }
      else if (name.indexOf('ubuntu') != -1) {
        result = 'os-icon24-ubuntu';
      }
      else if (name.indexOf('freebsd') != -1) {
        result = 'os-icon24-freebsd';
      }
      else if (name.indexOf('redhat') != -1) {
        result = 'os-icon24-redhat';
      }
      else if (name.indexOf('centos') != -1) {
        result = 'os-icon24-centos';
      }
      else if (name.indexOf('windows') != -1) {
        result = 'os-icon24-windows';

        if (name.indexOf('2012') != -1 || name.indexOf('2016') != -1) {
          result = 'os-icon24-windows2012';
        }
      }
      else if (name.indexOf('osx') != -1 || name.indexOf('os x') != -1 || name.indexOf('mac') != -1) {
        result = 'os-icon24-osx';
      }

      if (result == '' && family != '') {
        if (family.indexOf('linux') != -1) {
          result = 'os-icon24-linux';
        }
      }
    }

    return 'os-icon24 ' + result;
  }

  render() {
    Debug.Render3('Header');

    let currentPage = App.CurrentPage;
    let currentUser = App.CurrentUser;

    let serverName = null;

    if (currentUser.Server != null) {
      serverName = currentUser.Server.FileName;

      if (currentUser.Server.Name != null && currentUser.Server.Name != '') {
        serverName = currentUser.Server.Name;
      }

      serverName = (
        <span>
          <i className={ this.GetServerIcon() }></i>
          <span>{ serverName }</span>
        </span>
      )
    }
    else {
      // fa-home
      serverName = (<i className="fa fa-hashtag" aria-hidden="true" style={ { float: 'none' } }></i>);
    }

    let breadcrumbs = [
      (<span key="breadcrumbs-0" className="navbar-brand hidden-xs">/</span>),
      (<span key="breadcrumbs-1" className="navbar-brand hidden-xs">{ 'Dashboard' }</span>)
    ];

    if (currentPage.Breadcrumbs != null) {
      if (typeof currentPage.Breadcrumbs == 'string') {
        breadcrumbs = [
          (<span key="breadcrumbs-0" className="navbar-brand hidden-xs">/</span>),
          (<span key="breadcrumbs-1" className="navbar-brand hidden-xs">{ currentPage.Breadcrumbs }</span>)
        ];
      }
      else if (Array.isArray(currentPage.Breadcrumbs)) {
        breadcrumbs = [<span key="breadcrumbs-100" className="navbar-brand hidden-xs">/</span>];

        (currentPage.Breadcrumbs as Array<any>).forEach((item, index) => {
          if (breadcrumbs.length > 1) {
            breadcrumbs.push(<span key={ 'breadcrumbs-' + (100 + index) } className="navbar-brand hidden-xs">/</span>);
          }

          if (typeof item !== 'string') {
            Debug.Error('Header.render: unsupported type of breadcrumbs');
          }

          breadcrumbs.push(<span key={ 'breadcrumbs-' + index } className="navbar-brand hidden-xs">{ item }</span>);
        });
      }
      else {
        Debug.Error('Header.render: unsupported type of breadcrumbs');
      }
    }

    let currentLang = 'lang lang-noselect';

    if (currentUser.Language != null && currentUser.Language != '') {
      currentLang = 'lang lang-' + currentUser.Language;
    }

    return (
      <Navbar>
        <Navbar.Header>
          <a className="navbar-brand" title="All servers" onClick={ () => this.setState({ ShowServerList: true }) }>
            <i className="fa fa-server" style={ { float: 'none' } }></i>
          </a>
          <Link to="/" className="navbar-brand" title="Dashboard">
            { serverName }
          </Link>
          { breadcrumbs }
        </Navbar.Header>
        <Nav pullRight className="lang">
          <NavDropdown id="lang" title={<i className={currentLang}></i>}>
            <MenuItem onClick={ this.SetLanguage.bind(this, 'en') }><i className="lang lang-en"></i></MenuItem>
            <MenuItem onClick={ this.SetLanguage.bind(this, 'ru') }><i className="lang lang-ru"></i></MenuItem>
            <MenuItem onClick={ this.SetLanguage.bind(this, 'de') }><i className="lang lang-de"></i></MenuItem>
          </NavDropdown>
          <LinkContainer to="/logout">
            <NavItem>
              <i className="glyphicon glyphicon-log-out"></i> Logout
            </NavItem>
          </LinkContainer>
        </Nav>
        <ServersListDialog Visible={ this.state.ShowServerList } OnHide={ () => this.setState({ ShowServerList: false }) } />
      </Navbar>
    )
  }

}

export default connect(state => ({
  CurrentPage: state.CurrentPage,
  CurrentUser: state.CurrentUser,
  CurrentServer: state.CurrentServer
}))(Header);