import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";
import { toast } from "react-toastify";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080";

export const deleteProjectMember = async (
  projectId: number,
  memberId: number
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
  try {
    const response = await axios.delete(
      `${USER_API_URL}/api/ide/kick/${projectId}/${memberId}`,
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
        const isTokenUpdate = await patchAccessToken();
        if (isTokenUpdate) {
          return deleteProjectMember(projectId, memberId);
        }
      } else if (error.response?.status === 400) {
        toast.error("루트 사용자만 멤버 조작이 가능합니다.");
      } else {
        // 유저에게 메시지 전달
        toast("유저 목록을 불러오는데 오류가 발생했습니다.");
      }
    }
    return false;
  }
};
