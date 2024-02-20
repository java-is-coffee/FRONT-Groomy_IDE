module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest", // JS와 JSX 파일도 변환하도록 설정
  },
  transformIgnorePatterns: [
    `node_modules/(?!(${esModules}))/`, // esModules에 해당하지 않는 모듈은 변환에서 제외
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^monaco-editor": "<rootDir>/node_modules/monaco-editor",
    // 필요한 경우 추가 모의 객체 경로 설정
  },
};
