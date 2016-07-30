/**
 * Implements state of the login dialog.
 */
export interface ILoginState {

  Checking?: boolean;

  LoginProcessing?: boolean;

  ShowDialog?: boolean;

  ShowForm?: boolean;

  ValidationStateUsername?: string;

  ValidationStatePassword?: string;

  Username?: string;

  Password?: string;

}

export default ILoginState;