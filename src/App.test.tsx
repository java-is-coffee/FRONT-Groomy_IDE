import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "./redux/store/store"; // Or a specific test store if needed
import App from "./App";
import React from "react";

test("renders new project button", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
});
