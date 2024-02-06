import React from "react";
import { BoardDetails } from "./boardContainer";
import { FaRegThumbsUp } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { FaRegCommentDots } from "react-icons/fa";

// interface BoardDetails {
//   boardId: number;
//   memberId: number;
//   title: string;
//   content: string;
//   viewNumber: number;
//   helpNumber: number;
//   commentNumber: number;
//   completed: boolean;
// }

const BoardCard = ({ boardItem }: { boardItem: BoardDetails }) => {
  return (
    <div className="board-item box-border p-15">
      <div className="board-item-top mt-15">
        <span className="board-item-completed-box p-15">미해결</span>
        <span>{boardItem.title}</span>
      </div>

      <div className="board-item-content">{boardItem.content}</div>

      <div className="board-item-bottom">
        <span className="board-item-user-name">{boardItem.memberId}</span>
        <div className="board-item-bottom-right">
          <span className="board-item-bottom-icon">
            <FaRegThumbsUp />
            <span className="board-item-bottom-icon-number">
              {boardItem.helpNumber}
            </span>
          </span>

          <span className="board-item-bottom-icon">
            <GrView />
            <span className="board-item-bottom-icon-number">
              {boardItem.commentNumber}
            </span>
          </span>
          <span className="board-item-bottom-icon">
            <FaRegCommentDots />
            <span className="board-item-bottom-icon-number">
              {boardItem.helpNumber}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
// 미해결 타이틀 내용 유저이름 헬프 뷰 코멘트
