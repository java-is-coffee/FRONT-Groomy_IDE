import React, { useEffect } from "react";
import myStyle from "./myPageBoard.module.css";
import { LuClipboardEdit } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { patchMyCommentList } from "../../redux/reducers/myPageReducer";
import { ListItemButton, ListItemText } from "@mui/material";
import getMyCommentList from "../../api/myPage/getMyComment";
import { CommentDetails } from "../../api/board/getCommentList";

const MycommentList = () => {
  const accessToken = localStorage.getItem("accessToken");
  const member = useSelector((state: RootState) => state.member.member);

  const myComments = useSelector(
    (state: RootState) => state.myPage.MyCommentList
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (accessToken === null) {
      return;
    }
    if (member) {
      const fetchMyboard = async () => {
        const response = await getMyCommentList(member?.memberId);

        if (response) {
          dispatch(patchMyCommentList(response));
        }
      };
      if (myComments === null) {
        fetchMyboard();
      }
    }
  }, [accessToken, myComments, dispatch]);

  return (
    <div>
      <div className={myStyle.top}>
        <LuClipboardEdit style={{ marginRight: "10px" }} />
        작성한 댓글
      </div>
      <div style={{ maxHeight: "20vh", overflowY: "scroll" }}>
        {myComments &&
          myComments.map((item: CommentDetails) => (
            <div key={item.boardId} className={myStyle.item}>
              <ListItemButton>
                <ListItemText primary={item.content} />
              </ListItemButton>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MycommentList;
