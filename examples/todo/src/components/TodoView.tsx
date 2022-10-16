import { zzIf } from "@lizzi/core";
import { onClick } from "@lizzi/template";
import { Todo } from "../data/Todo";

export function TodoView({
  todo,
  onRemove,
}: {
  todo: Todo;
  onRemove: (todo: Todo) => void;
}) {
  return (
    <div
      class="flex items-center gap-3 cursor-pointer p-1 hover:bg-blue-100 rounded"
      use={[onClick(() => (todo.done.value = !todo.done.value))]}
    >
      <div class="border border-2 border-black w-5 h-5 rounded p-0.5">
        <div
          class={[
            zzIf(todo.done, "bg-blue-700", ""),
            "w-full h-full rounded-sm",
          ]}
        ></div>
      </div>
      <div class={[zzIf(todo.done, "line-through", ""), "grow"]}>
        {todo.todo}
      </div>
      <div
        class="text-xl bg-red-500 rounded-full w-6 h-6 leading-none text-white text-center"
        use={[onClick(() => onRemove(todo))]}
      >
        x
      </div>
    </div>
  );
}
