import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";
import { BoardDetails } from "../../redux/reducers/boardReducer";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/board/write";

export interface NewBoard {
  memberId: number;
  nickname: string;
  title: string;
  content: string;
  completed: boolean;
}

interface NewBoardDTO {
  data: NewBoard;
}

export const postNewBoard = async (
  inputDTO: NewBoard
): Promise<BoardDetails | null> => {
  const storedToken = localStorage.getItem("accessToken");

  const inputData: NewBoard = {
    memberId: inputDTO.memberId,
    nickname: inputDTO.nickname,
    title: inputDTO.title,
    content: inputDTO.content,
    completed: inputDTO.completed,
  };

  const requestDTO: NewBoardDTO = {
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
    const response = await axios.post<BoardDetails>(
      `${USER_API_URL}`,
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
          return postNewBoard(inputData);
        }
      }
    } else {
      console.error("게시판 로드 실패", error);
    }

    return null;
  }
};
//
