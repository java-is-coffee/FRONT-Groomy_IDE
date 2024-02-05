import React, { useState } from "react";
import "../../styles/register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface RegisterData {
  email: string;
  password: string;
  name: string;
  nickname: string;
}

interface RegisterDTO {
  data: RegisterData;
}

const baseUrl: string =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/member/register";

function RegisterComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");

  const navigate = useNavigate();
  const goLogin = () => {
    navigate("/login");
  };

  const onChangeEmail = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setEmail(value);
  };
  const onChangePassword = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setPassword(value);
  };

  const onChangeCheckPassword = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setCheckPassword(value);
  };

  const onBlurCheckPassword = (e: React.FormEvent<HTMLInputElement>) => {
    if (checkPassword !== password) {
      alert("비밀번호를 잘못 입력하셨습니다.");
      e.currentTarget.value = "";
    }
  };

  const onChangeName = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setName(value);
  };
  const onChangeNickname = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setNickname(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const inputData: RegisterData = {
      email: email,
      password: password,
      name: name,
      nickname: nickname,
    };

    const requestDTO: RegisterDTO = {
      data: inputData,
    };

    try {
      const response = await axios.post(baseUrl, requestDTO);

      const result = response.data;
      const code = result.status.code;

      if (code === "200") {
        alert("회원가입에 성공하셨습니다.");
        goLogin();
      } else if (code === "301") {
        alert("이메일이 중복되었습니다."); //추후 수정 예정.
      } else if (code === "300") {
        alert("회원 가입에 실패하셨습니다. 잠시 뒤, 시도해주세요.");
      }
    } catch (error) {
      alert("네트워크 오류 발생. 잠시 뒤, 이용해주세요.");
    }
  };
  return (
    <div className="register-page">
      <div className="logoPosition">
        <img src="icon/Logo.png" alt="구르미 로고" />
      </div>

      <div>
        <button type="button" className="oauthLoginBtn">
          {" "}
          구글로 로그인{" "}
        </button>
      </div>

      <div className="registerComponent">
        <div className="lineSeparator">
          <span className="LineLeft"></span>
          <span className="or">or</span>
          <span className="LineRight"></span>
        </div>

        {/* <form onSubmit={handleSubmit}> */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="emailId"
            className="idInput"
            placeholder="이메일을 입력하세요."
            onChange={onChangeEmail}
          />
          <input
            type="password"
            name="password"
            className="passwordInput"
            placeholder="비밀번호를 입력하세요."
            onChange={onChangePassword}
          />
          <input
            type="password"
            name="password_2"
            className="passwordInput_2"
            placeholder="비밀번호를 다시 입력하세요."
            onChange={onChangeCheckPassword}
            onBlur={onBlurCheckPassword}
          />
          <input
            type="text"
            name="name"
            className="nameInput"
            placeholder="이름을 입력하세요."
            onChange={onChangeName}
          />
          <input
            type="text"
            name="nickname"
            className="nicknameInput"
            placeholder="닉네임을 입력하세요."
            onChange={onChangeNickname}
          />

          <button type="submit" className="registerBtn">
            회원가입
          </button>
        </form>
      </div>

      <div>
        <span className="already">이미 계정이 있으세요?</span>
        <a href="/login" className="ready">
          로그인
        </a>
      </div>
    </div>
  );
}

export default RegisterComponent;
