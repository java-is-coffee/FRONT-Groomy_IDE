import axios from "axios";

const BASE_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/email/verify";

const verificationNumber = async (
  inputEamil: string,
  certificationNumber: string
) => {
  try {
    const reqeustURL =
      BASE_URL +
      `?email=${inputEamil}&certificationNumber=${certificationNumber}`;
    const response = await axios.get(reqeustURL);

    if (response.status === 200) {
      console.log("이메일 확인 완료");
      return 200;
    } else {
      console.log("이메일 발송 실패");
    }
  } catch (error) {
    console.log(error + "인증 실패");
  }

  return;
};

export default verificationNumber;
