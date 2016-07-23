declare module 'debug' {

  export = Debug;

}

/**
 * Provides the output records in the browser console, if the application is assembled in the development mode.
 */
interface DebugStatic {
  Write(message?: any, ...params: any[]): void;
  WriteLine(message?: any, ...params: any[]): void;
  Add(message?: any, ...params: any[]): void;
  Log(message?: any, ...params: any[]): void;
  Error(message?: any, ...params: any[]): void;
  Warn(message?: any, ...params: any[]): void;
  Warning(message?: any, ...params: any[]): void;
  Info(message?: any, ...params: any[]): void;
}

/**
 * Provides the output records in the browser console, if the application is assembled in the development mode.
 */
declare var Debug: DebugStatic;