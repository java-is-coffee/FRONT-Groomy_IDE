import "../../../styles/webIDE/sideContainer/explorer.css";
import RenderTree from "./renderTree";

const Explorer = () => {
  return (
    <div className="side-content">
      <div className="side-container-header">
        <span className="side-container-title">EXPLORER</span>
      </div>
      <div className="explore-tree-view">
        <RenderTree />
      </div>
    </div>
  );
};

export default Explorer;
