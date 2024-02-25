import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/ide";

export interface ProjectDetails {
  name(name: any): unknown;
  projectId: number;
  memberId: number;
  projectName: string;
  description: string;
  language: string;
  createdDate: string;
  deleted: boolean;
  projectPath: string;
}

// projectList 가져오는 메서드
export const patchProjectList = async (): Promise<ProjectDetails[] | null> => {
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
    const response = await axios.get<ProjectDetails[]>(
      `${USER_API_URL}/list`,
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
      console.error("Error fetching project list:", error.response?.data);
      if (error.response?.status === 401) {
        const isTokenRefreshed = await patchAccessToken();
        if (isTokenRefreshed) {
          return patchProjectList();
        }
      }
    } else {
      console.error(
        "An unexpected error occurred while fetching project list:",
        error
      );
    }

    return null;
  }
};
