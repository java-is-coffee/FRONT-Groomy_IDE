import React, { useCallback, useEffect, useState } from "react";
<<<<<<< HEAD
import "../../styles/loginPage/login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface LoginData {
  email: string;
  password: string;
}

interface LoginDTO {
  data: LoginData;
}

=======
import "../styles/loginPage/loginPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

>>>>>>> 7e1139f (Feat : 이름 수정)
function LoginComponent() {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const goRegister = () => {
<<<<<<< HEAD
    navigate("/register");
=======
    navigate("/regitser");
>>>>>>> 7e1139f (Feat : 이름 수정)
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

<<<<<<< HEAD
    const inputData: LoginData = {
      email: email,
      password: password,
    };

    const request: LoginDTO = {
      data: inputData,
    };

    try {
      const response = await axios.post(baseUrl, request);

      const result = response.data.data;
      const code = response.data.status.code;

      if (code === "200") {
        if (localStorage.getItem("accessToken") === null) {
          localStorage.setItem("accessToken", result.accessToken);
          localStorage.setItem("refreshToken", result.refreshToken);
          goMain();
        } else {
          goMain();
        }
      } else if (code === "302") {
=======
    let inputData = {
      data: {
        email: email,
        password: password,
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
          goMain();
        } else {
          alert("저장된거 꺼낸다");
          console.log(localStorage.getItem("accessToken"));
          goMain();
        }
      } else if (!checkLogin(code)) {
>>>>>>> 7e1139f (Feat : 이름 수정)
        alert("잘못된 정보를 입력하셨습니다");
      }
    } catch (error) {
      alert("네트워크 오류 발생. 잠시 뒤, 이용해주세요.");
    }
  };

<<<<<<< HEAD
  return (
    <div className="login-page">
      {/* 로고  */}
      <div className="logo-position">
        <img src="icon/Logo.png" alt="구르미 로고" />
      </div>

      <div className="login-component">
        {/* Oauth 로그인 버튼 */}
        <div>
          <button className="oauth-loginBtn"> 구글로 로그인 </button>
        </div>

        {/* 중앙 분리대 */}
        <div className="line-separator">
          <span className="line"></span>
          <span className="or">or</span>
          <span className="line"></span>
=======
  const checkLogin = (code: string) => {
    if (code === "200") return true;
    if (code === "302") return false;
    return false;
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
>>>>>>> 7e1139f (Feat : 이름 수정)
        </div>

        {/* 로그인칸 */}
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
<<<<<<< HEAD
              className="input-box"
=======
              className="idInput"
>>>>>>> 7e1139f (Feat : 이름 수정)
              name="email"
              id="email"
              placeholder="이메일을 입력하세요."
              value={email}
<<<<<<< HEAD
              required
=======
>>>>>>> 7e1139f (Feat : 이름 수정)
              onChange={onChangeEmail}
            />
            <br />
            <input
              type="password"
<<<<<<< HEAD
              className="input-box"
=======
              className="passwordInput"
>>>>>>> 7e1139f (Feat : 이름 수정)
              name="password"
              id="password"
              placeholder="비밀번호를 입력하세요."
              onChange={onChangePassword}
            />
<<<<<<< HEAD
            <button className="basic-btn" type="submit">
              <span>로그인</span>
            </button>
          </form>
          <button className="basic-btn" onClick={goRegister}>
=======
            <button className="loginBtn" type="submit">
              <span>로그인</span>
            </button>
          </form>
          <button className="registerBtn" onClick={goRegister}>
>>>>>>> 7e1139f (Feat : 이름 수정)
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
