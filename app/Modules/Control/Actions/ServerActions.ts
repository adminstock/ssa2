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

export function LoadModules() {
  Debug.Action('LoadModules');

  return (dispatch: Redux.Dispatch<any>) => {
    return App.MakeRequest<any, Module[]>('Control.GetModules');
  }
}