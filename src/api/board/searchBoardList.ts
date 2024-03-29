import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";
import { BoardDetails } from "../../redux/reducers/boardReducer";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/board/search";

export interface PageNumber {
  page: number | null;
}

//prop으로 넘기기
// projectList 가져오는 메서드
export const searchBoardList = async (
  page: number,
  searchData: string,
  completed: string
): Promise<BoardDetails[] | null> => {
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
    const completedSet = completed === "completed" ? true : false;

    const reqeustUrl =
      completed === "all"
        ? `${USER_API_URL}/${page}?search_keyword=${searchData}`
        : `${USER_API_URL}/${page}?search_keyword=${searchData}&completed=${completedSet}`;

    const response = await axios.get<BoardDetails[]>(reqeustUrl, config);

    if (response.status === 200) {
      console.log("검색 페이지 불러오기");
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching project list:", error.response?.data);
      if (error.response?.status === 401) {
        const isTokenRefreshed = await patchAccessToken();
        if (isTokenRefreshed) {
          return searchBoardList(page, searchData, completed);
        }
      }
    } else {
      console.error("게시판 로드 실패", error);
    }

    return null;
  }
};
