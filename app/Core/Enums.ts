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

export class ApiMessageType {

  public static get MSG_INFO(): string { return 'Info'; }
  
  public static get MSG_WARNINIG(): string { return 'Warning'; }

  public static get MSG_ERROR(): string { return 'Error'; }

  public static get MSG_CRITICAL(): string { return 'Critical'; }

}
