/*
 * Copyright © AdminStock Team (www.adminstock.net), 2016. All rights reserved.
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
import { render } from 'react-dom';
import DocumentTitle from 'react-document-title';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';
import { Modal, Button } from 'react-bootstrap';
import Dialog from 'Models/Dialog';

// TODO: Grouping Layout UI
import Header from 'UI/Layout/Header';
import Menu from 'UI/Layout/Menu';

import CookiesHelper from 'Helpers/CookiesHelper';

export default class Main extends React.Component<any, any> {

  static contextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object.isRequired
  }

  static childContextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object.isRequired,
    setTitle: React.PropTypes.func.isRequired,
    setLanguage: React.PropTypes.func,
    alert: React.PropTypes.func
  }

  /** Created modal dialogs. */
  // private dialogs: Array<Dialog> = new Array<Dialog>();

  constructor(props, context) {
    super(props, context);

    Debug.Write(this);

    this.state = {
      title: 'SmallServerAdmin',
      dialogs: new Array<Dialog>()
    };
  }

  public getChildContext(): any {
    return {
      router: (this.context as any).router,
      setTitle: this.setTitle.bind(this),
      setLanguage: this.setLanguage.bind(this),
      alert: this.alert.bind(this)
    };
  }

  /**
   * Sets a new title to window.
   *
   * @param value Text to set.
   */
  public setTitle(value: string): void {
    Debug.Write('setTitle', value);

    this.setState({ title: value });
  }

  /**
   * Sets language.
   *
   * @param newLanguage New language: en, ru, de etc.
   */
  public setLanguage(newLanguage: string): void {
    Debug.Write('setLanguage', newLanguage);

    CookiesHelper.Add('lang', newLanguage, 365);

    window.location.reload(true);
  }

  // TODO: options
  public alert(message?: string | JSX.Element | HTMLElement | JQuery, title?: string | JSX.Element | HTMLElement | JQuery, closeHandler?: { (dialog: JSX.Element): void; }): void {
    var dialog = new Dialog();
    dialog.Visible = true;
    Debug.Write('Modal.Created', dialog.Key);

    dialog.Element = (<Modal key={dialog.Key} show={dialog.Visible} onHide={() => {
      Debug.Write('Modal.Close', dialog.Key, dialog);

      // TODO: cancel handler
      if (closeHandler !== undefined && closeHandler !== null && typeof closeHandler === 'function') {
        closeHandler(dialog.Element);
      }

      dialog.Visible = false;

      // remove dialog

      // https://facebook.github.io/react/docs/update.html
      //this.setState(ReactUpdate(this.state, { dialogs: { $splice: dialogs } }));

      this.setState({
        dialogs: this.state.dialogs.filter((d) => d.Key !== dialog.Key)
      });

      //this.render();

    }}>
      <Modal.Header closeButton>
        <Modal.Title>Alert</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button>Close</Button>
      </Modal.Footer>
    </Modal>);

    var dialogs = this.state.dialogs;
    dialogs.push(dialog);
    this.setState({ dialogs: dialogs });

    //this.render();
  }

  render() {
    Debug.Write('Main.render');

    var dialogsToRender = new Array<JSX.Element>();

    this.state.dialogs.forEach((dialog: Dialog) => {
      if (dialog.Visible) {
        dialogsToRender.push(dialog.Element);
      }
    });

    return (
      <DocumentTitle title={this.state.title}>
        <div>
          <Header />
          <div id="container" className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-4 col-md-3 col-lg-3">
                <Menu />
              </div>
              <div className="col-xs-12 col-sm-8 col-md-9 col-lg-9">
                {this.props.children}
              </div>
            </div>
          </div>
          <footer className="text-center small">
            <hr />
            SmallServerAdmin v{SSA_VERSION} ({SSA_DATE_RELEASE})
            <br />
          </footer>

          {dialogsToRender}
        </div>
      </DocumentTitle>
    )
  }

}