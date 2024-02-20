module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
    "@babel/preset-typescript", // TypeScript를 사용하는 경우 추가
    "@babel/preset-react", // React를 사용하는 경우 추가
  ],
  plugins: [
    "@babel/plugin-transform-runtime",
  ],
};
