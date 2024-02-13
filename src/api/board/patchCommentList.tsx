import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/comment/board";

export interface CommentDetails {
  boardId: number;
  commentId: number;
  content: string;
  nickname: string;
  helpNumber: number;
  createdTime: string;
  originComment: number | null;
  memberId: number;
  commentStatus: string;
}

export interface BoardId {
  boardId: number | null;
}

export const patchCommentList = async ({
  boardId,
}: BoardId): Promise<CommentDetails[] | null> => {
  const storedToken = localStorage.getItem("accessToken");
  const tempBoardId: BoardId = {
    boardId: boardId,
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
    const response = await axios.get<CommentDetails[]>(
      `${USER_API_URL}/${boardId}`,
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
          return patchCommentList(tempBoardId);
        }
      }
    } else {
      console.error("댓글 로드 실패", error);
    }

    return null;
  }
};
