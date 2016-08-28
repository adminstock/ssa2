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
import DocumentTitle from 'react-document-title';
import { Modal, Button, Row, Col, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import ILoginState from 'ILoginState';
import App from 'Core/App';
import Page from 'Core/Page';
import ApiRequest from 'API/ApiRequest';
import AuthResult from 'API/AuthResult';
import Success from 'API/Success';
import { SetAccessToken } from 'Actions/Global';

/**
 * Login page.
 */
export default class Index extends Page<any, ILoginState> {

  static defaultProps = {
    Title: 'Login',
    returnUrl: '/'
  }

  constructor(props?, context?) {
    super(props, context);

    let showDialog = false;
    let showForm = false;
    let checking = false;
    let loginProcessing = false;

    // get token
    let token = App.CurrentUser.AccessToken;

    if (token == null || token == '') {
      // show form
      showDialog = showForm = true;
    } else {
      // check token valid
      showDialog = checking = true;
    }

    // state
    this.state = {
      Checking: checking,
      LoginProcessing: loginProcessing,
      ShowDialog: showDialog,
      ShowForm: showForm,
      ValidationStateUsername: null,
      ValidationStatePassword: null,
      Username: '',
      Password: ''
    };
  }

  componentWillMount() {
    if (this.state.Checking) {
      this.CheckToken();
    }
  }

  private Login(username: string, password: string): void {
    let $this = this;

    $this.setState({
      ValidationStateUsername: ($this.state.Username == '' ? 'error' : null),
      ValidationStatePassword: ($this.state.Password == '' ? 'error' : null)
    });

    if ($this.state.Username == '' || $this.state.Password == '') {
      return;
    }

    $this.setState({ LoginProcessing: true });

    let redirecToHome = false;

    let api = new ApiRequest<any, AuthResult>(
      'Auth.GetToken',
      {
        Username: $this.state.Username,
        Password: $this.state.Password
      },
      App.CurrentUser.ApiServer.AuthUrl,
      null, null
    );

    api.SuccessCallback = (result) => {
      // set token
      App.Store.dispatch(SetAccessToken(result.TokenValue));
      
      // hide login form and redirect to home
      redirecToHome = true;
    }

    api.ErrorCallback = (error) => {
      // show error
      App.Alert({
        message: 'Server error: ' + error.Text,
        title: 'Error'
      });
    }

    api.CompleteCallback = () => {
      if (redirecToHome) {
        $this.setState({ ShowDialog: false }, () => {
          App.Redirect($this.props.returnUrl);
        });
      } else {
        $this.setState({ LoginProcessing: false });
      }
    }

    api.Execute();
  }

  private CheckToken(): void {
    let $this = this;

    $this.setState({ Checking: true });

    let redirecToHome = false;

    let api = new ApiRequest<any, Success>(
      'Auth.TokenIsValid',
      { Token: App.CurrentUser.AccessToken },
      App.CurrentUser.ApiServer.AuthUrl,
      null, null
    );

    api.SuccessCallback = (result) => {
      // hide login form and redirect to home
      redirecToHome = true;
    }

    api.ErrorCallback = (error) => {
      // remove token
      App.Store.dispatch(SetAccessToken(null));

      // show error
      App.Alert({
        message: 'Server error: ' + error.Text,
        title: 'Error'
      });
    }

    api.CompleteCallback = () => {
      if (redirecToHome) {
        $this.setState({ ShowDialog: false }, () => {
          App.Redirect($this.props.returnUrl);
        });
      } else {
        $this.setState({ Checking: false });
      }
    }

    api.Execute();
  }

  private Input_TextChanged(event: Event): void {
    let input = (event.target as HTMLInputElement);

    if (input.id == 'loginFormUsername') {
      this.setState({ Username: input.value });
    }
    else if (input.id == 'loginFormPassword') {
      this.setState({ Password: input.value });
    } else {
      Debug.Error('Unknown ID "' + input.id + '".');
    }
  }

  private Input_LostFocus(event: Event): void {
    let input = (event.target as HTMLInputElement);

    if (input.id == 'loginFormUsername') {
      this.setState({
        ValidationStateUsername: (input.value == '' ? 'error' : null),
      });
    }
    else if (input.id == 'loginFormPassword') {
      this.setState({
        ValidationStatePassword: (input.value == '' ? 'error' : null)
      });
    } else {
      Debug.Error('Unknown ID "' + input.id + '".');
    }
  }

  private Leave(): void {
    this.setState({ LoginProcessing: true }, () => {
      App.Redirect('http://www.adminstock.net');
    });
  }

  render() {
    Debug.Render('Login');

    let disabledForm = this.state.LoginProcessing || this.state.Checking;

    let title = '', footer = null, body = null;

    if (this.state.ShowForm) {
      title = 'Authentication';

      body = (
        <Form horizontal>
          <FormGroup controlId="loginFormUsername" validationState={this.state.ValidationStateUsername}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <ControlLabel>
                { 'Username' }:
              </ControlLabel>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <FormControl type="text" maxLength={100} required disabled={disabledForm} defaultValue={this.state.Username} onChange={this.Input_TextChanged.bind(this) } onBlur={this.Input_LostFocus.bind(this) } />
              <FormControl.Feedback />
            </Col>
          </FormGroup>
          <FormGroup controlId="loginFormPassword" validationState={this.state.ValidationStatePassword}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <ControlLabel>
                { 'Password' }:
              </ControlLabel>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <FormControl type="password" maxLength={100} required disabled={disabledForm} onChange={this.Input_TextChanged.bind(this) } onBlur={this.Input_LostFocus.bind(this) } />
              <FormControl.Feedback />
            </Col>
          </FormGroup>
          {/*TODO: Select API Server*/}
        </Form>
      );

      footer = (
        <div>
          <Button bsStyle="primary" onClick={this.Login.bind(this) } disabled={disabledForm}>
            {disabledForm ? <i className="fa fa-refresh fa-spin fa-fw"></i> : null}
            { 'Login' }
          </Button>
          <Button bsStyle="default" onClick={this.Leave.bind(this) } disabled={disabledForm}>
            { 'Leave' }
          </Button>
        </div>
      );
    }
    else {
      if (this.state.Checking) {
        title = 'Checking...';

        body = (
          <div className="text-center">
            <p><i className="fa fa-spinner fa-pulse fa-5x fa-fw"></i></p>
            <p>{ 'Checking the access...' }</p>
          </div>
        );

      } else {
        body = (
          <div className="text-center">
            <i className="fa fa-spinner fa-pulse fa-5x fa-fw"></i>
          </div>
        );
      }
    }

    return (
      <DocumentTitle title={this.props.Title}>
        <Modal show={this.state.ShowDialog} backdrop="static" onHide={null}>
          <Modal.Header closeButton={false}>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{body}</Modal.Body>
          <Modal.Footer>{footer}</Modal.Footer>
        </Modal>
      </DocumentTitle>
    );
  }

}