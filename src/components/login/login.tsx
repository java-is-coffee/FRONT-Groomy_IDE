import React, { useCallback, useEffect, useState } from "react";
import "../../styles/loginPage/loginPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface LoginData {
  email: string;
  password: string;
}

interface LoginDTO {
  data: LoginData;
}

function LoginComponent() {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const goRegister = () => {
    navigate("/regitser");
  };

  const goResetPassword = () => {
    navigate("/resetPassword");
  };

  const goMain = useCallback(() => {
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (accessToken) {
      goMain();
    }
  }, [accessToken, goMain]);

  const baseUrl: string =
    "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/member/login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChangeEmail = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setEmail(value);
  };

  const onChangePassword = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputData: LoginData = {
      email: email,
      password: password,
    };

    const request: LoginDTO = {
      data: inputData,
    };

    try {
      let response = await axios.post(baseUrl, request);

      let result = response.data.data;
      let code = response.data.status.code;

      if (code === "200") {
        alert("로그인 성공");
        if (localStorage.getItem("accessToken") === null) {
          localStorage.setItem("accessToken", result.accessToken);
          localStorage.setItem("refreshToken", result.refreshToken);
          goMain();
        } else {
          goMain();
        }
      } else if (code === "302") {
        alert("잘못된 정보를 입력하셨습니다");
      }
    } catch (error) {
      alert("네트워크 오류 발생. 잠시 뒤, 이용해주세요.");
    }
  };

  return (
    <div>
      {/* 로고  */}
      <div className="logoPosition">
        <img src="icon/Logo.png" alt="구르미 로고" />
      </div>

      <div className="loginComponent">
        {/* Oauth 로그인 버튼 */}
        <div>
          <button className="oauthLogin"> 구글로 로그인 </button>
        </div>

        {/* 중앙 분리대 */}
        <div>
          <span className="midLinearLineLeft"></span>
          <span className="midWord">or</span>
          <span className="midLinearLineRight"></span>
        </div>

        {/* 로그인칸 */}
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="idInput"
              name="email"
              id="email"
              placeholder="이메일을 입력하세요."
              value={email}
              onChange={onChangeEmail}
            />
            <br />
            <input
              type="password"
              className="passwordInput"
              name="password"
              id="password"
              placeholder="비밀번호를 입력하세요."
              onChange={onChangePassword}
            />
            <button className="loginBtn" type="submit">
              <span>로그인</span>
            </button>
          </form>
          <button className="registerBtn" onClick={goRegister}>
            <span>회원가입</span>
          </button>
        </div>

        {/* 컴포넌트 하단 */}
        <div>
          <span onClick={goResetPassword} className="resetPassword">
            비밀번호 재설정
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;