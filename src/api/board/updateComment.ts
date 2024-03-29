import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";
import { BoardDetails } from "../../redux/reducers/boardReducer";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/comment/edit";

export interface UpdateComent {
  nickname: string;
  content: string;
}

interface UpdateCommentDTO {
  data: UpdateComent;
}

export const updateComment = async (
  inputDTO: UpdateComent,
  commentId: number
): Promise<BoardDetails | null> => {
  const storedToken = localStorage.getItem("accessToken");
  console.log("수정 시작");

  const inputData: UpdateComent = {
    nickname: inputDTO.nickname,
    content: inputDTO.content,
  };

  const requestDTO: UpdateCommentDTO = {
    data: inputData,
  };

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
    const response = await axios.patch<BoardDetails>(
      `${USER_API_URL}/${commentId}`,
      requestDTO,
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
          return updateComment(inputData, commentId);
        }
      }
    } else {
      console.error("댓글 로드 실패", error);
    }

    return null;
  }
};
//
