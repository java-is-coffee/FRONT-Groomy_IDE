import axios from "axios";
import { updateAccessToken } from "./updateAccessToken";
import { Status } from "../status";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/member";

interface MemberDTO {
  status: Status;
  data: MemberInfo;
}

export interface MemberInfo {
  memberId: number;
  email: string;
  name: string;
  nickname: string;
  helpNumber: number;
  role: string;
}

// member info 가져오는 메서드
export const getMemberInfo = async (): Promise<boolean> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.get(`${USER_API_URL}/my`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const memberInfo: MemberInfo = response.data.data;
    // 성공적으로 멤버 정보를 받아온 경우, sessionStorage에 저장
    sessionStorage.setItem("member", JSON.stringify(memberInfo));
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // AccessToken 갱신
      const updated = await updateAccessToken();
      if (updated) {
        return getMemberInfo();
      } else {
        return false;
      }
    }
    return false;
  }
};
