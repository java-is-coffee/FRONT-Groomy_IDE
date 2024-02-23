import React, { useEffect, useState } from "react";
import myStyle from "./myPageContainer.module.css";
import { Avatar, Button } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { getMemberInfo } from "../../api/auth/getMemberInfo";
import { setMember } from "../../redux/reducers/memberReducer";
import MyPageBoard from "./myPageBoard";
import ScrappedBoard from "./scrappedBoard";
import MycommentList from "./myCommentList";
import { patchCurrentPage } from "../../redux/reducers/boardReducer";
import postNewNickname, {
  NewUserInfo,
} from "../../api/myPage/patchNewNickname";
import { toast } from "react-toastify";

import { setMainOption } from "../../redux/reducers/mainpageReducer";
import { ContentType } from "../../enum/mainOptionType";

function MyPageContainer() {
  const accessToken = localStorage.getItem("accessToken");

  const member = useSelector((state: RootState) => state.member.member);
  const [isEditUser, setIsEditUser] = useState(false);

  const [changeNickname, setChangeNickname] = useState(member?.nickname);
  const [changeName, setChangeName] = useState(member?.name);

  //유저 닉네임 아이콘에 넣기
  const nickNameSlice = member?.nickname.slice(0, 3);

  // const [isEdit, setIsEdit] = useState(false);

  const dispatch = useDispatch();
  // member 정보 불러오기
  useEffect(() => {
    const fetchMemberData = async () => {
      const hasMemberInfo = await getMemberInfo();
      dispatch(patchCurrentPage(null));
      if (hasMemberInfo) {
        dispatch(setMember(hasMemberInfo));
      } else {
        console.log("정보 불러오기 오류");
      }
    };

    if (!member) {
      fetchMemberData();
    }
    console.log(member);
  }, [accessToken, dispatch, member]);

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChangeName(event.target.value);
  };

  const onChangeNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChangeNickname(event.target.value);
  };

  const chageNew = async () => {
    if (member && changeNickname && changeName) {
      const newInfo: NewUserInfo = {
        memberId: member.memberId,
        email: member.email,
        name: changeName,
        nickname: changeNickname,
        helpNumber: member.helpNumber,
        role: member.role,
      };

      const response = await postNewNickname(newInfo);

      if (response) {
        toast.success("정보 갱신 성공");
        dispatch(setMember(response));
        setIsEditUser(false);
      }
    }
  };

  const moveReset = () => {
    dispatch(setMainOption(ContentType.MyPageResetPassword));
  };

  return (
    <div className={myStyle.body}>
      <div className={myStyle.top} style={{ maxHeight: "40vh" }}>
        <div className={myStyle.profile} style={{ padding: "50px" }}>
          <Avatar sx={{ bgcolor: deepPurple[500] }}>{nickNameSlice}</Avatar>
          <div className={myStyle["profile-text"]}>
            이메일 : {member?.email}
          </div>
          {isEditUser ? (
            <div className={myStyle["profile-text"]}>
              이름 :{" "}
              <input
                style={{
                  padding: "7.5px",
                  borderRadius: "5px",
                  border: "0.5px solid #d9d9d9",
                }}
                value={changeName}
                onChange={onChangeName}
              />
            </div>
          ) : (
            <div className={myStyle["profile-text"]}>
              이름 : {member?.name}{" "}
            </div>
          )}
          {isEditUser ? (
            <div className={myStyle["profile-text"]}>
              닉네임 :{" "}
              <input
                style={{
                  padding: "7.5px",
                  borderRadius: "5px",
                  border: "0.5px solid #d9d9d9",
                }}
                value={changeNickname}
                onChange={onChangeNickname}
              />
              <Button variant="contained" onClick={chageNew}>
                {" "}
                수정
              </Button>
            </div>
          ) : (
            <div className={myStyle["profile-text"]}>
              닉네임 : {member?.nickname}{" "}
            </div>
          )}

          <Button
            variant="contained"
            style={{ marginRight: "10px" }}
            onClick={moveReset}
          >
            비밀번호 수정
          </Button>
          <Button
            variant="contained"
            style={{ marginRight: "10px" }}
            onClick={() => setIsEditUser(!isEditUser)}
          >
            정보 수정
          </Button>
          <Button variant="contained" color="error">
            회원 탈퇴
          </Button>
        </div>
        <div className={myStyle.comment} style={{ maxHeight: "40vh" }}>
          <MycommentList />
        </div>
      </div>

      <div className={myStyle.top} style={{ marginTop: "5px" }}>
        <div className={myStyle.board}>
          <div>
            <MyPageBoard />
          </div>
        </div>
        <div className={myStyle.board}>
          <ScrappedBoard />
        </div>
      </div>
    </div>
  );
}

export default MyPageContainer;
