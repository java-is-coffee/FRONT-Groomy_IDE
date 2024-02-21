import React from "react";
import styled from "./resetPassword.module.css";
import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";

const resetPassword = () => {
  return (
    <div className={styled.body}>
      <div className="logo-position">
        <img src="icon/Logo.png" alt="구르미 로고" />
      </div>

      <form style={{ width: "40%" }}>
        <Stack spacing={1.5}>
          <TextField
            fullWidth
            className={styled.input}
            size="small"
            label="이름 입력"
            variant="outlined"
            required
            placeholder="이름을 입력해주세요."
          />
          <TextField
            fullWidth
            className={styled.input}
            size="small"
            label="이메일 입력"
            variant="outlined"
            required
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

export default resetPassword;
