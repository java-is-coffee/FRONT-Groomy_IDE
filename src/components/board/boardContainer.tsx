import React from "react";
import BoardCard from "./boardCard";
import "../../styles/board/board.css";
import { useNavigate } from "react-router-dom";
import { FaClipboardQuestion } from "react-icons/fa6";
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
  const navigate = useNavigate();
  const goWrite = () => {
    navigate("/board/write");
  };

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
    {
      boardId: 5,
      memberId: 5,
      title: "이게뭐죠5",
      content: "살려줘요5",
      viewNumber: 1,
      helpNumber: 1,
      commentNumber: 1,
      completed: false,
    },
    {
      boardId: 6,
      memberId: 6,
      title: "이게뭐죠6",
      content: "살려줘요6",
      viewNumber: 6,
      helpNumber: 6,
      commentNumber: 6,
      completed: false,
    },
    {
      boardId: 7,
      memberId: 7,
      title: "이게뭐죠7",
      content: "살려줘요7",
      viewNumber: 7,
      helpNumber: 7,
      commentNumber: 7,
      completed: false,
    },
    {
      boardId: 8,
      memberId: 8,
      title: "이게뭐죠8",
      content: "살려줘요8",
      viewNumber: 8,
      helpNumber: 8,
      commentNumber: 8,
      completed: false,
    },
    {
      boardId: 9,
      memberId: 9,
      title: "이게뭐죠9",
      content: "0살려줘요",
      viewNumber: 9,
      helpNumber: 19,
      commentNumber: 19,
      completed: false,
    },
    {
      boardId: 10,
      memberId: 10,
      title: "이게뭐죠10",
      content: "살려줘요21",
      viewNumber: 10,
      helpNumber: 10,
      commentNumber: 1,
      completed: false,
    },
  ];

  function goContent(e: React.MouseEvent<HTMLElement>): void {
    const id = e.currentTarget.id;
    navigate("/board/content/" + id);
  }

  //   const [boardList, setboardList] = useState({} ? test_boardList : undefined);
  //   setboardList(test_boardList);

  return (
    <div className="w-50 p-15 test box-border">
      <div className="board-top  line-bottom display-flex-start">
        <FaClipboardQuestion className="mr-15" size={25} />
        질문 게시판
      </div>
      <div className="">
        {boardList.map((board) => (
          <div onClick={goContent} id={`${board.boardId}`}>
            <BoardCard key={board.boardId} boardItem={board} />
          </div>
        ))}

        {/* {boardList.map((board) => {
          if (board.boardId > 5)
            return (
              <div>
                <BoardCard key={board.boardId} boardItem={board} />
              </div>
            );
        })} */}
      </div>
      <button className="board-writing-btn" onClick={goWrite}>
        글쓰기
      </button>
    </div>
  );
}

export default BoradContainer;
