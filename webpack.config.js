const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  // 기존 설정들...
  resolve: {
    fallback: {
      net: false,
    },
  },
  plugins: [new MonacoWebpackPlugin()],
};
