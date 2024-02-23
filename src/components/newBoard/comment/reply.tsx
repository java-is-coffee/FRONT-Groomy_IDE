import React, { useState } from "react";
import style from "./comment.module.css";
import { CommentDetail } from "../../../api/board/newComment";
import { RootState } from "../../../redux/store/store";
import { useSelector } from "react-redux";
import { CommentDetails } from "../../../api/board/getCommentList";
import { newReply } from "../../../api/board/comment/postNewReply";
import useBoardHooks from "../../../hooks/board/boardHook";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@mui/material";

function Reply({ originComment }: { originComment: CommentDetails }) {
  const [writeReply, setWriteReply] = useState(false);
  const boardId = useSelector((state: RootState) => state.board.contentId);
  const userInfo = useSelector((state: RootState) => state.member.member);
  const [content, setContent] = useState<string | undefined>("");
  const boardHooks = useBoardHooks();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (boardId !== null && userInfo?.nickname && userInfo.memberId) {
      const comment: CommentDetail = {
        boardId: boardId,
        content: content,
        nickname: userInfo.nickname,
        originComment: originComment.commentId,
        memberId: userInfo.memberId,
      };

      const response = await newReply(comment, originComment.commentId);

      if (response) {
        boardHooks.updateBoardDetail(boardId);
        boardHooks.updateCommentList(boardId);
        setContent("");
        setWriteReply(false);
      }
    }
  };

  return (
    <div className={style[`block`]}>
      <div className="display-flex-row-reverse flex-end mt-30">
        {originComment.commentStatus !== "DELETED" ? (
          <Button onClick={() => setWriteReply(!writeReply)}>
            대댓글 작성
          </Button>
        ) : (
          ""
        )}
      </div>
      {writeReply ? (
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <MDEditor
            height={200}
            value={content}
            preview="edit"
            onChange={(val) => setContent(val)}
          />
          <button type="submit">댓글 달기</button>
        </form>
      ) : (
        " "
      )}
    </div>
  );
}

export default Reply;
