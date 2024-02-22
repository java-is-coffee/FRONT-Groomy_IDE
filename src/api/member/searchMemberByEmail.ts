import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";
import { toast } from "react-toastify";

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
        toast("유저 목록을 불러오는데 오류가 발생했습니다.");
      }
    }
    return null;
  }
};
