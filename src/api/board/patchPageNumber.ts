import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";
const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/board";

// projectList 가져오는 메서드
export const patchPageNumber = async (): Promise<number | null> => {
  console.log("페이지 불러오기?");
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
    const response = await axios.get<number>(
      `${USER_API_URL}/page-number`,
      config
    );
    if (response.status === 200) {
      console.log("페이지 불러오기");
      return response.data;
    } else {
      console.error(
        "Failed to fetch board Number with status code:",
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
          return patchPageNumber();
        }
      }
    } else {
      console.error("게시판 갯수 세기 실패", error);
    }

    return null;
  }
};
