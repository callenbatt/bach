/* @refresh reload */
import { render } from "solid-js/web";

import { HopeProvider } from "@hope-ui/core";

import "./index.css";
import App from "./App";

render(
  () => (
    <HopeProvider>
      <App />
    </HopeProvider>
  ),
  document.getElementById("root") as HTMLElement
);
