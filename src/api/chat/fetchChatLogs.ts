import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";

// API URL 설정
const BaseURL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080";

// 채팅 로그 데이터 인터페이스
export interface ChatLog {
  name: string;
  email: string;
  message: string;
  createdTime: string;
}

// 채팅 로그를 가져오는 비동기 함수
export const fetchChatLogs = async (
  projectId: string,
  paging: number
): Promise<ChatLog[] | null> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.log("로그인을 진행해주세요");
      return null;
    }

    const response = await axios.get(
      `${BaseURL}/api/chat/project/logs/${projectId}/${paging}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const chatLog: ChatLog[] = response.data;
    if (response.status === 200 && response.data) {
      return chatLog;
    } else {
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.log("Access token expired. Attempting to refresh...");
        const isTokenRefeshed = await patchAccessToken();
        fetchChatLogs(projectId, paging);
        if (isTokenRefeshed) {
          fetchChatLogs(projectId, paging);
        }
      }
    }
    console.error("Failed to fetch chat logs:", error);
    return null;
  }
};
