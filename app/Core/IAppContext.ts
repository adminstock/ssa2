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

import { Server } from 'Models/Server';
import ApiServer from 'Models/ApiServer';
import ICurrentUser from 'ICurrentUser';
import IErrorContext from 'IErrorContext';

/**
 * Application context.
 */
export interface IAppContext {

  /** Current user. */
  CurrentUser: ICurrentUser;

  /** Current server to manage. */
  CurrentServer: Server;

  /** Current server of API. */
  ActiveApiServer: ApiServer;

  /** List of available API servers. */
  AvailableApiServers: Array<ApiServer>;

  /** Context of the current page. */
  CurrentPage: { Breadcrumbs?: any, State?: any };

  Visible: boolean;

  AppError: IErrorContext;

}

export default IAppContext;