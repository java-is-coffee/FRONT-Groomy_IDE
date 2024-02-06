import React from "react";
import "../../styles/board/board.css";
// import { FaClipboard } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
import { UserInfo } from "../../routes/boardWrite";
// import axios from "axios";

// const baseUrl =
//   "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/board/write";

// const accessToken = localStorage.getItem("accessToken");
//const [BoardContent, setBoardContent] = useState();
function Content({ userInfo }: { userInfo: UserInfo | null }) {
  // const navigate = useNavigate();
  // const goList = () => {
  //   navigate("/boardTest");
  // };

  return <div className="w-50 p-15 test box-border">test</div>;
}

export default Content;
