import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/member";

interface RequestMemberDTO {
  data: MemberEmail;
}
interface MemberEmail {
  email: string;
}

export interface SearchedMember {
  memberId: number;
  email: string;
  nickname: string;
}

// member info 가져오는 메서드
export const searchMemberByEmail = async (
  searchEmail: string
): Promise<SearchedMember | null> => {
  const storedToken = localStorage.getItem("accessToken");
  if (!storedToken) {
    console.error("token token not found. Please login again.");
    return null;
  }
  const config = {
    headers: {
      Authorization: `Bearer ${storedToken}`,
    },
  };
  const memberEmail: MemberEmail = {
    email: searchEmail,
  };
  const request: RequestMemberDTO = {
    data: memberEmail,
  };
  try {
    const response = await axios.post<SearchedMember>(
      `${USER_API_URL}/findByEmail`,
      request,
      config
    );
    if (response.status === 200) {
      if (response.data) {
        return response.data;
      } else {
        return null;
      }
    }
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        patchAccessToken();
      } else {
        // 유저에게 메시지 전달
        console.log("유효하지 않은 접근입니다. 로그인을 진행해 주세요");
      }
    }
    return null;
  }
};
