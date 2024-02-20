import React, { useState } from "react";
import {
  BoardId,
  CommentDetails,
  getCommentList,
} from "../../../api/board/getCommentList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { UpdateComent, updateComment } from "../../../api/board/updateComment";
import {
  patchComment,
  patchCommentList,
} from "../../../redux/reducers/boardReducer";

function CommentEditModal({
  setcommentEdit,
}: {
  setcommentEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch();
  const commentData: CommentDetails | null = useSelector(
    (state: RootState) => state.board.comment
  );
  const closeTab = () => {
    setcommentEdit(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (commentData && content) {
      const requestDTO: UpdateComent = {
        nickname: commentData.nickname,
        content: content,
      };
      const boardIdData: BoardId = {
        boardId: commentData?.boardId,
      };
      updateComment(requestDTO, commentData.commentId);
      const commentListData = await getCommentList(boardIdData);
      if (commentListData) dispatch(patchCommentList(commentListData));
    }
    dispatch(patchComment(null));
    closeTab();
  };

  const [content, setContent] = useState(commentData?.content);
  function onChangeContent(event: React.FormEvent<HTMLTextAreaElement>): void {
    setContent(event.currentTarget.value);
  }
  return (
    <div className="edit-modal">
      <button className="close-btn" onClick={closeTab}>
        x
      </button>
      <form onSubmit={handleSubmit} className="">
        <div>{commentData?.commentId}</div>
        <textarea
          defaultValue={commentData?.content}
          value={content}
          onChange={onChangeContent}
        ></textarea>
        <button type="submit">수정하기</button>
      </form>
    </div>
  );
}

export default CommentEditModal;
