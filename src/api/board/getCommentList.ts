import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/comment/board";

export interface CommentDetails {
  boardId: number;
  commentId: number;
  content: string;
  nickname: string;
  helpNumber: number;
  createdTime: string;
  originComment: number | null;
  memberId: number;
  memberHelpNumber: number;
  commentStatus: string;
}

export interface BoardId {
  boardId: number | null;
}

function sortByHierarchy(arr: CommentDetails[]) {
  const sortedArr: CommentDetails[] = [];

  // 부모가 null인 객체를 먼저 정렬
  const parents = arr.filter((item) => item.originComment === null);

  parents.forEach((parent) => {
    //부모 중 자식이 있다면.
    if (
      hasChildren(arr, parent.commentId) ||
      parent.commentStatus !== "DELETED"
    ) {
      sortedArr.push(parent);
    }

    // 부모에 해당하는 자손을 찾아서 정렬
    const children = arr.filter(
      (item) => item.originComment === parent.commentId
    );
    children.forEach((child) => {
      sortedArr.push(child);
    });
  });

  return sortedArr;
}

const hasChildren = (arr: CommentDetails[], parentId: number) => {
  return arr.some((children) => {
    return children.originComment === parentId;
  });
};

export const getCommentList = async ({
  boardId,
}: BoardId): Promise<CommentDetails[] | null> => {
  console.log("코멘트 리스트확인");
  const storedToken = localStorage.getItem("accessToken");
  const tempBoardId: BoardId = {
    boardId: boardId,
  };

  if (!storedToken) {
    console.error("Access token not found. Please login again.");
    return null;
  }
  const config = {
    headers: {
      Authorization: `Bearer ${storedToken}`,
    },
  };
  try {
    const response = await axios.get<CommentDetails[]>(
      `${USER_API_URL}/${boardId}`,
      config
    );
    if (response.status === 200) {
      const setUp = sortByHierarchy(response.data);
      console.log(response.data);
      console.log(setUp);

      return setUp;
    } else {
      console.error(
        "Failed to fetch project list with status code:",
        response.status
      );
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching project list:", error.response?.data);
      if (error.response?.status === 401) {
        const isTokenRefreshed = await patchAccessToken();
        if (isTokenRefreshed) {
          return getCommentList(tempBoardId);
        }
      }
    } else {
      console.error("댓글 로드 실패", error);
    }

    return null;
  }
};
