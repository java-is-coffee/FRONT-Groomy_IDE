import React, { useState } from "react";
import styles from "../../styles/board/board.module.css";
import { FaClipboard } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { NewBoard, postNewBoard } from "../../api/board/postNewBoard";

function NewBoardPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const user = useSelector((state: RootState) => state.member.member);

  function onChangeTitle(event: React.FormEvent<HTMLInputElement>): void {
    const value = event.currentTarget.value;
    setTitle(value);
  }

  // function onChangeTag(event: React.FormEvent<HTMLInputElement>): void {
  //   const value = event.currentTarget.value;
  //   setTag(value);
  // }

  function onChangeContent(event: React.FormEvent<HTMLTextAreaElement>): void {
    const value = event.currentTarget.value;
    setContent(value);
  }

  function checkCompleted(event: React.FormEvent<HTMLInputElement>): void {
    const value = event.currentTarget.checked;
    setIsCompleted(value);
  }

  // function checkAnony(event: React.FormEvent<HTMLInputElement>): void {
  //   const value = event.currentTarget.checked;

  // }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user?.nickname && user.memberId) {
      const requestDTO: NewBoard = {
        memberId: user.memberId,
        nickname: user.nickname,
        title: title,
        content: content,
        completed: isCompleted,
      };

      await postNewBoard(requestDTO);
    }
  };

  return (
    <div className={`${styles["w-50"]} ${styles["p-15"]} ${styles.test} ${styles["box-border"]}`}>
      <div className={`${styles["board-top"]} ${styles["line-bottom"]} ${styles["display-flex-start"]}`}>
        <FaClipboard className={styles["mr-15"]} size={25} />
        질문 작성
      </div>

      <form className={styles["mt-30"]} onSubmit={handleSubmit}>
        <div className={styles["mt-15"]}>
          <span className={styles["font-bold"]}>제목</span>
          <span className={styles["float-right"]}>
            <input type="checkbox" name="anonymous" />
            <span>익명 선택</span>
          </span>
          <span className={`${styles["float-right"]} ${styles["mr-15"]}`}>
            <input type="checkbox" name="completed" onChange={checkCompleted} />
            <span>해결</span>
          </span>
          <div className={styles["mt-15"]}>
            <input
              type="text"
              name="title"
              className={styles["input-box"]}
              required
              onChange={onChangeTitle}
            />
          </div>
        </div>

        <div className={styles["mt-15"]}>
          <span className={styles["font-bold"]}>태그</span>
          <div className={styles["mt-15"]}>
            <input
              type="text"
              name="tag"
              className={styles["input-box"]}
              required
              //onChange={onChangeTag}
            />
          </div>
        </div>

        <div className={styles["mt-15"]}>
          <span className={styles["font-bold"]}>내용</span>
          <div className={styles["mt-15"]}>
            <textarea
              required
              name="content"
              className={`${styles["input-box"]} ${styles["board-write-content"]}`}
              rows={20}
              onChange={onChangeContent}
            />
          </div>
        </div>

        <div className={`${styles["float-right"]} ${styles["mr-15"]}`}>
          <button className={`${styles["mr-15"]} ${styles["board-write-btn"]} ${styles["bg-white"]}`}>취소</button>
          <button className={`${styles["board-write-btn"]} ${styles["bg-sub-color"]}`} type="submit">
            작성
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewBoardPage;
