import useWebSocket from "../../../hooks/useWebSocket";
import "../../../styles/webIDE/sideContainer/explorer.css";

const LiveShare = () => {
  const { connect, subscribe, disconnect } = useWebSocket();
  const handleSharing = () => {
    // connect("ws/project");
  };
  const handleDisconnect = () => {
    disconnect();
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
