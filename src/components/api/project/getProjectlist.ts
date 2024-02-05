import axios from "axios";
import { Status } from "../status";
import { updateAccessToken } from "../auth/updateAccessToken";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/ide";

export interface ProjectDetails {
  projectId: number;
  memberId: number;
  projectName: string;
  description: string;
  language: string;
  createdDate: string;
  deleted: boolean;
  projectPath: string;
}

interface ProjectListDTO {
  status: Status;
  data: ProjectDetails[];
}

// projectList 가져오는 메서드
export const getProjectList = async (): Promise<ProjectDetails[] | null> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.get<ProjectListDTO>(`${USER_API_URL}/list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const projects: ProjectDetails[] = response.data.data;
    return projects;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // AccessToken 갱신
      const updated = await updateAccessToken();
      if (updated) {
        return getProjectList();
      } else {
        return null;
      }
    }
    return null;
  }
};
//     const status: Status = response.data.status;
//     const memberInfo: MemberInfo = response.data.data;

//     if (status.code === 401) {
//       // AccessToken 갱신
//       const updated = await updateAccessToken();
//       if (updated) {
//         return getMemberInfo();
//       } else {
//         return false;
//       }
//     }

//     // 성공적으로 멤버 정보를 받아온 경우, sessionStorage에 저장
//     sessionStorage.setItem("member", JSON.stringify(memberInfo));
//     return true;
//   } catch (error) {
//     console.error("서버 오류입니다.", error);
//     return false;
//   }
