import * as React from 'react';
import { Modal, Button, Row, Col, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import CookiesHelper from 'Helpers/CookiesHelper';
import IMainContext from 'Layouts/IMainContext';

/**
 * Represents login dialog.
 */
export default class Login extends React.Component<any, any> {

  context: IMainContext;

  static contextTypes: React.ValidationMap<any> = {
    Alert: React.PropTypes.func.isRequired
  }

  constructor(props?, context?) {
    super(props, context);

    Debug.Log(this);

    let showForm = false;
    let checking = false;
    let loginProcessing = false;

    // get token
    let token = CookiesHelper.Get('ssa-token');

    if (token == null) {
      // show form
      showForm = true;
    } else {
      // check token valid
      checking = true;
    }

    // state
    this.state = {
      Checking: checking,
      LoginProcessing: loginProcessing,
      ShowForm: showForm
    };
  }

  componentWillMount() {
    if (this.state.Checking) {
      this.CheckToken();
    }
  }

  private Login(): void {
    let $this = this;

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
        $this.setState({ ShowForm: false });
      },

      error: (x: JQueryXHR, textStatus: string, errorThrown: any) => {
        Debug.Log('Login.Error', textStatus, errorThrown);

        // hide dialog
        $this.setState({ ShowForm: false });

        // show error
        $this.context.Alert({
          message: 'Server error: ' + textStatus,
          title: __('Error'),
          callback: () => {
            // restore dialog
            $this.setState({ ShowForm: true });
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

  render() {
    Debug.Log('Login.render');

    let disabledForm = this.state.LoginProcessing;

    return (
      <Modal show={this.state.ShowForm || this.state.LoginProcessing || this.state.Checking} backdrop="static" onHide={null}>
        <Modal.Header closeButton={false}>
          <Modal.Title>{ __('Authentication') }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup controlId="loginFormUsername">
              <Col xs={12} sm={12} md={12} lg={12}>
                <ControlLabel>
                  { __('Username') }:
                </ControlLabel>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <FormControl type="text"  maxLength={100} required disabled={disabledForm} />
              </Col>
            </FormGroup>
            <FormGroup controlId="loginFormPassword">
              <Col xs={12} sm={12} md={12} lg={12}>
                <ControlLabel>
                  { __('Password') }:
                </ControlLabel>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <FormControl type="password" maxLength={100} required disabled={disabledForm} />
              </Col>
            </FormGroup>
            {/*TODO: Select API Server*/}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.Login.bind(this) } disabled={disabledForm}>
            {disabledForm ? <i className="fa fa-refresh fa-spin fa-fw"></i> : null}
            {__('Login') }
          </Button>
          <Button bsStyle="default" onClick={() => { window.location.href = 'http://www.adminstock.net'; } } disabled={disabledForm}>
            {__('Leave') }
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

}