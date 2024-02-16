import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/ide";

interface RequestDTO {
  data: AcceptInvite;
}

export interface AcceptInvite {
  projectId: number;
  hostMemberId: number;
  invitedMemberId: number;
}

// projectList 가져오는 메서드
export const postParticipateProject = async (
  invite: AcceptInvite
): Promise<boolean> => {
  const storedToken = localStorage.getItem("accessToken");
  if (!storedToken) {
    console.error("Access token not found. Please login again.");
    return false;
  }
  const config = {
    headers: {
      Authorization: `Bearer ${storedToken}`,
    },
  };
  const request: RequestDTO = {
    data: invite,
  };
  console.log(request);
  try {
    const response = await axios.post(
      `${USER_API_URL}/participate-project`,
      request,
      config
    );
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(
        "Failed to fetch project list with status code:",
        response.status
      );
      return false;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      if (error.response?.status === 401) {
        const isTokenRefreshed = await patchAccessToken();
        if (isTokenRefreshed) {
          return postParticipateProject(invite);
        }
      }
    } else {
      console.error("유효하지 않은 접근입니다. 로그인을 진행해 주세요", error);
    }

    return false;
  }
};
