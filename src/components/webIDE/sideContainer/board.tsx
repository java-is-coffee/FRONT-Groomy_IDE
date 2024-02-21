import styles from "../../../styles/webIDE/sideContainer/sideContainer.module.css";

const Board = () => {
  return (
    <div className={styles["side-content"]}>
      <div className={styles["side-container-header"]}>
        <span className={styles["side-container-title"]}>BOARD</span>
      </div>
    </div>
  );
};

export default Board;
