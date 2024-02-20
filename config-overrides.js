module.exports = function override(config, env) {
  // Webpack이 브라우저 환경에서 'net' 모듈을 해석할 수 없는 문제 해결
  config.resolve.fallback = {
    ...config.resolve.fallback,
    net: false,
  };

  return config;
};
