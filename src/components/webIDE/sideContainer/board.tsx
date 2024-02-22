import BoardListContainer from "../../newBoard/board/boardList";
import sideStyles from "./sideContents.module.css";

const Board = () => {
  return (
    <div className={sideStyles[`side-content`]}>
      <div className={sideStyles[`side-container-header`]}>
        <span className={sideStyles[`side-container-title`]}>BOARD</span>
      </div>
      <div>
        <BoardListContainer />
      </div>
    </div>
  );
};

export default Board;
