import React, { useEffect, useState } from "react";
import postLogin, { LoginDTO, LoginData } from "../../api/login/postLogin";
import SendIcon from "@mui/icons-material/Send";
import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import styled from "./login.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import useLoginHooks from "../../hooks/login/useloginHooks";
import { toast } from "react-toastify";

function LoginComponent() {
  const accessToken = localStorage.getItem("accessToken");

  const loginHooks = useLoginHooks();

  useEffect(() => {
    if (accessToken) {
      loginHooks.goMain();
    }
  }, [accessToken, loginHooks]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputData: LoginData = {
      email: email,
      password: password,
    };
    const request: LoginDTO = {
      data: inputData,
    };
    const result = await postLogin(request);
    if (result === "success") {
      toast.success("로그인 완료", { position: "top-center" });
      loginHooks.goMain();
    } else if (result === "error") {
      toast.error("잘못된 정보를 기입하셨습니다. ", { position: "top-center" });
    }
  };

  const ouathLogin = async () => {
    window.location.href =
      "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/oauth2/authorization/google";

    // window.open(base_url, "_blank");

    // const reponse = await axios.get(base_url);

    // console.log(reponse);
  };

  return (
    <div className={styled.body}>
      {/* 로고  */}
      <div>
        <img src="icon/Logo.png" alt="구르미 로고" />
      </div>

      <div className={styled.oauth} style={{ width: "500px" }}>
        <Button variant="outlined" fullWidth onClick={ouathLogin}>
          구글 로그인
        </Button>
      </div>

      <form style={{ width: "500px" }} onSubmit={handleSubmit}>
        <Stack spacing={1.5}>
          <TextField
            fullWidth
            className={styled.input}
            size="small"
            value={email}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(event.target.value);
            }}
            label="이메일 입력"
            variant="outlined"
            required
            placeholder="이메일을 입력해주세요."
            InputProps={{
              endAdornment: email ? (
                <InputAdornment position="end">
                  <IconButton onClick={() => setEmail("")}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : (
                " "
              ),
            }}
          />
          <TextField
            fullWidth
            className={styled.input}
            type="password"
            size="small"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(event.target.value);
            }}
            label="비밀번호 입력"
            variant="outlined"
            required
            placeholder="비밀번호를 입력해주세요."
          />
          <Button variant="contained" type="submit" endIcon={<SendIcon />}>
            로그인
          </Button>

          <div className={styled.flex}>
            <Button onClick={() => loginHooks.goRegister()}>회원가입</Button>
            <Button onClick={() => loginHooks.goResetPassword()}>
              비밀번호 재설정
            </Button>
          </div>
        </Stack>
      </form>
    </div>
  );
}

export default LoginComponent;
