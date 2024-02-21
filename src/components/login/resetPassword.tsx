import React, { useState } from "react";
import "../../styles/loginPage/resetPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPasswordComponent() {
  const navigate = useNavigate();

  const goLogin = () => {
    navigate("/login");
  };

  const baseUrl: string =
    "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/member/login/resetPassword";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const onChangeName = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setName(value);
  };

  const onChangeEmail = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setEmail(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let inputData = {
      data: {
        name: name,
        email: email,
      },
    };

    try {
      let resp = await axios.post(baseUrl, inputData);

      let result = resp.data.data;
      let code = resp.data.status.code;

      console.log(resp.data);

      if (checkLogin(code)) {
        alert("로그인 성공");
        if (localStorage.getItem("accessToken") === null) {
          alert("로컬 스토리지 저장");
          localStorage.setItem("accessToken", result.accessToken);
          localStorage.setItem("refreshToken", result.refreshToken);
          console.log(localStorage.getItem("accessToken"));
          goLogin();
        } else {
          alert("저장된거 꺼낸다");
          console.log(localStorage.getItem("accessToken"));
          goLogin();
        }
      } else if (!checkLogin(code)) {
        alert("잘못된 정보를 입력하셨습니다");
      }
    } catch (error) {
      alert("네트워크 오류 발생. 잠시 뒤, 이용해주세요.");
    }
  };
  const checkLogin = (code: string) => {
    if (code === "200") return true;
    if (code === "302") return false;
    return false;
  };

  return (
    <div className="login-page">
      <div className="logoPosition">
        <img src="icon/Logo.png" alt="logo" />
      </div>
      {/* 비밀번호 재설정 */}
      <div className="midText">비밀번호 재설정</div>

      <form method="post" onSubmit={handleSubmit}>
        <input
          className="nameInput"
          placeholder="이름을 입력해주세요"
          onChange={onChangeName}
        />
        <input
          className="emailInput"
          onChange={onChangeEmail}
          type="email"
          placeholder="이메일을 입력해주세요"
        />
        <button className="basicBtn">비밀번호 재설정</button>
      </form>
    </div>
  );
}

export default ResetPasswordComponent;
