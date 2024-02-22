import { useParams } from "react-router-dom";
import useWebSocket from "../../../hooks/useWebSocket";

import sideStyles from "./sideContents.module.css";

const LiveShare = () => {
  const { disconnect } = useWebSocket();
  const { projectId } = useParams();
  const handleSharing = () => {
    // connect("ws/project");
  };
  const handleDisconnect = () => {
    if (projectId) {
      disconnect(projectId);
    }
  };

  return (
    <div className={sideStyles[`side-content`]}>
      <div className={sideStyles[`side-container-header`]}>
        <span className={sideStyles[`side-container-title`]}>Live share</span>
      </div>
      <div className={sideStyles[`explore-tree-view`]}>
        <button onClick={handleSharing}>연결하기</button>
        <button onClick={handleDisconnect}>종료하기</button>
      </div>
    </div>
  );
};

export default LiveShare;
