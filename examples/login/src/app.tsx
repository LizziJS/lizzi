import { Body } from "@lizzi/template";

import "./app.css";
import { Register } from "./components/Register";
import { Route, Router } from "@lizzi/router";

Body(
  <Router>
    <Route route={["signin"]}>
      <Register />
    </Route>
    <Route route={["**"]}>
      <div>not found</div>
    </Route>
  </Router>
);
