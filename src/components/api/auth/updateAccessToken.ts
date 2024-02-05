import axios from "axios";
import { Status } from "../status";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/member";

interface RefreshToken {
  refreshToken: string;
}

interface TokenDTO {
  status: Status;
  data: Token;
}

interface Token {
  grantType: string;
  accessToken: string;
  refreshToken: string;
}

// 토큰 리프레쉬 메서드
export const updateAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      return false;
    }
    const refreshTokenBody: RefreshToken = {
      refreshToken: refreshToken,
    };
    const response = await axios.post<TokenDTO>(
      `${USER_API_URL}/refresh`,
      refreshTokenBody
    );
    const tokens: Token = response.data.data;
    // 토큰 갱신 성공
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
    return true;
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    console.error("토큰 만료 재로그인 해주세요", error);
    return false;
  }
};
