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
  Button, ButtonGroup, ButtonToolbar, Checkbox,
  Row, Col,
  Form, FormGroup, FormControl,
  ControlLabel,
  Alert,
  Accordion,
  Panel,
  Table
} from 'react-bootstrap';

import App from 'Core/App';
import Component from 'Core/Component';

import Module from 'Models/Module';
import IModuleInfoProps from 'IModuleInfoProps';

export default class ModuleInfo extends Component<IModuleInfoProps, any> {

  constructor(props?, context?) {
    super(props, context);

    this.state = {
      Visible: this.props.Visible,
      Module: this.props.Module
    };
  }

  componentWillReceiveProps(nextProps: IModuleInfoProps) {
    Debug.Call3('ModuleInfo.componentWillReceiveProps', nextProps);

    this.setState(nextProps);
  }

  private OnHide(): void {
    this.props.OnHide();
  }

  render() {
    Debug.Render3('ModuleInfo');

    let m: Module = this.state.Module || new Module('Unknown');

    let authors = [];

    if (m.Authors != null) {
      m.Authors.forEach((author, i) => {
        let authorName = null;

        if (author.Role && author.Role != '') {
          authorName = (<h5>{  author.Name || 'Nameless' }<br /><small>{  author.Role }</small></h5>);
        } else {
          authorName = (<h5>{  author.Name || 'Nameless' }</h5>);
        }

        let authorEmail = null;

        if (author.Email) {
          if (typeof author.Email === 'string' && author.Email != '') {
            authorEmail = (<p><i className="glyphicon glyphicon-envelope"></i> <a href={ 'mailto:' + author.Email }>{ author.Email }</a></p>)
          } else if (Array.isArray(author.Email) && author.Email.length > 0) {
            authorEmail = [];

            (author.Email as Array<string>).forEach((email, emailIndex) => {
              authorEmail.push(<p key={ 'module_author_' + i + '_email_' + emailIndex }><i className="glyphicon glyphicon-envelope"></i> <a href={ 'mailto:' + email }>{ email }</a></p>);
            });
          }
        }

        let authorUrl = null;

        if (author.Homepage) {
          if (typeof author.Homepage === 'string' && author.Homepage != '') {
            authorUrl = (<p><i className="glyphicon glyphicon-globe"></i> <a href={ !author.Homepage.toString().startsWith('//') && !author.Homepage.toString().startsWith('http://') && !author.Homepage.toString().startsWith('https://') ? 'http://' + author.Homepage : author.Homepage }>{ author.Homepage }</a></p>)
          } else if (Array.isArray(author.Homepage) && author.Homepage.length > 0) {
            authorUrl = [];

            (author.Homepage as Array<string>).forEach((homepage, homepageIndex) => {
              authorUrl.push(<p key={ 'module_author_' + i + '_homepage_' + homepageIndex }><i className="glyphicon glyphicon-globe"></i> <a href={ !homepage.startsWith('//') && !homepage.startsWith('http://') && !homepage.startsWith('https://') ? 'http://' + homepage : homepage }>{ homepage }</a></p>);
            });
          }
        }

        authors.push(
          <div key={ 'module_author_' + i }>
            { authorName }
            { authorEmail }
            { authorUrl }
          </div>
        );
      });
    }

    if (authors.length > 0) {
      authors.splice(0, 0, (<hr key={ App.RandomKey() } />));
      authors.splice(1, 0, (<h4 key={ App.RandomKey() }><FormattedMessage id="LBL_CREDITS" defaultMessage="Credits" /></h4>));
    }

    return (
      <Modal show={ this.state.Visible } onHide={ this.OnHide.bind(this) }>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="glyphicon glyphicon-info-sign"></i> { ' ' }
            <FormattedMessage id="LBL_MODULE" defaultMessage="Module" />: { ' ' }
            { m.Name }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { (() => {
            if (m.Description && m.Description != '') {
              return <div><p>{ m.Description }</p><hr /></div>;
            }
          })() }

          <p>
            <i className="fa fa-tag"></i> { ' ' }
            <FormattedMessage id="LBL_VERSION" defaultMessage="Version" />: { ' ' }
            { m.Version || 'unknown' }
          </p>

          { (() => {
            if (m.DateRelease && m.DateRelease != '') {
              return <p>
                <i className="glyphicon glyphicon-time"></i> { ' ' }
                <FormattedMessage id="LBL_DATE_RELEASE" defaultMessage="Date release" />: { ' ' }
                { m.DateRelease }
              </p>;
            }
          })() }

          { (() => {
            if (m.License && m.License != '') {
              return <p>
                <i className="fa fa-balance-scale"></i> { ' ' }
                <FormattedMessage id="LBL_LICENSE" defaultMessage="License" />: { ' ' }
                { m.License }
              </p>;
            }
          })() }

          { authors }
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="default" onClick={ this.OnHide.bind(this) }>
            <FormattedMessage id="BTN_OK" defaultMessage="Ok" />
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

}