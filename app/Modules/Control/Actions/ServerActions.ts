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

import App from 'Core/App';
import { Server, ServerStatus } from 'Models/Server';
import Module from 'Models/Module';

/**
 * Loads list of servers.
 */
export function LoadServers() {
  Debug.Action('LoadServers');

  return (dispatch: Redux.Dispatch<any>) => {
    return App.MakeRequest<any, Server[]>('Control.GetServers');
  }
}

/**
 * Loads server.
 *
 * @param fileName Config file name.
 */
export function LoadServer(fileName: string) {
  Debug.Action('LoadServer', fileName);

  return (dispatch: Redux.Dispatch<any>) => {
    return App.MakeRequest<any, Server>('Control.GetServer', { FileName: fileName });
  }
}

/**
 * Saves server config.
 *
 * @param server Server to save.
 */
export function SaveServer(server: Server) {
  Debug.Action('SaveServer', server);

  return (dispatch: Redux.Dispatch<any>) => {
    return App.MakeRequest<Server, any>('Control.SaveServer', { Server: server });
  }
}

/**
 * Tests connection with server.
 *
 * @param server Server to connection test.
 */
export function TestConnection(server: Server) {
  Debug.Action('TestConnection', server);

  return (dispatch: Redux.Dispatch<any>) => {
    return App.MakeRequest({
      Method: 'Control.ConnectionTest',
      Server: server.FileName
    });
  }
}

/**
 * Loads list of modules.
 */
export function LoadModules() {
  Debug.Action('LoadModules');

  return (dispatch: Redux.Dispatch<any>) => {
    return App.MakeRequest<any, Module[]>('Control.GetModules');
  }
}