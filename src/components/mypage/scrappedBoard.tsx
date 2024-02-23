import React, { useEffect } from "react";
import myStyle from "./myPageBoard.module.css";
import { LuClipboardEdit } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import {
  BoardDetails,
  patchContentId,
} from "../../redux/reducers/boardReducer";
import {
  patchScrappedList,
  setBackLog,
} from "../../redux/reducers/myPageReducer";
import { Chip } from "@mui/material";
import getScrappedBoard from "../../api/myPage/getScrappedBoard";
import { setMainOption } from "../../redux/reducers/mainpageReducer";
import { ContentType } from "../../enum/mainOptionType";
import useBoardHooks from "../../hooks/board/boardHook";
import { FaRegCommentDots, FaRegThumbsUp } from "react-icons/fa6";
import { GrView } from "react-icons/gr";

const ScrappedBoard = () => {
  const accessToken = localStorage.getItem("accessToken");

  const scrappedBoardList = useSelector(
    (state: RootState) => state.myPage.scrappedBoardList
  );

  const isBack = useSelector((state: RootState) => state.myPage.isBack);

  const dispatch = useDispatch();

  useEffect(() => {
    if (accessToken === null) {
      return;
    }
    const fetchMyboard = async () => {
      const response = await getScrappedBoard(1);

      if (response) {
        dispatch(patchScrappedList(response));
      }
    };
    if (scrappedBoardList === null) {
      fetchMyboard();
    }
  }, [accessToken, scrappedBoardList, dispatch]);

  const boardHooks = useBoardHooks();
  const switchBoard = (id: number) => {
    dispatch(patchContentId(id));
    boardHooks.updateCommentList(id);
    dispatch(setMainOption(ContentType.BoardContent));
    dispatch(setBackLog(!isBack));
  };

  return (
    <div>
      <div className={myStyle.top}>
        <LuClipboardEdit style={{ marginRight: "10px" }} />
        스크랩한 게시글
      </div>
      <div>
        {scrappedBoardList &&
          scrappedBoardList.map((item: BoardDetails) => (
            <div
              key={item.boardId + "sc"}
              onClick={() => switchBoard(item.boardId)}
              style={{ cursor: "pointer" }}
            >
              <div className={myStyle.item}>
                {item.completed ? (
                  <span className={myStyle["box"]}>해결됨</span>
                ) : (
                  <span className={myStyle["box"]}>미해결</span>
                )}
                {item.title}
                <span className={myStyle["bottom"]}>
                  <span className={myStyle["bottom-icon"]}>
                    <span className={myStyle["bottom-icon-number"]}>
                      <Chip
                        avatar={<FaRegThumbsUp />}
                        label={item.helpNumber}
                        size="small"
                        variant="outlined"
                      />
                    </span>
                  </span>
                  {/* 도움, 댓글 갯수  */}
                  <span className={myStyle["bottom-icon"]}>
                    <Chip
                      avatar={<GrView />}
                      label={item.viewNumber}
                      size="small"
                      variant="outlined"
                    />
                  </span>
                  <span className={myStyle["bottom-icon"]}>
                    <Chip
                      avatar={<FaRegCommentDots />}
                      label={item.commentNumber}
                      size="small"
                      variant="outlined"
                    />
                  </span>
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ScrappedBoard;
