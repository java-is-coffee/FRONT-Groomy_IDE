import RenderTree from "./renderTree";

import sideStyles from "./sideContents.module.css";

const Explorer = () => {
  return (
    <div className={sideStyles[`side-content`]}>
      <div className={sideStyles[`side-container-header`]}>
        <span className={sideStyles[`side-container-title`]}>EXPLORER</span>
      </div>
      <RenderTree />
    </div>
  );
};

export default Explorer;
