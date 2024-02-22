import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/ide";

interface NewProjectDTO {
  data: IProjectDetails;
}

export interface IProjectDetails {
  projectName: string;
  memberId: number;
  language: string;
  description: string;
}

// projectList 가져오는 메서드
export const patchProjectDetails = async (
  projectId: number,
  editedProject: IProjectDetails
): Promise<IProjectDetails | null> => {
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
  const request: NewProjectDTO = {
    data: editedProject,
  };
  try {
    const response = await axios.patch(
      `${USER_API_URL}/edit/${projectId}`,
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
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      if (error.response?.status === 401) {
        const isTokenRefreshed = await patchAccessToken();
        if (isTokenRefreshed) {
          return patchProjectDetails(projectId, editedProject);
        }
      }
    } else {
      console.error("유효하지 않은 접근입니다. 로그인을 진행해 주세요", error);
    }

    return null;
  }
};
