// projectsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectDetails } from "../../api/project/patchProjectList";

// 초기 상태의 타입 정의
interface ProjectsState {
  projects: ProjectDetails[] | null;
}

// 초기 상태
const initialState: ProjectsState = {
  projects: null,
};

const projectReducer = createSlice({
  name: "projects",
  initialState,
  reducers: {
    patchProjects: (state, action: PayloadAction<ProjectDetails[]>) => {
      state.projects = action.payload;
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
export const { patchProjects, removeProjects } = projectReducer.actions;
export default projectReducer.reducer;