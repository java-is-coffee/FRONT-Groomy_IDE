import axios from "axios";
export interface NewPassword {
  password: string;
}

export interface NewPasswordDTO {
  data: NewPassword;
}

const BASE_URL: string =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/member/my/delete-account";

const deleteMember = async () => {
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

  try {
    const response = await axios.delete(BASE_URL, config);

    if (response.status === 200) return 200;
    else return null;
  } catch (error) {
    alert("네트워크 오류 발생");
    console.log("데이터 전송 실패");
  }
};

export default deleteMember;
