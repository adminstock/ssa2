/**
 * Represents information about an operating system.
 */
export default class OperatingSystem {

  /** Name. For example: Windows 7, Debian, Ubuntu, OS X. */
  public Name: string;

  public CodeName: string;

  /** Identifier of the operating system. For example: Unix, MacOSX, Win32 */
  public Platform: string;

  /** Version number of the operating system. For example: 6.1.7601 */
  public Version: string;

}