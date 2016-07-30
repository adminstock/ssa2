import * as React from 'react';
import { Modal, Button, Row, Col, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import CookiesHelper from 'Helpers/CookiesHelper';
import IMainContext from 'Layouts/IMainContext';
import ILoginState from 'ILoginState';

/**
 * Represents login dialog.
 */
export default class Login extends React.Component<any, ILoginState> {

  context: IMainContext;

  static contextTypes: React.ValidationMap<any> = {
    Alert: React.PropTypes.func.isRequired
  }

  constructor(props?, context?) {
    super(props, context);

    Debug.Log(this);

    let showDialog = false;
    let showForm = false;
    let checking = false;
    let loginProcessing = false;

    // get token
    let token = CookiesHelper.Get('ssa-token');

    if (token == null) {
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

    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: '',
      
      success: (result: any) => { // TODO: class of request result
        Debug.Log('Login.Success', result);

        // set token to cookies
        CookiesHelper.Add('ssa-token', result.Token);

        // hide login form
        $this.setState({ ShowDialog: false });
      },

      error: (x: JQueryXHR, textStatus: string, errorThrown: any) => {
        Debug.Log('Login.Error', textStatus, errorThrown);

        // hide dialog
        $this.setState({ ShowDialog: false });

        // show error
        $this.context.Alert({
          message: 'Server error: ' + textStatus,
          title: __('Error'),
          callback: () => {
            // restore dialog
            $this.setState({ ShowDialog: true });
          }
        });
      },

      complete: (x: JQueryXHR, textStatus: string) => {
        $this.setState({ LoginProcessing: false });
      }
    });
  }

  private CheckToken(): void {
    let $this = this;

    $this.setState({ Checking: true });
  }

  private Input_TextChanged(event: Event): void {
    let input = (event.target as HTMLInputElement);

    //Debug.Log('Input_TextChanged', input.id);
    
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

    //Debug.Log('Input_LostFocus', input.id);
    
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

  render() {
    // Debug.Log('Login.render');

    let disabledForm = this.state.LoginProcessing || this.state.Checking;

    let title = '', footer = null, body = null;

    if (this.state.ShowForm) {
      title = __('Authentication');

      body = (
        <Form horizontal>
          <FormGroup controlId="loginFormUsername" validationState={this.state.ValidationStateUsername}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <ControlLabel>
                { __('Username') }:
              </ControlLabel>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <FormControl type="text" maxLength={100} required disabled={disabledForm} defaultValue={this.state.Username} onChange={this.Input_TextChanged.bind(this) } onBlur={this.Input_LostFocus.bind(this)} />
              <FormControl.Feedback />
            </Col>
          </FormGroup>
          <FormGroup controlId="loginFormPassword" validationState={this.state.ValidationStatePassword}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <ControlLabel>
                { __('Password') }:
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
            {__('Login') }
          </Button>
          <Button bsStyle="default" onClick={() => { window.location.href = 'http://www.adminstock.net'; } } disabled={disabledForm}>
            {__('Leave') }
          </Button>
        </div>
      );
    }
    else {
      if (this.state.Checking) {
        title = __('Checking...');

        body = (
          <div className="text-center">
            <p><i className="fa fa-spinner fa-pulse fa-5x fa-fw"></i></p>
            <p>{__('Checking the access...')}</p>
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
      <Modal show={this.state.ShowDialog} backdrop="static" onHide={null}>
        <Modal.Header closeButton={false}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>{footer}</Modal.Footer>
      </Modal>
    );
  }

}