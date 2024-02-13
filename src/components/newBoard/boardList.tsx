import React, { useEffect } from "react";
import "../../styles/project/projectListContainer.css";
import "../../styles/board/board.css";
import BoardItem from "./boardItem";
import { ContentType } from "../../routes/home";
import { patchBoardList, PageNumber } from "../../api/board/patchBoardList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import {
  BoardDetails,
  patchBoard,
  patchComment,
  patchContent,
  patchContentId,
  patchIsEdited,
} from "../../redux/reducers/boardReducer";
import { FaClipboardQuestion } from "react-icons/fa6";
import Paging from "./paging";
import { patchBoardContent } from "../../api/board/patchBoardContent";
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
  // const test = useSelector((state: RootState) => state.board.content);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(patchIsEdited(false));
    const fetchBoardistData = async () => {
      try {
        const Page: PageNumber = {
          page: 1,
        };
        console.log("보드 패치 시작");
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

  //누르는 보드 아이디 기반으로 보드 정보 가져오기
  const fetchBoardData = async (id: number) => {
    try {
      const content: BoardId = {
        boardId: id,
      };
      const storedContent: BoardDetails | null = await patchBoardContent(
        content
      );
      console.log(storedContent);
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

    if (targetId) {
      const fetchContentId = parseInt(targetId);

      fetchBoardData(fetchContentId);
      fetchCommentList(fetchContentId);

      //진입하는 컨텐츠의 아이디
      dispatch(patchContentId(fetchContentId));
      onSelectContents(ContentType.BoardContent);
    } else {
      onSelectContents(ContentType.BoardWrite);
      console.log("글쓰기");
    }
  };

  return (
    <div className="w-50 p-15 test box-border">
      <div className="board-top  line-bottom display-flex-start">
        <FaClipboardQuestion className="mr-15" size={25} />
        질문 게시판
      </div>
      {boardList &&
        boardList.map((item: BoardDetails) => (
          <div
            key={item.boardId}
            id={`${item.boardId}`}
            onClick={chageComponent}
          >
            <BoardItem key={item.boardId} BoardDetails={item} />
          </div>
        ))}

      {/* 글쓰기 버튼 */}
      <div className="board-writing-btn" onClick={chageComponent}>
        글쓰기
      </div>
      <div className="display-flex-justify-center">
        <Paging />
      </div>
    </div>
  );
};
export default BoardListContainer;
