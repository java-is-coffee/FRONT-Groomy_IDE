import axios from "axios";
import React from "react";

const BASE_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/member/register";

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  nickname: string;
  certificationNumber: string;
}

export interface RegisterDTO {
  data: RegisterData;
}

const postRegister = async (inputData: RegisterDTO) => {
  console.log(inputData);
  try {
    const response = await axios.post(BASE_URL, inputData);

    const code = response.status;

    console.log(code);

    if (code === 200) {
      return "success";
    } else return "fail";
  } catch (error) {
    alert("네트워크 오류 발생. 잠시 뒤, 이용해주세요.");
    console.log(error);
    return "error";
  }
};

export default postRegister;
