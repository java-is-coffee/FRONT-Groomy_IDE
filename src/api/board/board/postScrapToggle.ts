import axios from "axios";
import { patchAccessToken } from "../../auth/patchAccessToken";
import { BoardDetails } from "../../../redux/reducers/boardReducer";

const USER_API_URL_BOARD =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/board/scrap";

export const postScrapToggle = async (
  ID: number
): Promise<BoardDetails | null> => {
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
    const response = await axios.post<BoardDetails>(
      `${USER_API_URL_BOARD}/${ID}`,
      {},
      config
    );

    if (response.status === 200) {
      console.log("통신 성공");
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
      console.error("Error fetching data:", error.response?.data);
      if (error.response?.status === 400) {
        return null;
      }
      if (error.response?.status === 401) {
        const isTokenRefreshed = await patchAccessToken();
        if (isTokenRefreshed) {
          return postScrapToggle(ID);
        }
      }
    } else {
      console.error("게시판 로드 실패", error);
    }

    return null;
  }
};
//
