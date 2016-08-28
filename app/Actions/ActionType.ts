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

/**
 * The list of actions.
 */
export default class ActionType {

  public static get SET_ACCESS_TOKEN(): string { return 'SET_ACCESS_TOKEN'; }

  public static get LOAD_LANGUAGE(): string { return 'LOAD_LANGUAGE'; }

  public static get SET_LANGUAGE(): string { return 'SET_LANGUAGE'; }

  public static get SET_SERVER(): string { return 'SET_SERVER'; }

  public static get SET_API_SERVERS(): string { return 'SET_API_SERVERS'; }

  public static get SET_ACTIVE_API_SERVER(): string { return 'SET_ACTIVE_API_SERVER'; }

  public static get SET_VISIBLE(): string { return 'SET_VISIBLE'; }
  
  public static get SET_ERROR(): string { return 'SET_ERROR'; }

  public static get CLEAR_ERROR(): string { return 'CLEAR_ERROR'; }

  public static get SET_BREADCRUMBS(): string { return 'SET_BREADCRUMBS'; }

  public static get SHOW_OVERLAY(): string { return 'SHOW_OVERLAY'; }

  public static get SET_OVERLAY_TEXT(): string { return 'SET_OVERLAY_TEXT'; }

  public static get HIDE_OVERLAY(): string { return 'HIDE_OVERLAY'; }

}