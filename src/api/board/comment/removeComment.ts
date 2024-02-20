import axios from "axios";
import { patchAccessToken } from "../../auth/patchAccessToken";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/comment/delete";

export const removeComment = async (commentId: number) => {
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
    const response = await axios.delete(`${USER_API_URL}/${commentId}`, config);
    console.log("삭제 절차 실행");

    if (response.status === 200) {
      console.log("댓글 삭제");
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
          return;
        }
      }
    } else {
      console.error("게시판 로드 실패", error);
    }

    return null;
  }
};
//
