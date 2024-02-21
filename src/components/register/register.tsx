import React, { useState } from "react";
import styles from "../../styles/register.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface RegisterData {
  email: string;
  password: string;
  name: string;
  nickname: string;
}

interface EmailDupe {
  email: string;
}

interface RegisterDTO {
  data: RegisterData | EmailDupe;
}

const baseUrl: string =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/member/register";

const dupeCheckUrl: string =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/member/register/email-check";

function RegisterComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [isChecked, setIsChecked] = useState(true);
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [isCheckedEmail, setIsCheckedEmail] = useState(true);

  const navigate = useNavigate();
  const goLogin = () => {
    navigate("/login");
  };

  const onChangeEmail = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    setEmail(value);
  };

  const checkDupelicate = async () => {
    const inputData: EmailDupe = {
      email: email,
    };
    const requestDTO: RegisterDTO = {
      data: inputData,
    };

    try {
      const response = await axios.post(dupeCheckUrl, requestDTO);
      const result = response.data;
      console.log(result);

      if (result === false) {
        console.log("정답이");
        setIsCheckedEmail(true);
      } else if (result === true) {
        setIsCheckedEmail(false);
      }

      console.log(isCheckedEmail);
    } catch (error) {
      alert("통신 실패");
    }
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
    const value = e.currentTarget.value;
    setCheckPassword(value);
    if (checkPassword === password) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
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
        alert("이메일이 중복되었습니다."); // 일단 위에서 중복체크 설정은 해뒀는데 api 문서상 301이 보내져서 일단 적어뒀습니다.
      } else if (code === "300") {
        alert("회원 가입에 실패하셨습니다. 잠시 뒤, 시도해주세요.");
      }
    } catch (error) {
      alert("네트워크 오류 발생. 잠시 뒤, 이용해주세요.");
    }
  };
  return (
    <div className={styles["register-component"]}>
      <div className={styles["logo-position"]}>
        <img src="icon/Logo.png" alt="구르미 로고" />
      </div>

      <div>
        <button type="button" className={styles["oauth-login-btn"]}>
          {" "}
          구글로 로그인{" "}
        </button>
      </div>

      <div className={styles["register-component"]}>
        <div className={styles["line-separator"]}>
          <span className={styles["line-left"]}></span>
          <span className={styles.or}>or</span>
          <span className={styles["line-right"]}></span>
        </div>

        {/* <form onSubmit={handleSubmit}> */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="emailId"
            className={styles["id-input"]}
            placeholder="이메일을 입력하세요."
            onChange={onChangeEmail}
            onBlur={checkDupelicate}
            required
          />{" "}
          <div
            id="wrong-password"
            className={`${styles["check-text"]} ${isCheckedEmail ? styles["display-none"] : " "}`}
          >
            이메일이 중복되었습니다.
          </div>
          <input
            type="password"
            name="password"
            className={styles["password-input"]}
            placeholder="비밀번호를 입력하세요."
            onChange={onChangePassword}
            required
          />
          <input
            type="password"
            name="password_2"
            className={styles["password-input_2"]}
            placeholder="비밀번호를 다시 입력하세요."
            onChange={onChangeCheckPassword}
            onBlur={onBlurCheckPassword}
            required
          />{" "}
          <div
            id="wrong-password"
            className={`${styles["check-text"]} ${isChecked ? styles["display-none"] : " "}`}
          >
            비밀번호가 일치하지 않습니다.
          </div>
          <input
            type="text"
            name="name"
            className={styles["name-input"]}
            placeholder="이름을 입력하세요."
            onChange={onChangeName}
            required
          />
          <input
            type="text"
            name="nickname"
            className={styles["nickname-input"]}
            placeholder="닉네임을 입력하세요."
            onChange={onChangeNickname}
            required
          />
          <button type="submit" className={styles["register-btn"]}>
            회원가입
          </button>
        </form>
      </div>

      <div className={styles.already}>
        <div>
          <span className={styles.q}>이미 계정이 있으세요?</span>
        </div>
        <div>
          <a href="/login" className={styles.login}>
            로그인
          </a>
        </div>
      </div>
    </div>
  );
}

export default RegisterComponent;
