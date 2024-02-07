import axios from "axios";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/member";

interface RequestDTO {
  data: RefreshToken;
}

interface RefreshToken {
  refreshToken: string | null;
}

interface ResponseTokenDTO {
  grantType: string;
  accessToken: string;
  refreshToken: string;
}

// 토큰 리프레쉬 메서드
export const patchAccessToken = async () => {
  const storedToken = localStorage.getItem("refreshToken");
  if (!storedToken) {
    console.error("Refresh token not found. Please login again.");
    return false;
  }
  const requestToken: RefreshToken = {
    refreshToken: storedToken,
  };
  const request: RequestDTO = {
    data: requestToken,
  };
  try {
    const response = await axios.post<ResponseTokenDTO>(
      `${USER_API_URL}/refresh`,
      request
    );
    const newToken: ResponseTokenDTO = response.data;

    localStorage.setItem("accessToken", newToken.accessToken);
    localStorage.setItem("refreshToken", newToken.refreshToken);
    // 토큰 리프레쉬 완료
    console.log("Token refreshed successfully");
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Error response from server:", error.response);
    } else {
      console.error("An error occurred while refreshing token", error);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    return false;
  }
};
