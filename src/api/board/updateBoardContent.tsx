import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";
import { BoardDetails } from "../../redux/reducers/boardReducer";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/board/edit";

export interface UpdateBoard {
  memberId: number;
  nickname: string;
  title: string;
  content: string;
  completed: boolean;
}

interface UpdateBoardDTO {
  data: UpdateBoard;
}

export const updateBoardContent = async (
  inputDTO: UpdateBoard,
  boardId: number
): Promise<BoardDetails | null> => {
  const storedToken = localStorage.getItem("accessToken");
  console.log("수정 시작");
  console.log(inputDTO);
  console.log(boardId);

  const inputData: UpdateBoard = {
    memberId: inputDTO.memberId,
    nickname: inputDTO.nickname,
    title: inputDTO.title,
    content: inputDTO.content,
    completed: inputDTO.completed,
  };

  const requestDTO: UpdateBoardDTO = {
    data: inputData,
  };

  console.log(`${USER_API_URL}/${boardId}`);
  console.log(requestDTO);
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
      `${USER_API_URL}/${boardId}`,
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
          return updateBoardContent(inputData, boardId);
        }
      }
    } else {
      console.error("게시판 로드 실패", error);
    }

    return null;
  }
};
//
