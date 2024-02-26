import React, { useEffect } from "react";
import myStyle from "./myPageBoard.module.css";
import { LuClipboardEdit } from "react-icons/lu";
import getMyboard from "../../api/myPage/getMyboard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import {
  BoardDetails,
  patchContentId,
} from "../../redux/reducers/boardReducer";
import {
  patchMyBoardList,
  setBackLog,
} from "../../redux/reducers/myPageReducer";
import { FaRegCommentDots, FaRegThumbsUp } from "react-icons/fa6";
import { GrView } from "react-icons/gr";
import { Chip } from "@mui/material";
import { ContentType } from "../../enum/mainOptionType";
import { setMainOption } from "../../redux/reducers/mainpageReducer";
import useBoardHooks from "../../hooks/board/boardHook";

const SelfWritten = () => {
  const accessToken = localStorage.getItem("accessToken");
  const boardHooks = useBoardHooks();

  const myboardList = useSelector(
    (state: RootState) => state.myPage.myBoardList
  );

  // const isBack = useSelector((state: RootState) => state.myPage.isBack);

  const dispatch = useDispatch();

  useEffect(() => {
    if (accessToken === null) {
      return;
    }
    const fetchMyboard = async () => {
      const response = await getMyboard(1);

      if (response) {
        dispatch(patchMyBoardList(response));
      }
    };
    if (myboardList === null) {
      fetchMyboard();
    }
  }, [accessToken, myboardList, dispatch]);

  const switchBoard = (id: number) => {
    dispatch(patchContentId(id));
    boardHooks.updateCommentList(id);
    dispatch(setMainOption(ContentType.BoardContent));
    dispatch(setBackLog(true));
  };

  return (
    <div>
      <div className={myStyle.top}>
        <LuClipboardEdit style={{ marginRight: "10px" }} />
        작성한 게시글
      </div>
      <div>
        {myboardList &&
          myboardList.map((item: BoardDetails) => (
            <div
              key={item.boardId}
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

export default SelfWritten;
