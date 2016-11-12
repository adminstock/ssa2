import App from 'Core/App';
import { Server, ServerStatus } from 'Models/Server';

export function LoadServers() {
  Debug.Action('LoadServers');

  return (dispatch: Redux.Dispatch<any>) => {
    return App.MakeRequest<any, Server[]>('Control.GetServers');
  }
}

export function TestConnection(server: Server) {
  Debug.Action('TestConnection', server);

  return (dispatch: Redux.Dispatch<any>) => {
    return App.MakeRequest({
      Method: 'Control.ConnectionTest',
      Server: server.FileName
    });
  }
}