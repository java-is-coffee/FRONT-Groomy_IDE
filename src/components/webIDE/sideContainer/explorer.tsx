import styles from "../../../styles/webIDE/sideContainer/explorer.module.css";
import RenderTree from "./renderTree";

const Explorer = () => {
  return (
    <div className={styles["side-content"]}>
      <div className={styles["side-container-header"]}>
        <span className={styles["side-container-title"]}>EXPLORER</span>
      </div>
      <div className={styles["explore-tree-view"]}>
        <RenderTree />
      </div>
    </div>
  );
};

export default Explorer;
