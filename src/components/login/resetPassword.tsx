import React, { useState } from "react";
import styled from "./resetPassword.module.css";
import { Button, Stack, TextField } from "@mui/material";
import postResetPassword, {
  ResetDTO,
  ResetData,
} from "../../api/login/postResetPassword";
import { toast } from "react-toastify";
import useLoginHooks from "../../hooks/login/useloginHooks";

const ResetPassword = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const loginHooks = useLoginHooks();

  const sendEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const inputData: ResetData = {
      name: name,
      email: email,
    };

    const reqeustDTO: ResetDTO = {
      data: inputData,
    };

    const response = await postResetPassword(reqeustDTO);

    if (response === "success") {
      toast.success("임시 비밀번호 발급 완료", { position: "top-center" });
      loginHooks.goLogin();
    } else {
      console.log("메일 전송 불가");
    }
  };

  return (
    <div className={styled.body}>
      <div className="logo-position">
        <img src="icon/Logo.png" alt="구르미 로고" />
      </div>

      <form style={{ width: "500px" }} onSubmit={sendEmail}>
        <Stack spacing={1.5}>
          <TextField
            fullWidth
            className={styled.input}
            size="small"
            label="이름 입력"
            variant="outlined"
            required
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value);
            }}
            placeholder="이름을 입력해주세요."
          />
          <TextField
            fullWidth
            className={styled.input}
            size="small"
            label="이메일 입력"
            variant="outlined"
            required
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(event.target.value);
            }}
            placeholder="이메일을 입력해주세요."
          />
          <Button variant="contained" type="submit">
            비밀번호 찾기
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default ResetPassword;
