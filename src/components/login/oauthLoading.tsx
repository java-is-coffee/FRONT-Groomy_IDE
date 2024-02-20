import React from "react";

function oauthLoading() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  return <div>oauthLoading</div>;
}

export default oauthLoading;
