import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ProjectDetails } from "../../api/project/patchProjectList";

// 초기 상태의 타입 정의
interface IModalOpen {
  newProjectModalOpen: boolean;
  editProjectDetails: ProjectDetails | null;
  inviteProjectDetails: ProjectDetails | null;
}

// 초기 상태
const initialState: IModalOpen = {
  newProjectModalOpen: false,
  editProjectDetails: null,
  inviteProjectDetails: null,
};

const modalState = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openNewProjectModal: (state) => {
      state.newProjectModalOpen = true;
    },

    closeNewProjectModal: (state) => {
      state.newProjectModalOpen = false;
    },

    openEditProjectModal: (state, action: PayloadAction<ProjectDetails>) => {
      state.editProjectDetails = action.payload;
    },

    closeEditProjectModal: (state) => {
      state.editProjectDetails = null;
    },

    openInviteProjectModal: (state, action: PayloadAction<ProjectDetails>) => {
      state.inviteProjectDetails = action.payload;
    },

    closeInviteProjectModal: (state) => {
      state.inviteProjectDetails = null;
    },
  },
});

// 액션 생성자와 리듀서 내보내기
export const {
  openNewProjectModal,
  closeNewProjectModal,
  openEditProjectModal,
  closeEditProjectModal,
  openInviteProjectModal,
  closeInviteProjectModal,
} = modalState.actions;
export default modalState.reducer;
