import BoardListContainer from "../../newBoard/board/boardList";

const Board = () => {
  return (
    <div className="side-content">
      <div className="side-container-header">
        <span className="side-container-title">BOARD</span>
      </div>
      <div>
        <BoardListContainer />
      </div>
    </div>
  );
};

export default Board;
