import { zzString } from "@lizzi/core";
import { on, onInput } from "@lizzi/template";

export function AddTodo({ onAdd }: { onAdd: (todo: string) => void }) {
  const newTodo = new zzString("");

  return (
    <form
      class="flex gap-2"
      use={[
        on("submit", (ev: SubmitEvent) => {
          ev.preventDefault();

          if (newTodo.value === "") return;

          onAdd(newTodo.value);

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
