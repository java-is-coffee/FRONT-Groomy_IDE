import axios from "axios";

const BASE_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/member/login/reset-password";

export interface ResetData {
  name: string;
  email: string;
}

export interface ResetDTO {
  data: ResetData;
}

const postResetPassword = async (inputData: ResetDTO) => {
  try {
    const response = await axios.post(BASE_URL, inputData);

    const code = response.status;

    if (code === 200) {
      return "success";
    } else return "fail";
  } catch (error) {
    alert("네트워크 오류 발생. 잠시 뒤, 이용해주세요.");
    console.log(error);
    return "error";
  }
};

export default postResetPassword;
