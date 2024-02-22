import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";
import { FileItem } from "../../redux/reducers/ide/fileSystemReducer";
import { toast } from "react-toastify";

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
        toast.error("파일 목록을 불러올 수 없습니다.");
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
        console.error("파일 목록을 불러올수 없습니다.");
      }
    }
    return null;
  }
};
