import { BoardDetails } from "../../redux/reducers/boardReducer";
import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";

const getScrappedBoard = async (
  page: number
): Promise<BoardDetails[] | null> => {
  const BASE_URL =
    "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/board/scrap/list/";

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
    const reqeustURL = BASE_URL + page;
    const response = await axios.get(reqeustURL, config);

    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    } else {
      console.log("통신 실패");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching project list:", error.response?.data);
      if (error.response?.status === 401) {
        const isTokenRefreshed = await patchAccessToken();
        if (isTokenRefreshed) {
          return getScrappedBoard(page);
        }
      }
    } else {
      console.error("게시판 로드 실패", error);
    }
  }

  return null;
};

export default getScrappedBoard;
