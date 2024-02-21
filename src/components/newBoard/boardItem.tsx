import React from "react";

import styles from "../../styles/board/board.module.css";

import { FaRegThumbsUp } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { FaRegCommentDots } from "react-icons/fa";
import { BoardDetails } from "../../redux/reducers/boardReducer";
type boardProps = {
  BoardDetails: BoardDetails;
};

const BoardItem: React.FC<boardProps> = ({ BoardDetails }) => {
  return (
    // 게시글 상단 미해결 과 제목
    <div className={`${styles["board-item"]} ${styles["box-border"]} ${styles["p-15"]}`} id={`${BoardDetails.boardId}`}>
      <div className={`${styles["board-item-top"]} ${styles["mt-15"]}`}>
        <span className={styles["board-item-completed-box"]}>미해결</span>
        <span>{BoardDetails.title}</span>
      </div>

      {/* 내용  */}
      <div className={styles["board-item-content"]}>{BoardDetails.content}</div>

      {/* 멤버 아이디 */}
      <div className={styles["board-item-bottom"]}>
        <span className={styles["board-item-user-name"]}>{BoardDetails.nickname}</span>
        <div className={styles["float-right"]}>
          <span className={styles["board-item-bottom-icon"]}>
            <FaRegThumbsUp />
            <span className={styles["board-item-bottom-icon-number"]}>
              {BoardDetails.helpNumber}
            </span>
          </span>

          {/* 도움, 댓글 갯수  */}
          <span className={styles["board-item-bottom-icon"]}>
            <GrView />
            <span className={styles["board-item-bottom-icon-number"]}>
              {BoardDetails.viewNumber}
            </span>
          </span>
          <span className={styles["board-item-bottom-icon"]}>
            <FaRegCommentDots />
            <span className={styles["board-item-bottom-icon-number"]}>
              {BoardDetails.commentNumber}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
export default BoardItem;
