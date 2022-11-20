import { zzBoolean, zzCompute, zzIf } from "@lizzi/core";
import {
  Else,
  If,
  onCheckboxInput,
  onClick,
  onEvent,
  ViewComponent,
} from "@lizzi/template";
import { AppState, Todo } from "../stores/appstate";
import TodoTextInput from "./TodoTextInput";

class TodoItem extends ViewComponent {
  constructor({ store, todo }: { store: AppState; todo: Todo }) {
    super();

    const editing = new zzBoolean(false);

    this.append(
      <li>
        <If condition={editing}>
          <TodoTextInput
            text={todo.text}
            editing
            onSave={(text) => {
              if (text.length === 0) {
                store.deleteTodo(todo);
              } else {
                todo.editTodo(text);
              }
              editing.value = false;
            }}
          />
          <Else>
            <div class="view">
              <input
                class="toggle"
                type="checkbox"
                use={[
                  onCheckboxInput(todo.completed, (checked) => {
                    todo.completeTodo(checked);
                  }),
                ]}
              />
              <label
                use={[
                  onEvent("dblclick", () => {
                    editing.value = true;
                  }),
                ]}
              >
                {todo.text}{" "}
                {zzCompute(() =>
                  todo.other.value && todo.other.value.completed.value
                    ? "Yes!"
                    : " . "
                )}
              </label>
              <button
                class="destroy"
                use={[onClick(() => store.deleteTodo(todo))]}
              />
            </div>
          </Else>
        </If>
      </li>
    );
  }
}

export default TodoItem;
