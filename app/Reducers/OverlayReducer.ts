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

import ActionType from 'Actions/ActionType';
import IOverlay from 'UI/Overlay/IOverlay';

const initState: IOverlay = { OverlayType: 0, Text: null, Counter: 0 };

export default function OverlayReducer(state: IOverlay = initState, action) {
  switch (action.type) {
    case ActionType.SHOW_OVERLAY:
      return Object.assign({}, state, { OverlayType: action.OverlayType, Text: action.Text, Counter: state.Counter + 1 });

    case ActionType.SET_OVERLAY_TEXT:
      return Object.assign({}, state, { Text: action.Text });

    case ActionType.HIDE_OVERLAY:
      if (state.Counter - 1 <= 0) {
        return Object.assign({}, state, { OverlayType: 0, Counter: 0 });
      } else {
        return Object.assign({}, state, { Counter: state.Counter - 1 });
      }

    default:
      return state;
  }
}