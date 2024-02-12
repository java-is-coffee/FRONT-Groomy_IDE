import React, { useEffect } from "react";
import "../../styles/project/projectListContainer.css";
import "../../styles/board/board.css";
import BoardItem from "./boardItem";
import { ContentType } from "../../routes/home";
import {
  BoardDetails,
  patchBoardList,
  PageNumber,
} from "../../api/board/patchBoardList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import {
  patchBoard,
  patchComment,
  patchContent,
  patchContentId,
} from "../../redux/reducers/boardReducer";
import { FaClipboardQuestion } from "react-icons/fa6";
import Paging from "./paging";
import {
  ContentId,
  patchBoardContent,
} from "../../api/board/patchBoardContent";
import {
  BoardId,
  CommentDetails,
  patchCommentList,
} from "../../api/board/patchCommentList";

const BoardListContainer = ({
  onSelectContents,
}: {
  onSelectContents: (content: ContentType) => void;
}) => {
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

  const fetchBoardListData = async (id: number) => {
    try {
      const content: ContentId = {
        contentId: id,
      };
      const storedContent: BoardDetails | null = await patchBoardContent(
        content
      );
      if (storedContent) {
        dispatch(patchContent(storedContent));
      }
    } catch (error) {
      console.log("api 에러");
    }
  };

  const fetchCommentList = async (id: number) => {
    try {
      const content: BoardId = {
        boardId: id,
      };
      const storedContent: CommentDetails[] | null = await patchCommentList(
        content
      );
      if (storedContent) {
        dispatch(patchComment(storedContent));
      }
    } catch (error) {
      console.log("api 에러");
    }
  };

  const chageComponent = (event: React.MouseEvent<HTMLDivElement>) => {
    const targetId = event.currentTarget.id;
    const fetchContentId = parseInt(targetId);

    fetchBoardListData(fetchContentId);
    fetchCommentList(fetchContentId);
    dispatch(patchContentId(fetchContentId));
    onSelectContents(ContentType.BoardContent);
  };

  return (
    <div className="w-50 p-15 test box-border">
      <div className="board-top  line-bottom display-flex-start">
        <FaClipboardQuestion className="mr-15" size={25} />
        질문 게시판
      </div>
      {boardList &&
        boardList.map((item) => (
          <div
            key={item.boardId}
            id={`${item.boardId}`}
            onClick={chageComponent}
          >
            <BoardItem key={item.boardId} BoardDetails={item} />
          </div>
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
