import { useEffect } from "react";
import IdePage from "../pages/idePage";
import { useDispatch, useSelector } from "react-redux";
import { getMemberInfo } from "../api/auth/getMemberInfo";
import useWebSocket from "../hooks/useWebSocket";
import { setMember } from "../redux/reducers/memberReducer";
import { RootState } from "../redux/store/store";

const WebIDE = () => {
  const dispatch = useDispatch();
  const member = useSelector((state: RootState) => state.member.member);
  const { stompClient, connect, disconnect } = useWebSocket();

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const member = await getMemberInfo();
        console.log(member);
        if (member) {
          dispatch(setMember(member));
        } else {
          console.log("맴버 정보 오류");
        }
      } catch (error) {
        console.error("맴버 정보 가져오기 실패:", error);
      }
    };
    // 멤버 정보 가져오기
    if (!member) {
      fetchMemberInfo();
    }
    // 웹소켓 연결이 안되어있는 경우 연결
    if (!stompClient) {
      connect("ws/project");
    }

    return () => {
      disconnect();
    };
  }, [member, dispatch]);
  return <IdePage />;
};

export default WebIDE;
