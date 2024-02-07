import axios from "axios";
import { patchAccessToken } from "./patchAccessToken";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/member";

export interface MemberInfo {
  memberId: number;
  email: string;
  name: string;
  nickname: string;
  helpNumber: number;
  role: string;
}

// member info 가져오는 메서드
export const getMemberInfo = async (): Promise<MemberInfo | null> => {
  try {
    console.log("member fetching...");
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      // 유저에게 토큰 오류 보여주기
      console.error("Access token not found. Please login.");
      return null;
    }
    const response = await axios.get<MemberInfo>(`${USER_API_URL}/my`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const member: MemberInfo = response.data;
    if (response.status === 200) {
      return member;
    } else {
      // error 메시지
      console.error(
        "Failed to fetch member info with status code:",
        response.status
      );
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      if (error.response?.status === 401) {
        // 리프레쉬 확인로그
        console.log("Access token expired. Attempting to refresh...");
        const isTokenRefreshed = await patchAccessToken();
        if (isTokenRefreshed) {
          return getMemberInfo();
        }
      }
      // 리프레쉬 불가
      console.error("Error fetching member info:", error.response?.data);
    } else {
      // 다른 에러
      console.error("An unexpected error occurred:", error);
    }

    return null;
  }
};
