import { Text, onClick } from "@lizzi/template";
import { Todo } from "../data/Todo";
import { zz } from "@lizzi/core";
import { zzNode } from "@lizzi/node";

type Props = {
  todo: {
    todo: zz.StringRead;
    done: zz.BooleanRead;
  };
  onRemove: (todo: { todo: zz.StringRead; done: zz.BooleanRead }) => void;
  onDone: (todo: { todo: zz.StringRead; done: zz.BooleanRead }) => void;
};

export class TodoView extends zzNode {
  constructor({ todo, onRemove, onDone }: Props) {
    super();

    this.onMount(() => {
      const created = (
        <div
          class="flex items-center gap-3 cursor-pointer p-1 hover:bg-blue-100 rounded"
          use={[onClick(() => onDone(todo))]}
        >
          <div class="border-2 border-black w-5 h-5 rounded p-0.5">
            <div
              class={[
                zz.If(todo.done, "bg-blue-700", ""),
                "w-full h-full rounded-sm",
              ]}
            ></div>
          </div>
          <div class={[zz.If(todo.done, "line-through", ""), "grow"]}>
            <Text>{todo.todo}</Text>
          </div>
          <div
            class="text-xl bg-red-500 w-5 h-5 rounded leading-none text-white text-center"
            use={[onClick(() => onRemove(todo))]}
          >
            <Text>✕</Text>
          </div>
        </div>
      );

      this.append(created);
    });
  }
}
