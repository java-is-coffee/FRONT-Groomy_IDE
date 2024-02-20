module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!axios|react-markdown|@uiw/react-markdown-preview)/"
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^monaco-editor": "<rootDir>/node_modules/monaco-editor",
  },
};
