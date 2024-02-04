import { EnumType } from "typescript";
import * as actionTypes from "../actions/authAction";
import { access } from "fs";

/*
  dispatch 예시
  로그인시
  const dispatch = useDispatch();
  dispatch({
    type: 'LOGIN',
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
  
  store에서 가져오기
  const {auth} = store.getState();
 */

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string;
  refreshToken: string;
}

type AuthAction =
  | {
      type: typeof actionTypes.LOGIN;
      accessToken: string;
      refreshToken: string;
    }
  | { type: typeof actionTypes.LOGOUT };

const initialState: AuthState = {
  isLoggedIn: false,
  accessToken: "",
  refreshToken: "",
};

const authReducer = (
  state: AuthState | undefined = initialState,
  action: AuthAction
) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        accessToken: "",
        refreshToken: "",
      };
    default:
      return state || initialState;
  }
};

export default authReducer;
