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

import { updateIntl } from 'react-intl-redux'

import ActionType from 'ActionType';
import { Server } from 'Models/Server';

import { OverlayType } from 'UI/Overlay/OverlayType';

import App from 'Core/App';

import ApiServer from 'Models/ApiServer';
import ApiRequest from 'API/ApiRequest';
import ApiError from 'API/ApiError';

export function SetVisible(visible: boolean) {
  Debug.Action('SetVisible', visible);

  return {
    type: ActionType.SET_VISIBLE,
    Visible: visible
  };
}

export function SetError(title: string, text: string | JSX.Element) {
  Debug.Action('SetError', title, text);

  return {
    type: ActionType.SET_ERROR,
    Title: title,
    Text: text
  };
}

export function ClearError() {
  Debug.Action('ClearError');

  return {
    type: ActionType.CLEAR_ERROR
  };
}

export function SetAccessToken(accessToken: string) {
  Debug.Action('SetAccessToken', accessToken);

  return {
    type: ActionType.SET_ACCESS_TOKEN,
    AccessToken: accessToken
  };
}

export function SetLanguage(newLanguage: string) {
  Debug.Action('SetLanguage', newLanguage);

  return {
    type: ActionType.SET_LANGUAGE,
    Language: newLanguage
  };
}

export function LoadLanguage(newLanguage: string) {
  Debug.Action('LoadLanguage', newLanguage);

  return (dispatch: Redux.Dispatch<any>) => {
    dispatch(ShowOverlay(OverlayType.Loader | OverlayType.White, 'Loading resources of localization...'));

    switch (newLanguage) {
      case 'ru':
        require(['Localization/ru'], LanguageLoaded.bind(dispatch));
        break;

      case 'de':
        require(['Localization/de'], LanguageLoaded.bind(dispatch));
        break;

      default:
        dispatch(updateIntl({
          defaultLocale: 'en',
          locale: 'en',
          messages: {}
        }));
        break;
    }
  }
}

function LanguageLoaded(data: any) {
  Debug.Call('LanguageLoaded', data.intl);

  this(updateIntl(data.intl));

  this(SetLanguage(data.intl.locale));
  
  this(HideOverlay());
}

export function SetServer(newServer: Server) {
  Debug.Action('SetServer', newServer);

  return {
    type: ActionType.SET_SERVER,
    Server: newServer
  };
}

export function ShowOverlay(type: OverlayType, text?: string) {
  Debug.Action('ShowOverlay', type, text);

  return {
    type: ActionType.SHOW_OVERLAY,
    OverlayType: type,
    Text: text
  };
}

export function SetOverlayText(text?: string) {
  Debug.Action('SetOverlayText', text);

  return {
    type: ActionType.SET_OVERLAY_TEXT,
    Text: text
  };
}

export function HideOverlay() {
  Debug.Action('HideOverlay');

  return {
    type: ActionType.HIDE_OVERLAY
  };
}

export function SetApiServers(servers: Array<ApiServer>) {
  Debug.Action('SetApiServers', servers);

  return {
    type: ActionType.SET_API_SERVERS,
    Servers: servers
  };
}

export function SetActiveApiServer(server: ApiServer) {
  Debug.Action('SetActiveApiServer', server);

  return {
    type: ActionType.SET_ACTIVE_API_SERVER,
    Server: server
  };
}

export function LoadApiServers() {
  Debug.Action('LoadApiServers');

  return (dispatch: Redux.Dispatch<any>) => {
    Debug.Request('LoadApiServers');

    dispatch(ShowOverlay(OverlayType.Loader | OverlayType.White, 'Loading list of API servers...'));

    $.ajax({
      cache: false,
      crossDomain: true,
      type: 'GET',
      dataType: 'json',
      url: '/servers.json',

      // handler of request succeeds
      success: (result: Array<ApiServer>) => {
        Debug.Response('LoadApiServers.Success', result);

        dispatch(SetApiServers(result));
      },

      // server returned error
      error: (x: JQueryXHR, textStatus: string, errorThrown: any) => {
        Debug.Response('LoadApiServers.Error', x, textStatus, errorThrown);

        dispatch(SetError('Request error', textStatus || errorThrown));
      }
    });

    return null;
  };
}

export function LoadServer(fileName: string, successCallback?: (server: Server) => void, errorCallback?: (error: ApiError) => void) {
  Debug.Action('LoadServer', fileName);
  
  return (dispatch: Redux.Dispatch<any>) => {

    dispatch(ShowOverlay(OverlayType.Loader | OverlayType.White, 'Loading server info...'));

    let api = new ApiRequest<any, Server>('Control.GetServer', { FileName: fileName }, App.CurrentUser.ApiServer.Url, App.CurrentUser.AccessToken, null);

    api.SuccessCallback = (result) => {
      if (typeof successCallback === 'function') {
        successCallback(result);
      } else {
        dispatch(SetServer(result));
      }
    }

    api.ErrorCallback = (error) => {
      if (typeof errorCallback == 'function') {
        errorCallback(error);
      } else {
        dispatch(SetError('Server error', error.Text));
      }
    }

    api.Execute();
    
    return null;
  };
}

export function SetBreadcrumbs(breadcrumbs: string | Array<string> | Array<any>) {
  Debug.Action('SetBreadcrumbs', breadcrumbs);

  return {
    type: ActionType.SET_BREADCRUMBS,
    Breadcrumbs: breadcrumbs
  };
}