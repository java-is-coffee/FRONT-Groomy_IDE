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
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest", // JS와 JSX 파일도 변환하도록 설정을 추가합니다.
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@uiw/react-markdown-preview|@uiw/react-md-editor|react-markdown)/)",
    [`(${esModules}).+\\.js$`]: '<rootDir>/config/jest/babelTransform.js', 
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^monaco-editor": "<rootDir>/node_modules/monaco-editor",
    `[/\\\\]node_modules[/\\\\](?!${esModules}).+\\.(js|jsx|mjs|cjs|ts|tsx)$`,
  },
};
