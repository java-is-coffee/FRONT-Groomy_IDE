import React, { useEffect, useState } from "react";
import BoardItem from "./boardItem";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import { RootState } from "../../../redux/store/store";
import {
  BoardDetails,
  patchBoardList,
  patchContent,
  patchContentId,
  patchIsSeacrh,
  patchPage,
} from "../../../redux/reducers/boardReducer";
import { FaClipboardQuestion } from "react-icons/fa6";
import { SlMagnifier } from "react-icons/sl";
import Paging from "./paging";
import styled from "./boardList.module.css";
import { searchBoardList } from "../../../api/board/searchBoardList";
import useBoardHooks from "../../../hooks/board/boardHook";
import SeachPaging from "./searchPaging";
import { Button, Fab, TextField } from "@mui/material";

export enum SearchCompleted {
  All = "all",
  Completed = "completed",
  NoCompleted = "no-completed",
}

const BoardListContainer = () => {
  const accessToken = localStorage.getItem("accessToken");
  const boardList = useSelector((state: RootState) => state.board.boardList);
  const isSearch = useSelector((state: RootState) => state.board.isSearch);
  const [searchData, setSearchData] = useState("");
  const [searchIsCompleted, setsearchIsCompleted] = useState(
    SearchCompleted.All
  );

  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const dispatch = useDispatch();
  const boardHooks = useBoardHooks();

  useEffect(() => {
    console.log("보드 리스트 업데이트 ");

    const fetchBoardList = async () => {
      await boardHooks.updateBoardList(1);
    };
    if (!boardList) {
      fetchBoardList();
    }
  }, [accessToken, boardList, boardHooks]);

  //타겟 아이디가 존재한다 > 게시글 입장. 타겟 아이디가 없다. 새로운 게시글 작성
  const chageComponent = (event: React.MouseEvent<HTMLDivElement>) => {
    const targetId = event.currentTarget.id;

    if (targetId) {
      const fetchContentId = parseInt(targetId);
      dispatch(patchContentId(fetchContentId));
      boardHooks.updateCommentList(fetchContentId);

      boardHooks.switchOption("content");
    }
    //타겟 id가 존재하지 않는다면 새로운 게시글 이라는뜻.
    else {
      dispatch(patchContent(null));
      boardHooks.switchOption("write");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const inputData = searchData.replace(" ", "+");

    const response = await searchBoardList(1, inputData, searchIsCompleted);
    if (response) {
      dispatch(patchBoardList(response));
      dispatch(patchIsSeacrh(true));
      dispatch(patchPage(null));
    }
    if (response === null) {
      dispatch(patchBoardList([]));
      return (
        <>
          <div>검색 결과가 없습니다.</div>
        </>
      );
    }
  };

  const handleSeacrhComplete = (event: React.MouseEvent<HTMLSpanElement>) => {
    const value = event.currentTarget.getAttribute("id");

    switch (value) {
      case SearchCompleted.All:
        setsearchIsCompleted(SearchCompleted.All);
        break;
      case SearchCompleted.Completed:
        setsearchIsCompleted(SearchCompleted.Completed);
        break;
      case SearchCompleted.NoCompleted:
        setsearchIsCompleted(SearchCompleted.NoCompleted);
        break;
      default:
        setsearchIsCompleted(SearchCompleted.All);
        break;
    }
  };

  //초기화 버튼
  const resetBoadList = () => {
    dispatch(patchBoardList(null));
    dispatch(patchIsSeacrh(false));
    dispatch(patchContent(null));
    dispatch(patchPage(null));
  };

  return (
    <div className={styled["list-container"]}>
      <div className={styled["header"]}>
      <span>질문 게시판</span>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FaClipboardQuestion
          className="mr-15"
          size={25}
          onClick={resetBoadList}
        />
        <SlMagnifier
          size={25}
          onClick={() => setSearchModalOpen(!searchModalOpen)}
        />
      </div>
    </div>
      
      {/* 검색 파트 */}
      <div
        id="searchForm"
        className={searchModalOpen ? "" : `${styled.hidden}`}
      >
        <form onSubmit={handleSubmit} className={styled["search-box"]}>
          <div>
            <span
              id="all"
              className={`${styled["copmpleted-select-box"]} ${
                styled[
                  searchIsCompleted === SearchCompleted.All ? "selected" : " "
                ]
              }`}
              onClick={handleSeacrhComplete}
            >
              전체
            </span>
            <span
              id="completed"
              className={`${styled["copmpleted-select-box"]} ${
                styled[
                  searchIsCompleted === SearchCompleted.Completed
                    ? "selected"
                    : " "
                ]
              }`}
              onClick={handleSeacrhComplete}
            >
              해결됨
            </span>
            <span
              id="no-completed"
              className={`${styled["copmpleted-select-box"]} ${
                styled[
                  searchIsCompleted === SearchCompleted.NoCompleted
                    ? "selected"
                    : " "
                ]
              }`}
              onClick={handleSeacrhComplete}
            >
              미해결
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              style={{ marginLeft: "-1px", marginTop: "30px" }}
              id="standard-helperText"
              sx={{
                m: 1,
                backgroundColor: "white",
                borderColor: "#d9d9d9",
                ":hover": { borderColor: "black" },
              }}
              label="검색어 입력"
              fullWidth
              size="small"
              onChange={(val) => setSearchData(val.target.value)}
              helperText="작성자 / 게시글 제목 / 게시글 내용과 관련되어 검색해주세요."
              variant="outlined"
            />
            <Button
              sx={{
                m: 1,
                color: "black",
                backgroundColor: "white",
                float: "right",
                maxHeight: "40px",
                margin: "0px",
                borderColor: "gray",
                ":hover": { borderColor: "black" },
              }}
              type="submit"
              variant="outlined"
            >
              검색
            </Button>
          </div>
        </form>
      </div>

      {/* 게시글 리스트 부분 */}
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

      <div onClick={chageComponent}>
        <Fab
          color="primary"
          aria-label="edit"
          style={{
            float: "right",
            position: "fixed",
            bottom: "10px",
            right: "50px",
          }}
        >
          <EditIcon />
        </Fab>
      </div>

      {isSearch ? (
        <div className={styled["paging"]}>
          <SeachPaging
            searchData={searchData}
            searchIsCompleted={searchIsCompleted}
          />
        </div>
      ) : (
        <div className={styled["paging"]}>
          <Paging />
        </div>
      )}
    </div>
  );
};
export default BoardListContainer;
