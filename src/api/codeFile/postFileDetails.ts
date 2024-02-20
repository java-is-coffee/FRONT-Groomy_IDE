import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";

const BASE_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080";

export interface ISaveItem {
  projectId: string;
  fileName: string;
  filePath: string;
  content: string;
  type: "FILE" | "FOLDER";
}

interface requestFileTree {
  data: ISaveItem;
}

// 프로젝트 파일 가져오는 메서드
export const postFileDetails = async (
  fileItem: ISaveItem
): Promise<boolean> => {
  const storedToken = localStorage.getItem("accessToken");
  if (!storedToken) {
    console.error("token token not found. Please login again.");
    return false;
  }
  const config = {
    headers: {
      Authorization: `Bearer ${storedToken}`,
    },
  };
  const request: requestFileTree = {
    data: fileItem,
  };
  try {
    const response = await axios.post(
      `${BASE_URL}/api/file/create`,
      request,
      config
    );
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        patchAccessToken();
      } else {
        // 유저에게 메시지 전달
        console.log(status);
        console.log("유효하지 않은 접근입니다. 로그인을 진행해 주세요");
      }
    }
    return false;
  }
};
