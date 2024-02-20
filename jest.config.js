module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest", // JS와 JSX 파일도 변환하도록 설정을 추가합니다.
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@uiw/react-markdown-preview|@uiw/react-md-editor|react-markdown)/)", // 변환해야 하는 모듈을 포함시킵니다.
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^monaco-editor": "<rootDir>/node_modules/monaco-editor",
  },
};
