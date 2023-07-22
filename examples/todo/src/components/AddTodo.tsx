import { zz } from "@lizzi/core";
import { on, onInput, zzHtmlComponent } from "@lizzi/template";

export class AddTodo extends zzHtmlComponent {
  readonly onAdd = zz.Event<(newTodo: string) => void>();

  constructor({ onAdd }: { onAdd: (newTodo: string) => void }) {
    super();

    this.onAdd.addListener(onAdd);

    const newTodo = zz.String("");

    this.append(
      <form
        class="flex gap-2"
        use={[
          on("submit", (ev: SubmitEvent) => {
            ev.preventDefault();

            if (newTodo.value === "") return;

            this.onAdd.emit(newTodo.value);

            newTodo.value = "";
          }),
        ]}
      >
        <input
          type="text"
          id="add_todo"
          class="grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
          focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="What todo?"
          use={[onInput(newTodo)]}
        />
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
          Add
        </button>
      </form>
    );
  }
}
