import OperatingSystem from 'OperatingSystem';

/**
 * Represents server info.
 */
export default class Server {

  /** Config file name. */
  public Config: string;

  /** Server name. */
  public Name: string;

  /** Server description. */
  public Description: string;

  /** SSH host or IP address. */
  public Address: string;

  /** SSH port. Default: 22. */
  public Port: number;

  /** SSH username. */
  public Username: string;

  /** SSH password. */
  public Password: string;

  /** Use password for all commands. */
  public RequiredPassword: boolean;

  /** Status. */
  public Disabled: boolean;

  /** List of modules. */
  // public Modules: Array<Module>;

  /** Address to which the user will be redirected after logout. */
  public LogoutRedirect: string;

  public OperatingSystem: OperatingSystem;

}