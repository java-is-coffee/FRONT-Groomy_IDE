import React, { ChangeEventHandler, useState } from "react";
import { Button, Stack, TextField } from "@mui/material";
import styled from "./register.module.css";
import verificationEmail from "../../api/login/verificationEmail";
import verificationNumber from "../../api/login/verifiNumber";
import useRegisterHooks from "../../hooks/register/regitserHooks";
import postEmailCheck from "../../api/login/postEmailCheck";
import postRegister, {
  RegisterDTO,
  RegisterData,
} from "../../api/login/postRegister";

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

  const [verifiNumber, setVerifiNumber] = useState("");
  const [isSendEmail, setIsSendEmail] = useState(false);
  const [emailSetUp, setEmailSetUp] = useState(false);
  const [emailFormat, setEmailFormat] = useState(false); //이메일 형식 테스트용

  const regitserHooks = useRegisterHooks();

  const checkDupelicate = async () => {
    const emailFormat = regitserHooks.emailCheck(email);

    if (emailFormat === true) {
      const result = await postEmailCheck(email);

      //중복되는 이메일이 없다.
      if (result === false) {
        setEmailFormat(true);
        setIsCheckedEmail(true);
      } else {
        setEmailFormat(false);
        setIsCheckedEmail(false);
      }
    } else {
      setEmailFormat(false);
      setIsCheckedEmail(true);
    }
  };

  const onBlurCheckPassword = () => {
    if (checkPassword === password) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  };

  const handleSubmit = async () => {
    // event.preventDefault();

    const inputData: RegisterData = {
      email: email,
      password: password,
      name: name,
      nickname: nickname,
      certificationNumber: verifiNumber,
    };

    const requestDTO: RegisterDTO = {
      data: inputData,
    };

    const result = await postRegister(requestDTO);

    if (result === "success") {
      alert("회원 가입 완료");
      regitserHooks.goLogin();
    } else {
      alert("실패");
    }
  };

  const checkVerifiNumber = async () => {
    const response = await verificationNumber(email, verifiNumber);

    if (response === 200) {
      alert("인증 완료");
      setEmailSetUp(true);
    } else {
      setEmailSetUp(false);
      alert("틀렸습니다.");
    }
  };

  const sendEmail = async () => {
    const response = await verificationEmail(email);

    if (response === 200) {
      setIsSendEmail(true);
      console.log("메일 전송 완료");
    } else {
      console.log("메일 전송 불가");
    }
  };

  return (
    <div className={styled.body}>
      <div className={styled.logo}>
        <img src="icon/Logo.png" alt="구르미 로고" />
      </div>

      <Stack spacing={2} style={{ width: "40%" }}>
        <div className={styled.flex}>
          <TextField
            fullWidth
            className={styled.input}
            size="small"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(event.target.value);
            }}
            label="이메일 입력"
            variant="outlined"
            required
            onBlur={checkDupelicate}
            error={emailFormat ? false : true}
            placeholder="이메일을 입력해주세요."
          />
          <Button
            disabled={emailFormat ? false : true}
            variant="contained"
            onClick={sendEmail}
          >
            전송
          </Button>
        </div>
        {/* 평소엔 숨겨져있다가 이메일 중복일때만 나타나게 */}
        <div className={isCheckedEmail ? `${styled.hidden}` : " "}>
          이메일이 중복되었습니다.
        </div>

        <div className={`${styled.flex}`}>
          <TextField
            fullWidth
            className={styled.input}
            size="small"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setVerifiNumber(event.target.value);
            }}
            label="인증번호 입력"
            variant="outlined"
            required
            placeholder="인증번호를 입력해주세요.(6자리)"
          />
          <Button
            disabled={emailFormat ? false : true}
            variant="contained"
            onClick={checkVerifiNumber}
          >
            인증
          </Button>
        </div>
        <TextField
          fullWidth
          className={styled.input}
          size="small"
          type="password"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(event.target.value);
          }}
          label="비밀번호 입력"
          variant="outlined"
          required
        />
        <TextField
          fullWidth
          className={styled.input}
          size="small"
          type="password"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setCheckPassword(event.target.value);
          }}
          onBlur={onBlurCheckPassword}
          label="비밀번호 재입력"
          variant="outlined"
          required
          error={isChecked ? false : true}
        />
        <div className={isChecked ? `${styled.hidden}` : " "}>
          비밀번호가 다릅니다.
        </div>
        <TextField
          fullWidth
          className={styled.input}
          size="small"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
          }}
          label="이름 입력"
          variant="outlined"
          required
        />
        <TextField
          fullWidth
          className={styled.input}
          size="small"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNickname(event.target.value);
          }}
          label="닉네임 입력"
          variant="outlined"
          required
        />
        <Button
          variant="contained"
          disabled={emailSetUp ? false : true}
          onClick={handleSubmit}
        >
          회원가입
        </Button>
        <div className="">
          <span className="q">이미 계정이 있으신가요?</span>
          <div onClick={regitserHooks.goLogin} className="float-right">
            로그인
          </div>
        </div>
      </Stack>
    </div>
  );
}

export default RegisterComponent;
