// webpack.config.js
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const path = require("path");

module.exports = {
  // 엔트리 포인트 및 다른 웹팩 설정...
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"), // 번들 파일을 저장할 경로
    filename: "bundle.js", // 번들 파일의 이름
    publicPath:
      "http://groomy-ide-front.s3-website.ap-northeast-2.amazonaws.com/", // 웹 서
  },
  plugins: [new MonacoWebpackPlugin()],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 8080, // 원하는 포트 번호로 변경
    open: true, // 서버 시작 시 브라우저 자동 열기
  },
};
