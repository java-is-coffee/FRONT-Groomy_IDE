import React, { useEffect } from "react";
import myStyle from "./myPageContainer.module.css";
import { Avatar } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { getMemberInfo } from "../../api/auth/getMemberInfo";
import { setMember } from "../../redux/reducers/memberReducer";
import MyPageBoard from "./myPageBoard";
import ScrappedBoard from "./scrappedBoard";
import MycommentList from "./myCommentList";

function MyPageContainer() {
  const accessToken = localStorage.getItem("accessToken");

  const member = useSelector((state: RootState) => state.member.member);

  //유저 닉네임 아이콘에 넣기
  const nickNameSlice = member?.nickname.slice(0, 3);

  // const [isEdit, setIsEdit] = useState(false);

  const dispatch = useDispatch();
  // member 정보 불러오기
  useEffect(() => {
    const fetchMemberData = async () => {
      const hasMemberInfo = await getMemberInfo();
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

  return (
    <div className={myStyle.body}>
      <div className={myStyle.top} style={{ maxHeight: "40vh" }}>
        <div className={myStyle.profile}>
          <Avatar sx={{ bgcolor: deepPurple[500] }}>{nickNameSlice}</Avatar>
          <div className={myStyle["profile-text"]}>
            이메일 : {member?.email}
          </div>
          <div className={myStyle["profile-text"]}> 이름 : {member?.name}</div>
          <div className={myStyle["profile-text"]}>
            닉네임 : {member?.nickname}{" "}
          </div>
        </div>
        <div className={myStyle.introduce}>
          <MycommentList />
        </div>
      </div>

      <div className={myStyle.top} style={{ marginTop: "30px" }}>
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
