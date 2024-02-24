import axios from "axios";

const BASE_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/email/send-certification";

interface Email {
  email: string;
}

interface ResponseDTO {
  data: Email;
}

const verificationEmail = async (inputEamil: string) => {
  try {
    const email: Email = {
      email: inputEamil,
    };
    const requsetDTO: ResponseDTO = {
      data: email,
    };

    const response = await axios.post(BASE_URL, requsetDTO);

    if (response.status === 200) {
      console.log("이메일 발송 완료");

      return response.status;
    } else {
      console.log("이메일 발송 실패");
    }
  } catch (error) {
    console.log(error + "실패");
  }

  return;
};

export default verificationEmail;
