declare module 'debug' {

  export = Debug;

}

/**
 * Provides the output records in the browser console, if the application is assembled in the development mode.
 */
interface DebugStatic {

  DEV_MODE(): boolean;

  Log(message?: any, ...params: any[]): void;
  Level1(message?: any, ...params: any[]): void;
  Level2(message?: any, ...params: any[]): void;
  Level3(message?: any, ...params: any[]): void;


  Init(message?: any, ...params: any[]): void;
  Init1(message?: any, ...params: any[]): void;
  Init2(message?: any, ...params: any[]): void;
  Init3(message?: any, ...params: any[]): void;

  Call(message?: any, ...params: any[]): void;
  Call1(message?: any, ...params: any[]): void;
  Call2(message?: any, ...params: any[]): void;
  Call3(message?: any, ...params: any[]): void;

  Render(message?: any, ...params: any[]): void;
  Render1(message?: any, ...params: any[]): void;
  Render2(message?: any, ...params: any[]): void;
  Render3(message?: any, ...params: any[]): void;

  Request(message?: any, ...params: any[]): void;
  Response(message?: any, ...params: any[]): void;

  Action(message?: any, ...params: any[]): void;
  Reducer(message?: any, ...params: any[]): void;

  Error(message?: any, ...params: any[]): void;
  Warn(message?: any, ...params: any[]): void;
  Warning(message?: any, ...params: any[]): void;
  Info(message?: any, ...params: any[]): void;

}

/**
 * Provides the output records in the browser console, if the application is assembled in the development mode.
 */
declare var Debug: DebugStatic;