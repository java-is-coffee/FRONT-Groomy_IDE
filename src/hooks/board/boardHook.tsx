import { useDispatch } from "react-redux";
//import { RootState } from "../../redux/store/store";
import { PageNumber, getBoardList } from "../../api/board/getBoardList";
import {
  BoardDetails,
  patchBoardList,
  patchCommentList,
  patchContent,
} from "../../redux/reducers/boardReducer";
import {
  BoardId,
  CommentDetails,
  getCommentList,
} from "../../api/board/getCommentList";
import { getBoardContent } from "../../api/board/getBoardContent";
import IdeOptionType from "../../enum/ideOptionType";
import { ContentType } from "../../enum/mainOptionType";
import { setIdeOption } from "../../redux/reducers/ide/ideOptionReducer";
import { setMainOption } from "../../redux/reducers/mainpageReducer";

function useBoardHooks() {
  //보드 리스트
  //const boardStatus = useSelector((state: RootState) => state.board.boardList);
  const dispatch = useDispatch();

  const updateBoardList = async (pageNumber: number) => {
    try {
      console.log("보드 패치시작");

      const Page: PageNumber = {
        page: pageNumber,
      };
      const storedBoard: BoardDetails[] | null = await getBoardList(Page);
      if (storedBoard) {
        console.log(storedBoard);
        dispatch(patchBoardList(storedBoard));
      }
    } catch (error) {
      alert("보드 업데이트 실패");
    }
  };

  const updateBoardDetail = async (id: number) => {
    try {
      const board: BoardId = {
        boardId: id,
      };
      console.log("보드 패치 시작");
      const storedBoard: BoardDetails | null = await getBoardContent(board);

      if (storedBoard) {
        dispatch(patchContent(storedBoard));
      }
    } catch (error) {
      console.log("api 에러");
    }
  };

  const updateCommentList = async (id: number | null) => {
    if (id === null) {
      console.log("통신 실패");
      return;
    }
    try {
      console.log("댓글 조회");
      const content: BoardId = {
        boardId: id,
      };
      const storedComment: CommentDetails[] | null = await getCommentList(
        content
      );
      if (storedComment) {
        dispatch(patchCommentList(storedComment));
      }
    } catch (error) {
      console.log("api 에러");
    }
  };

  function dateFormat(date: string | undefined): string {
    if (date) {
      let editDate = date.substring(0, 19);
      let sliceDate = editDate.split("T");

      const result = sliceDate[0] + " " + sliceDate[1];
      return result;
    }
    return "null";
  }

  const switchOption = (option: string) => {
    switch (option) {
      case "content":
        dispatch(setIdeOption(IdeOptionType.BoardContent));
        dispatch(setMainOption(ContentType.BoardContent));
        return;

      case "write":
        dispatch(setIdeOption(IdeOptionType.BoardWrite));
        dispatch(setMainOption(ContentType.BoardWrite));
        return;
      case "list":
        dispatch(setIdeOption(IdeOptionType.BoardList));
        dispatch(setMainOption(ContentType.BoardList));
        return;
      default:
        return;
    }
  };

  return {
    updateBoardList,
    updateCommentList,
    updateBoardDetail,
    dateFormat,
    switchOption,
  };
}

export default useBoardHooks;
