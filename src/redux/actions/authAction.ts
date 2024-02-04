// type 정의
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

interface LoginAction {
  type: typeof LOGIN;
  accessToken: string;
  refreshToken: string;
}
interface LogoutAction {
  type: typeof LOGOUT;
}

export type AuthActionTypes = LoginAction | LogoutAction;

export const login = (
  accessToken: string,
  refreshToken: string
): AuthActionTypes => {
  return {
    type: LOGIN,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

export const logout = (): AuthActionTypes => {
  return {
    type: LOGOUT,
  };
};
