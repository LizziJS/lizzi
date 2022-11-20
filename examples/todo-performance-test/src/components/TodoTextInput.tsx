import { zzRoV, zzMakeReactive } from "@lizzi/core";
import { onEvent, onInput, ViewComponent, zzCss } from "@lizzi/template";

class TodoTextInput extends ViewComponent {
  constructor({
    text,
    newTodo,
    placeholder,
    onSave,
    editing,
  }: {
    onSave: (text: string) => void;
    text?: zzRoV<string>;
    placeholder?: string;
    editing?: boolean;
    newTodo?: boolean;
  }) {
    super();

    const inputText = zzMakeReactive(text ?? "");

    const handleSubmit = (e: any) => {
      if (e.which === 13) {
        onSave(inputText.value);
        if (newTodo) {
          inputText.value = "";
        }
      }
    };

    const handleBlur = (e: any) => {
      if (!newTodo) {
        onSave(e.target.value);
      }
    };

    this.append(
      <input
        class={[zzCss(editing, "edit"), zzCss(newTodo, "new-todo")]}
        type="text"
        placeholder={placeholder}
        use={[
          (view) => view.element.focus(),
          onInput(inputText),
          onEvent("keydown", handleSubmit),
          onEvent("blur", handleBlur),
        ]}
      />
    );
  }
}

export default TodoTextInput;
