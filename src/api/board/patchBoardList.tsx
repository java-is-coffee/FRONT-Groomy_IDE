import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";
import { BoardDetails } from "../../redux/reducers/boardReducer";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/board";

export interface PageNumber {
  page: number | null;
}

//prop으로 넘기기
// projectList 가져오는 메서드
export const patchBoardList = async ({
  page,
}: PageNumber): Promise<BoardDetails[] | null> => {
  const storedToken = localStorage.getItem("accessToken");
  const pageNumber: PageNumber = {
    page: page,
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
    const response = await axios.get<BoardDetails[]>(
      `${USER_API_URL}/${page}`,
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
          return patchBoardList(pageNumber);
        }
      }
    } else {
      console.error("게시판 로드 실패", error);
    }

    return null;
  }
};
