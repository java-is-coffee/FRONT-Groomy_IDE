const esModules = [ 
  "react-markdown",
  "vfile",
  "unist-.+",
  "unified",
  "bail",
  "is-plain-obj",
  "trough",
  "remark-.+",
  "mdast-util-.+",
  "micromark",
  "parse-entities",
  "character-entities",
  "property-information",
  "comma-separated-tokens",
  "hast-util-whitespace",
  "remark-.+",
  "space-separated-tokens",
  "decode-named-character-reference",
  "ccount",
  "escape-string-regexp",
  "markdown-table",
  "trim-lines",
].join("|"); 

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest", // JS와 JSX 파일도 변환하도록 설정
    [`(${esModules}).+\\.js$`]: "babel-jest", // esModules에 해당하는 파일도 변환
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
