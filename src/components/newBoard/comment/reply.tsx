import React, { useState } from "react";
import style from "./comment.module.css";
import { CommentDetail } from "../../../api/board/newComment";
import { RootState } from "../../../redux/store/store";
import { useSelector } from "react-redux";
import { CommentDetails } from "../../../api/board/getCommentList";
import { newReply } from "../../../api/board/comment/postNewReply";
import useBoardHooks from "../../../hooks/board/boardHook";

function Reply({ originComment }: { originComment: CommentDetails }) {
  const [writeReply, setWriteReply] = useState(false);
  const boardId = useSelector((state: RootState) => state.board.contentId);
  const userInfo = useSelector((state: RootState) => state.member.member);
  const [content, setContent] = useState("");
  const boardHooks = useBoardHooks();

  function onChangeContent(event: React.FormEvent<HTMLTextAreaElement>): void {
    setContent(event.currentTarget.value);
  }

  const handleSumbit = async (event: React.FormEvent<HTMLFormElement>) => {
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
        <button onClick={() => setWriteReply(!writeReply)}>대댓글 작성</button>
      </div>
      {writeReply ? (
        <form onSubmit={handleSumbit}>
          <div className="mt-15">
            <textarea
              rows={3}
              className="comment-input"
              onChange={onChangeContent}
            ></textarea>
          </div>
          <button type="submit">작성 하기</button>
        </form>
      ) : (
        " "
      )}
    </div>
  );
}

export default Reply;