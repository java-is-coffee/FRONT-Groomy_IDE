import { useParams } from "react-router-dom";
import useWebSocket from "../../../hooks/useWebSocket";
import "../../../styles/webIDE/sideContainer/explorer.css";

const LiveShare = () => {
  const { disconnect, unsubscribe } = useWebSocket();
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
    <div className="side-content">
      <div className="side-container-header">
        <span className="side-container-title">Live share</span>
      </div>
      <div className="explore-tree-view">
        <button onClick={handleSharing}>연결하기</button>
        <button onClick={handleDisconnect}>종료하기</button>
      </div>
    </div>
  );
};

export default LiveShare;
