import axios from "axios";
import { patchAccessToken } from "../../auth/patchAccessToken";
import { CommentDetails } from "../getCommentList";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/comment/write";

export interface CommentDetail {
  boardId: number;
  content: string;
  nickname: string;
  originComment: number | null;
  memberId: number;
}

interface CommentDTO {
  data: CommentDetail;
}

//prop으로 넘기기
// projectList 가져오는 메서드
export const newReply = async (
  commentDTO: CommentDetail,
  originCommentId: number
): Promise<CommentDetail | null> => {
  const storedToken = localStorage.getItem("accessToken");

  const inputData: CommentDetail = {
    boardId: commentDTO.boardId,
    content: commentDTO.content,
    nickname: commentDTO.nickname,
    originComment: originCommentId,
    memberId: commentDTO.memberId,
  };

  const requestDTO: CommentDTO = {
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
    const response = await axios.post<CommentDetails>(
      `${USER_API_URL}/${commentDTO.boardId}`,
      requestDTO,
      config
    );

    if (response.status === 200) {
      console.log("대댓글 작성");
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
          return newReply(commentDTO, originCommentId);
        }
      }
    } else {
      console.error("게시판 로드 실패", error);
    }

    return null;
  }
};
