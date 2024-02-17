import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";
import { FileItem } from "../../redux/reducers/ide/fileSystemReducer";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/file";

interface projectId {
  projectId: string;
}

interface requestFileTree {
  data: projectId;
}

// 프로젝트 파일 가져오는 메서드
export const getFileTree = async (
  projectId: string
): Promise<FileItem[] | null> => {
  console.log(projectId);
  const storedToken = localStorage.getItem("accessToken");
  if (!storedToken) {
    console.error("token token not found. Please login again.");
    return null;
  }
  const config = {
    headers: {
      Authorization: `Bearer ${storedToken}`,
    },
  };
  const request: requestFileTree = {
    data: {
      projectId: projectId,
    },
  };
  try {
    const response = await axios.post<FileItem[]>(
      `${USER_API_URL}/list`,
      request,
      config
    );
    const fileTree = response.data;
    console.log(fileTree);
    if (response.status === 200) {
      if (fileTree) {
        return fileTree;
      } else {
        return null;
      }
    }
    return null;
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
    return null;
  }
};
