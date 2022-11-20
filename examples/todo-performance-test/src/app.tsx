import { Body } from "@lizzi/template";

import "todomvc-app-css/index.css";
import { App } from "./components/App";
import { AppState, Todo } from "./stores/appstate";

// MWE: Generate todos for benchmarking
const STORE_SIZE = 10000;

const initialState: Todo[] = [];

for (var i = 0; i < STORE_SIZE; i++) {
  initialState.push(
    new Todo(
      i,
      "Item" + i,
      false,
      // reference to some other todo item, to similate
      // having references to other objects in the state
      i > 0 ? initialState[i - 1] : null
    )
  );
}

const store = new AppState(initialState);

Body(
  <div class="todoapp">
    <App store={store} />
  </div>
);
