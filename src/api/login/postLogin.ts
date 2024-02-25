import axios from "axios";

const BASE_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/member/login";

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginDTO {
  data: LoginData;
}

const postLogin = async (inputData: LoginDTO) => {
  try {
    const response = await axios.post(BASE_URL, inputData);

    const code = response.status;
    const result = response.data;

    if (code === 200) {
      if (localStorage.getItem("accessToken") === null) {
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("refreshToken", result.refreshToken);
      }
      return "success";
    }
  } catch (error) {
    return "error";
  }
};

export default postLogin;
