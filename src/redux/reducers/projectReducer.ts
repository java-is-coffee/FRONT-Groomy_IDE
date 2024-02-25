// projectsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectDetails } from "../../api/project/patchProjectList";
// import { RootState } from "../store/store";

// 초기 상태의 타입 정의
interface ProjectsState {
  projects: ProjectDetails[] | null;
  invitedProjects: ProjectDetails[] | null;
}

// 초기 상태
const initialState: ProjectsState = {
  projects: null,
  invitedProjects: null,
};

const projectReducer = createSlice({
  name: "projects",
  initialState,
  reducers: {
    patchProjects: (state, action: PayloadAction<ProjectDetails[]>) => {
      state.projects = action.payload;
    },
    patchInvitedProjects: (state, action: PayloadAction<ProjectDetails[]>) => {
      state.invitedProjects = action.payload;
    },
    removeInvitedProjects: (state, action: PayloadAction<number>) => {
      if (state.invitedProjects) {
        state.invitedProjects = state.invitedProjects.filter(
          (project) => project.projectId !== action.payload
        );
      }
    },
    removeProjects: (state, action: PayloadAction<number>) => {
      if (state.projects) {
        state.projects = state.projects.filter(
          (project) => project.projectId !== action.payload
        );
      }
    },
  },
});

// 액션 생성자와 리듀서 내보내기
export const {
  patchProjects,
  patchInvitedProjects,
  removeInvitedProjects,
  removeProjects,
} = projectReducer.actions;
export default projectReducer.reducer;
export const selectProjects = (state: { projects: { projects: any } }) =>
  state.projects.projects;
