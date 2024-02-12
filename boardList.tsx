import React, { useEffect } from "react";
import "../../styles/project/projectListContainer.css";
import "../../styles/board/board.css";
import BoardItem from "./boardItem";
import {
  BoardDetails,
  patchBoardList,
  PageNumber,
} from "../../api/board/patchBoardList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { patchBoard } from "../../redux/reducers/boardReducer";
import { FaClipboardQuestion } from "react-icons/fa6";
import Paging from "./paging";

export const BoardListContainer: React.FC = () => {
  const accessToken = localStorage.getItem("accessToken");
  const boardList = useSelector((state: RootState) => state.board.boards);

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchBoardistData = async () => {
      try {
        const Page: PageNumber = {
          page: 1,
        };
        const storedBoard: BoardDetails[] | null = await patchBoardList(Page);
        if (storedBoard) {
          dispatch(patchBoard(storedBoard));
        }
      } catch (error) {
        console.log("api 에러");
      }
    };
    if (!boardList) {
      fetchBoardistData();
    }
  }, [accessToken, boardList, dispatch]);
  return (
    <div className="w-50 p-15 test box-border">
      <div className="board-top  line-bottom display-flex-start">
        <FaClipboardQuestion className="mr-15" size={25} />
        질문 게시판
      </div>
      {boardList &&
        boardList.map((item) => (
          <BoardItem key={item.boardId} BoardDetails={item} />
        ))}

      {/* 글쓰기 버튼 */}
      <button className="board-writing-btn">글쓰기</button>
      <div className="display-flex-justify-center">
        <Paging />
      </div>
    </div>
  );
};
export default BoardListContainer;
