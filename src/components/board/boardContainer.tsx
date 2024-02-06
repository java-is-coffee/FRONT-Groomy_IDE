import React from "react";
import BoardCard from "./boardCard";
import "../../styles/board/board.css";
export interface BoardDetails {
  boardId: number;
  memberId: number;
  title: string;
  content: string;
  viewNumber: number;
  helpNumber: number;
  commentNumber: number;
  completed: boolean;
}

export interface BoardProps {
  data: BoardDetails;
}

function BoradContainer() {
  const boardList = [
    {
      boardId: 1,
      memberId: 1,
      title: "이게뭐죠",
      content: "살려줘요",
      viewNumber: 1,
      helpNumber: 1,
      commentNumber: 1,
      completed: false,
    },
    {
      boardId: 2,
      memberId: 1,
      title: "이게뭐죠2",
      content: "살려줘요2",
      viewNumber: 1,
      helpNumber: 1,
      commentNumber: 1,
      completed: false,
    },
    {
      boardId: 3,
      memberId: 1,
      title: "이게뭐죠3",
      content: "살려줘요3",
      viewNumber: 1,
      helpNumber: 1,
      commentNumber: 1,
      completed: false,
    },
    {
      boardId: 4,
      memberId: 1,
      title: "이게뭐죠4",
      content: "살려줘요4",
      viewNumber: 1,
      helpNumber: 1,
      commentNumber: 1,
      completed: false,
    },
  ];

  //   const [boardList, setboardList] = useState({} ? test_boardList : undefined);
  //   setboardList(test_boardList);

  return (
    <div className="w-50 p-15 test box-border">
      <div className="">
        {/* 보드 리스트가 만약 없을 */}
        {boardList.map((board) => (
          <div>
            <BoardCard key={board.boardId} boardItem={board} />
          </div>
        ))}
      </div>
      <button className="board-write-btn">글쓰기</button>
    </div>
  );
}

export default BoradContainer;
