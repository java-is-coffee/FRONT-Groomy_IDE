import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080";

interface IMemberInvite {
  inviteMembers: number[];
}

interface IMemberInviteDTO {
  data: IMemberInvite;
}

export const postInviteMembers = async (
  projectId: number,
  memberIds: number[]
): Promise<boolean> => {
  console.log("projectList fetching...");
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
  const members: IMemberInvite = {
    inviteMembers: memberIds,
  };

  const request: IMemberInviteDTO = {
    data: members,
  };
  try {
    const response = await axios.post(
      `${USER_API_URL}/api/ide/inviteMembers/${projectId}`,
      request,
      config
    );
    if (response.status === 200) {
      return true;
    } else {
      console.error(
        "Failed to fetch member list with status code:",
        response.status
      );
      return false;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching project list:", error.response?.data);
      if (error.response?.status === 401) {
        const isTokenRefreshed = await patchAccessToken();
        if (isTokenRefreshed) {
          return postInviteMembers(projectId, memberIds);
        }
      } else {
        console.error();
      }
    }

    return false;
  }
};
