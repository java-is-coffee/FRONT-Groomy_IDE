import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/ide/delete";

export const deleteProject = async (projectId: number): Promise<boolean> => {
  const storedToken = localStorage.getItem("accessToken");
  if (!storedToken) {
    console.error("Refresh token not found. Please login again.");
    return false;
  }
  const config = {
    headers: {
      Authorization: `Bearer ${storedToken}`,
    },
  };
  try {
    const response = await axios.delete(`${USER_API_URL}/${projectId}`, config);
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching project list:", error.response?.data);
      if (error.response?.status === 401) {
        const isTokenRefreshed = await patchAccessToken();
        if (isTokenRefreshed) {
          return deleteProject(projectId);
        }
      }
    } else {
      console.error(
        "An unexpected error occurred while fetching project list:",
        error
      );
    }

    return false;
  }
};
