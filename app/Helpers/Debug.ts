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

/**
 * Provides the output records in the browser console, if the application is assembled in the development mode.
 */
export default class Debug {

  public static Log(message?: any, ...params: any[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log = Function.bind.call(console.log, console);
      console.log.apply(this, arguments);
    }
  }

  public static Error(message?: any, ...params: any[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.error = Function.bind.call(console.error, console);
      console.error.apply(this, arguments);
    }
  }

  public static Warn(message?: any, ...params: any[]): void {
    Debug.Warning.apply(this, arguments);
  }

  public static Warning(message?: any, ...params: any[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.warn = Function.bind.call(console.warn, console);
      console.warn.apply(this, arguments);
    }
  }

  public static Info(message?: any, ...params: any[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.info = Function.bind.call(console.info, console);
      console.info.apply(this, arguments);
    }
  }

}

module.exports = Debug;