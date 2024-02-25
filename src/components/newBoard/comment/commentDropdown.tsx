import React, { useState } from "react";
import { removeComment } from "../../../api/board/comment/removeComment";
import { BoardId, CommentDetails } from "../../../api/board/getCommentList";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import useBoardHooks from "../../../hooks/board/boardHook";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
// import CommentEditModal from "./commentEditModal";
import styled from "./comment.module.css";

function CommentDropdown({
  comment,
  setIsEdit,
  isEdit,
}: {
  comment: CommentDetails;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit: boolean;
}) {
  const curId = useSelector((state: RootState) => state.board.contentId);
  const boardIdData: BoardId = {
    boardId: curId,
  };

  const boardHooks = useBoardHooks();

  const [isDropdown, setIsDropdown] = useState(false);

  const handleEdit = () => {
    setIsEdit(!isEdit);
  };

  const hadleDelete = async (comment: CommentDetails) => {
    if (!window.confirm("댓글을 삭제 하시겠습니까?")) {
    } else {
      if (comment) {
        await removeComment(comment.commentId);
        if (boardIdData.boardId) {
          boardHooks.updateBoardDetail(boardIdData.boardId);
          boardHooks.updateCommentList(boardIdData.boardId);
        }
      }
    }
  };

  return (
    <div>
      <div className={styled.editDropdownContainer}>
        <HiOutlineDotsHorizontal
          className={styled.iconButton}
          size={"28px"}
          onClick={() => setIsDropdown((prev) => !prev)}
        />
        <div
          className={`${styled.editDropdownMenu} ${
            isDropdown ? styled.dropdownMenuVisible : styled.dropdownMenuHidden
          }`}
        >
          <button onClick={handleEdit}>EDIT</button>
          <button onClick={() => hadleDelete(comment)}>DELETE</button>
        </div>
      </div>
    </div>
  );
}

export default CommentDropdown;
