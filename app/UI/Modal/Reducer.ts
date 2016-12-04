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

import ActionType from 'ActionType';
import IModalProps from 'IModalProps';
import IResultProps from 'IResultProps';
import IState from 'IState';

const initState: IState = {
  Items: new Array<IModalProps>(),
  Results: new Array<IResultProps>()
};

export default function ModalReducer(state: IState = initState, action) {
  switch (action.type) {
    case ActionType.ALERT:
      return Object.assign({}, state, { Modal: action.Servers });

    case ActionType.ADD_MODAL:
      return Object.assign({}, state, { Items: [...state.Items, action.modal] });

    case ActionType.REMOVE_MODAL:
      return Object.assign({}, state, {
        Items: state.Items.filter((modal) => modal.Key != action.key)
      });

    case ActionType.SET_MODAL_RESULT:
      return Object.assign({}, state, {
        Results: state.Results.filter((itm) => itm.Key != action.key).concat({ Key: action.key, Value: action.value })
      });

    case ActionType.REMOVE_MODAL_RESULT:
      return Object.assign({}, state, {
        Results: state.Results.filter((modal) => modal.Key != action.key)
      });

    default:
      return state;
  }
}