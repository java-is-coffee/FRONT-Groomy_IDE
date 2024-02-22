import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";
import { toast } from "react-toastify";
import { IMember } from "./imemberDTO";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080";

// projectList 가져오는 메서드
export const getProjectMemberList = async (
  projectId: number
): Promise<IMember[] | null> => {
  console.log("projectList fetching...");
  const storedToken = localStorage.getItem("accessToken");
  if (!storedToken) {
    console.error("Access token not found. Please login again.");
    return null;
  }
  const config = {
    headers: {
      Authorization: `Bearer ${storedToken}`,
    },
  };
  try {
    const response = await axios.get<IMember[]>(
      `${USER_API_URL}/api/ide/member-list/${projectId}`,
      config
    );
    const curMembers: IMember[] = response.data;
    if (response.status === 200) {
      return curMembers;
    } else {
      console.error(
        "Failed to fetch member list with status code:",
        response.status
      );
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching project list:", error.response?.data);
      if (error.response?.status === 401) {
        const isTokenRefreshed = await patchAccessToken();
        if (isTokenRefreshed) {
          return getProjectMemberList(projectId);
        }
      }
    } else {
      toast.error("목록을 불러올 수 없습니다.");
    }

    return null;
  }
};
