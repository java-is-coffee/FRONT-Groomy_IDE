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
export const getTempToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem("refreshToken");
  const storedAccessToken = localStorage.getItem("accessToken");
  if (!refreshToken && !storedAccessToken) {
    console.error("Refresh token not found. Please login again.");
    return null;
  }
  const config = {
    headers: {
      Authorization: `Bearer ${storedAccessToken}`,
    },
  };
  const requestToken: RefreshToken = {
    refreshToken: refreshToken,
  };
  const request: RequestDTO = {
    data: requestToken,
  };
  try {
    const response = await axios.post<ResponseTokenDTO>(
      `${USER_API_URL}/tempToken`,
      request,
      config
    );
    const newToken: ResponseTokenDTO = response.data;
    // 토큰 리프레쉬 완료
    console.log("get Temp token successfully");
    return newToken.accessToken;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Error response from server:", error.response);
    } else {
      console.error("An error occurred while refreshing token", error);
    }
    return null;
  }
};
