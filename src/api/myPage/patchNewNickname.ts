import axios from "axios";

export interface NewUserInfo {
  memberId: number;
  email: string;
  name: string;
  nickname: string;
  helpNumber: number;
  role: string;
}

export interface NewUserDTO {
  data: NewUserInfo;
}

const BASE_URL: string =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/member/my/edit";

const patchNewNickname = async (inputData: NewUserInfo) => {
  const requestDTO: NewUserDTO = {
    data: inputData,
  };

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

  console.log(requestDTO);
  try {
    const response = await axios.patch(BASE_URL, requestDTO, config);

    if (response.status === 200) return response.data;
    else return null;
  } catch (error) {
    alert("네트워크 오류 발생");
    console.log("데이터 전송 실패");
  }
};

export default patchNewNickname;
