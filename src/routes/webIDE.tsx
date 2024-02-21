import { useEffect } from "react";
import IdePage from "../pages/idePage";
import { useDispatch, useSelector } from "react-redux";
import { getMemberInfo } from "../api/auth/getMemberInfo";
import useWebSocket from "../hooks/useWebSocket";
import { setMember } from "../redux/reducers/memberReducer";
import { RootState } from "../redux/store/store";
import { reSetCurEditingCode } from "../redux/reducers/ide/editingCodeReducer";
import { resetItems } from "../redux/reducers/ide/fileSystemReducer";
import { unsubscribe } from "diagnostics_channel";
import { useParams } from "react-router-dom";
import { patchAccessToken } from "../api/auth/patchAccessToken";

const WebIDE = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const member = useSelector((state: RootState) => state.member.member);
  const { stompClient, connect, disconnect, unsubscribe } = useWebSocket();

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

    const fetchToken = async () => {
      try {
        const isUpdateToken = await patchAccessToken();
        if (isUpdateToken) {
          console.log("토큰 재발급 완료");
        } else {
          console.log("토큰 정보 오류");
        }
      } catch (error) {
        console.error("맴버 정보 가져오기 실패:", error);
      }
    };

    fetchToken();

    // 웹소켓 연결이 안되어있는 경우 연결
    if (!stompClient) {
      connect("ws/project");
    } else {
      console.log(stompClient);
    }
    return () => {
      console.log("connection 끊기");
      unsubscribe(`/projectws/${projectId}/code`);
      unsubscribe(`/projectws/${projectId}/files`);
      unsubscribe(`/projectws/${projectId}/messages`);
      disconnect();
      dispatch(reSetCurEditingCode());
      dispatch(resetItems());
    };
  }, [member, dispatch, connect, disconnect, stompClient]);
  return <IdePage />;
};

export default WebIDE;
