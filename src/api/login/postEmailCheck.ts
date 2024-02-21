import axios from "axios";
import React from "react";

export interface EmailData {
  email: string;
}

export interface EmailDTO {
  data: EmailData;
}

const BASE_URL: string =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/member/register/email-check";

const postEmailCheck = async (inputEmail: string) => {
  const email: EmailData = {
    email: inputEmail,
  };

  const reqeustDTO: EmailDTO = {
    data: email,
  };

  try {
    const response = await axios.post(BASE_URL, reqeustDTO);

    //중복이 true, 아니면 fasle, false 에서 진행
    if (response.status === 200) return response.data;
    else return true;
  } catch (error) {
    alert("네트워크 오류 발생");
    console.log("데이터 전송 실패");
  }
};

export default postEmailCheck;
