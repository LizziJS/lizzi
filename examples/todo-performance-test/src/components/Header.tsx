import { ViewComponent, ViewNode } from "@lizzi/template";
import { AppState } from "../stores/appstate";
import TodoTextInput from "./TodoTextInput";

class Header extends ViewComponent {
  constructor({ store }: { store: AppState }) {
    super();

    const handleSave = (text: string) => {
      if (text.length !== 0) {
        store.addTodo(text);
      }
    };

    this.append(
      <header class="header">
        <h1>todos</h1>
        <TodoTextInput
          newTodo
          onSave={handleSave}
          placeholder="What needs to be done?"
        />
      </header>
    );
  }
}

export default Header;
