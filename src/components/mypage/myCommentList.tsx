import React, { useEffect } from "react";
import myStyle from "./myComment.module.css";
import { LuClipboardEdit } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import {
  patchMyCommentList,
  setBackLog,
} from "../../redux/reducers/myPageReducer";
import getMyCommentList from "../../api/myPage/getMyComment";
import { CommentDetails } from "../../api/board/getCommentList";
import { Chip } from "@mui/material";
import { FaRegThumbsUp } from "react-icons/fa6";
import { patchContentId } from "../../redux/reducers/boardReducer";
import { setMainOption } from "../../redux/reducers/mainpageReducer";
import { ContentType } from "../../enum/mainOptionType";
import useBoardHooks from "../../hooks/board/boardHook";

const MycommentList = () => {
  const accessToken = localStorage.getItem("accessToken");
  const member = useSelector((state: RootState) => state.member.member);

  const myComments = useSelector(
    (state: RootState) => state.myPage.MyCommentList
  );

  const dispatch = useDispatch();
  const boardHooks = useBoardHooks();
  const isBack = useSelector((state: RootState) => state.myPage.isBack);

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
  }, [accessToken, myComments, dispatch, member]);

  const switchBoard = (id: number) => {
    dispatch(patchContentId(id));
    boardHooks.updateCommentList(id);
    dispatch(setMainOption(ContentType.BoardContent));
    dispatch(setBackLog(!isBack));
  };

  return (
    <div style={{ padding: "8px" }}>
      <div className={myStyle.top}>
        <LuClipboardEdit style={{ marginRight: "10px" }} />
        작성한 댓글
      </div>
      <div style={{ height: "30vh", overflowY: "scroll" }}>
        {myComments &&
          myComments.map((item: CommentDetails) => (
            <div
              key={item.commentId + "s"}
              style={{ cursor: "pointer" }}
              onClick={() => switchBoard(item.boardId)}
            >
              <div className={myStyle.item}>
                {item.content}
                <span className={myStyle["bottom"]}>
                  <span className={myStyle["bottom-icon"]}>
                    <span className={myStyle["bottom-icon-number"]}>
                      <Chip
                        avatar={<FaRegThumbsUp />}
                        label={item.helpNumber}
                        size="small"
                        variant="outlined"
                      />
                    </span>
                  </span>
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MycommentList;
