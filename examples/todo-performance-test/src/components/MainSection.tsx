import TodoItem from "./TodoItem";
import Footer from "./Footer";
import { If, onEvent, ViewComponent, ViewNode } from "@lizzi/template";
import { AppState } from "../stores/appstate";

const ToggleAll = ({ store }: { store: AppState }) => (
  <input
    class="toggle-all"
    type="checkbox"
    checked={() => store.completedCount.value === store.todos.length}
    use={[onEvent("change", () => store.completeAll())]}
  />
);

const TodoList = ({ store }: { store: AppState }) => (
  <ul class="todo-list">
    {store.visibleTodos.map((todo) => (
      <TodoItem todo={todo} store={store} />
    ))}
  </ul>
);

class MainSection extends ViewComponent {
  constructor({ store }: { store: AppState }) {
    super();

    this.append(
      <section class="main">
        <If condition={() => store.todos.length}>
          <ToggleAll store={store} />
        </If>
        <If condition={() => store.todos.length}>
          <Footer store={store} />
        </If>
        <TodoList store={store} />
      </section>
    );
  }
}

export default MainSection;
