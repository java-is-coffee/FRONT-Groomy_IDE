import React from "react";
import "../../styles/register.css";

function registerComponent() {
  // 폼  제출
  // const handleSubmit = (event) => {
  //     event.preventDefault();
  // };

  return (
    <div>
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
        <form action="">
          <input
            type="text"
            name="emailId"
            className="idInput"
            placeholder="이메일을 입력하세요."
          />
          <input
            type="password"
            name="password"
            className="passwordInput"
            placeholder="비밀번호를 입력하세요."
          />
          <input
            type="password"
            name="password_2"
            className="passwordInput_2"
            placeholder="비밀번호를 다시 입력하세요."
          />
          <input
            type="text"
            name="name"
            className="nameInput"
            placeholder="이름을 입력하세요."
          />
          <input
            type="text"
            name="nickname"
            className="nicknameInput"
            placeholder="닉네임을 입력하세요."
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

export default registerComponent;
