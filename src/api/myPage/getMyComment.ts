import React from "react";
import axios from "axios";
import { patchAccessToken } from "../auth/patchAccessToken";
import { CommentDetails } from "../board/getCommentList";

const getMyCommentList = async (
  memberId: number
): Promise<CommentDetails[] | null> => {
  const BASE_URL =
    "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/comment/member/";

  const storedToken = localStorage.getItem("accessToken");
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
    const reqeustURL = BASE_URL + memberId;
    const response = await axios.get(reqeustURL, config);

    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    } else {
      console.log("통신 실패");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching project list:", error.response?.data);
      if (error.response?.status === 401) {
        const isTokenRefreshed = await patchAccessToken();
        if (isTokenRefreshed) {
          return getMyCommentList(memberId);
        }
      }
    } else {
      console.error("게시판 로드 실패", error);
    }
  }

  return null;
};

export default getMyCommentList;
