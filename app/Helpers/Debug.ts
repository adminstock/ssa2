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
 * Provides the output records in the browser console, if the application is assembled in the development mode.
 */
export default class Debug {

  public static get LogLevels(): Array<{ [key: string]: any }> {
    if (DEV_MODE) {
      return LOG_LEVELS;
    }
  }

  public static Log(message?: any, ...params: any[]): void {
    if (DEV_MODE) { Debug.Level('log', message, params); }
  }

  public static Level1(message?: any, ...params: any[]): void {
    if (DEV_MODE) { Debug.Level('level1', message, params); }
  }

  public static Level2(message?: any, ...params: any[]): void {
    if (DEV_MODE) { Debug.Level('level2', message, params); }
  }

  public static Level3(message?: any, ...params: any[]): void {
    if (DEV_MODE) { Debug.Level('level3', message, params); }
  }

  public static Init(message?: any, ...params: any[]): void {
    if (DEV_MODE) { Debug.Level('init', message, params); }
  }

  public static Init1(message?: any, ...params: any[]): void {
    if (DEV_MODE) { Debug.Level('init1', message, params); }
  }

  public static Init2(message?: any, ...params: any[]): void {
    if (DEV_MODE) { Debug.Level('init2', message, params); }
  }

  public static Init3(message?: any, ...params: any[]): void {
    if (DEV_MODE) { Debug.Level('init3', message, params); }
  }

  public static Call(message?: any, ...params: any[]): void {
    if (DEV_MODE) { Debug.Level('call', message, params); }
  }

  public static Call1(message?: any, ...params: any[]): void {
    if (DEV_MODE) { Debug.Level('call1', message, params); }
  }

  public static Call2(message?: any, ...params: any[]): void {
    if (DEV_MODE) { Debug.Level('call2', message, params); }
  }

  public static Call3(message?: any, ...params: any[]): void {
    if (DEV_MODE) { Debug.Level('call3', message, params); }
  }

  public static Render(message?: any, ...params: any[]): void {
    if (DEV_MODE) { Debug.Level('render', message, params); }
  }

  public static Render1(message?: any, ...params: any[]): void {
    if (DEV_MODE) { Debug.Level('render1', message, params); }
  }

  public static Render2(message?: any, ...params: any[]): void {
    if (DEV_MODE) { Debug.Level('render2', message, params); }
  }

  public static Render3(message?: any, ...params: any[]): void {
    if (DEV_MODE) { Debug.Level('render3', message, params); }
  }

  public static Error(message?: any, ...params: any[]): void {
    if (DEV_MODE) {
      console.error = Function.bind.call(console.error, console);
      console.error.apply(this, arguments);
    }
  }

  public static Warn(message?: any, ...params: any[]): void {
    Debug.Warning.apply(this, arguments);
  }

  public static Warning(message?: any, ...params: any[]): void {
    if (DEV_MODE) {
      console.warn = Function.bind.call(console.warn, console);
      console.warn.apply(this, arguments);
    }
  }

  public static Info(message?: any, ...params: any[]): void {
    if (DEV_MODE) {
      console.info = Function.bind.call(console.info, console);
      console.info.apply(this, arguments);
    }
  }

  private static Level(level: string, message?: any, ...params: any[]) {
    if (DEV_MODE) {
      if (Debug.LogLevels['all'] != undefined || Debug.LogLevels[level] != undefined) {
        console.log = Function.bind.call(console.log, console);

        if (level == 'log') {
          console.log(arguments);
        }

        let args: Array<any> = Array.prototype.slice.call(arguments);

        // remove <level>
        args.shift();

        if (args && args.length > 0) {
          if (typeof args[0] === 'object' && args[0].constructor && args[0].constructor.name) {
            args.splice(0, 1, '%c' + level + ':%c ' + args[0].constructor.name);
          } else {
            args.splice(0, 1, '%c' + level + ':%c ' + args[0]);
          }

          if (args.length > 1 && $.isArray(args[1])) {
            // move items to external array
            let a = args[1];
            args.splice(1, 1);
            args = args.concat(a);
          }

          if ($.isArray(Debug.LogLevels[level])) {
            args.splice(1, 0, Debug.LogLevels[level][0]);

            if (Debug.LogLevels[level][1] != null && Debug.LogLevels[level][1] != '') {
              args.splice(2, 0, Debug.LogLevels[level][1]);
            } else {
              args.splice(2, 0, 'color: black;');
            }
          } else {
            args.splice(1, 0, 'background-color: #999999; color:white;');
          
            if (Debug.LogLevels[level] != null && Debug.LogLevels[level] != '') {
              args.splice(2, 0, Debug.LogLevels[level]);
            } else {
              args.splice(2, 0, 'color: black;');
            }
          }
        }

        // console.log(args);

        console.log.apply(this, args);
      }
    }
  }

}

module.exports = Debug;