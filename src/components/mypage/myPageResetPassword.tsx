import { Button, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import myStyle from "./myPageResetPassword.module.css";
import patchNewPassword, {
  NewPassword,
} from "../../api/myPage/patchNewPassword";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setMainOption } from "../../redux/reducers/mainpageReducer";
import { ContentType } from "../../enum/mainOptionType";

const MyPageResetPassword = () => {
  //   const [beforePassword, setBeforePassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");

  const [isChecked, setIsChecked] = useState(false);

  const dispatch = useDispatch();

  const onBlurCheckPassword = () => {
    if (newPassword === checkPassword) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  };

  const changePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const inputData: NewPassword = {
      password: newPassword,
    };

    const response = await patchNewPassword(inputData);

    if (response === 200) {
      toast.success("비밀번호 갱신 성공");
      dispatch(setMainOption(ContentType.MyPage));
    }
  };

  return (
    <div className={myStyle.body}>
      <form style={{ width: "500px" }} onSubmit={changePassword}>
        <Stack spacing={1.5}>
          <TextField
            fullWidth
            size="small"
            label="새로운 비밀번호"
            className={myStyle.input}
            variant="outlined"
            type="password"
            required
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNewPassword(event.target.value);
            }}
            placeholder="새로운 비밀번호를 입력해주세요."
          />
          <TextField
            fullWidth
            size="small"
            type="password"
            label="재입력"
            className={myStyle.input}
            variant="outlined"
            onBlur={onBlurCheckPassword}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setCheckPassword(event.target.value);
            }}
            required
            placeholder="새로운 비밀번호를 다시 입력해주세요."
          />
          <div
            style={{ color: "red" }}
            className={isChecked ? `${myStyle.hidden}` : " "}
          >
            비밀번호가 다릅니다.
          </div>
          <Button
            variant="contained"
            disabled={isChecked ? false : true}
            type="submit"
          >
            비밀번호 변경
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default MyPageResetPassword;
