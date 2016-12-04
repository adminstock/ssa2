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
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import IStore from 'IStore';
import IState from 'IState';
import IModalProps from 'IModalProps';
import IModalManagerProps from 'IModalManagerProps';

import Alert from 'Alert';
import Confirm from 'Confirm';

import { RemoveModal, SetResult } from 'Actions';

/**
 * Redux Bootstrap modal dialog manager.
 */
export class ModalManager extends React.Component<IModalManagerProps, any> {

  static contextTypes: React.ValidationMap<any> = {
    dispatch: React.PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context);
  }

  private MakeAlert(modal: IModalProps): JSX.Element {
    const text = (modal.UseHtml ? <div dangerouslySetInnerHTML={ { __html: modal.Text } } /> : modal.Text);
    const title = (modal.UseHtml && modal.Title ? <div dangerouslySetInnerHTML={ { __html: modal.Title } } /> : modal.Title);

    modal.Buttons[0].Text = (modal.UseHtml && modal.Buttons[0].Text ? <div dangerouslySetInnerHTML={ { __html: modal.Buttons[0].Text } } /> : modal.Buttons[0].Text);

    return (
      <Alert
        Text={ text }
        Title={ title }
        ButtonOk={ modal.Buttons[0] }
        Visible={ true }
        OnHide={ () => { (this.context as any).dispatch(RemoveModal(modal.Key)) } }
      />
    );
  }

  private MakeConfirm(modal: IModalProps): JSX.Element {
    const text = (modal.UseHtml ? <div dangerouslySetInnerHTML={ { __html: modal.Text } } /> : modal.Text);
    const title = (modal.UseHtml && modal.Title ? <div dangerouslySetInnerHTML={ { __html: modal.Title } } /> : modal.Title);

    modal.Buttons[0].Text = (modal.UseHtml && modal.Buttons[0].Text ? <div dangerouslySetInnerHTML={ { __html: modal.Buttons[0].Text } } /> : modal.Buttons[0].Text);
    modal.Buttons[1].Text = (modal.UseHtml && modal.Buttons[1].Text ? <div dangerouslySetInnerHTML={ { __html: modal.Buttons[1].Text } } /> : modal.Buttons[1].Text);

    return (
      <Confirm
        Text={ text }
        Title={ title }
        ButtonOk={ modal.Buttons[0] }
        ButtonCancel={ modal.Buttons[1] }
        Visible={ true }
        OnHide={ (result) => {
          (this.context as any).dispatch(SetResult(modal.Key, result));
          (this.context as any).dispatch(RemoveModal(modal.Key));
        } }
      />
    );
  }

  render() {
    Debug.Render('ModalManager', this.props);

    const items = this.props.ModalManager.Items;

    if (!items || items.length <= 0) {
      return null;
    }

    let result: JSX.Element = null;;

    const last = items[items.length - 1];   

    if (last.Type == 'alert') {
      result = this.MakeAlert(last);
    }
    else if (last.Type == 'confirm') {
      result = this.MakeConfirm(last);
    } else {
      console.error('Unsuppored modal type:', last.Type);
    }

    return result;
  }

}

export default connect<IStore, IModalManagerProps, any>(state => ({
  ModalManager: state.ModalManager
}))(ModalManager);