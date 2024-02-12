import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/board";

export interface BoardDetails {
  boardId: number;
  memberId: number;
  title: string;
  nickname: string;
  content: string;
  viewNumber: number;
  commentNumber: number;
  scrapNumber: number;
  createdTime: string;
  helpNumber: number;
  isCompleted: boolean;
}

export interface ContentId {
  contentId: number | null;
}

//prop으로 넘기기
// projectList 가져오는 메서드
export const patchBoardContent = async ({
  contentId,
}: ContentId): Promise<BoardDetails | null> => {
  const storedToken = localStorage.getItem("accessToken");

  const content: ContentId = {
    contentId: contentId,
  };
  console.log(`${USER_API_URL}/content/${contentId}`);
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
    const response = await axios.get<BoardDetails>(
      `${USER_API_URL}/content/${contentId}`,
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
          return patchBoardContent(content);
        }
      }
    } else {
      console.error("게시판 로드 실패", error);
    }

    return null;
  }
};
