import { zzCompute, zzString } from "@lizzi/core";
import { onClick, onInput, ViewComponent } from "@lizzi/template";
import { JSX } from "@lizzi/template/jsx-runtime";

function FilterButton({
  children,
  filter,
  activeValue,
}: {
  children: JSX.Childrens;
  filter: zzString<"ALL" | "ACTIVE" | "COMPLETED">;
  activeValue: "ALL" | "ACTIVE" | "COMPLETED";
}) {
  const zzActiveClass = zzCompute(
    () =>
      filter.value === activeValue
        ? "bg-blue-200"
        : "bg-blue-500 hover:bg-blue-700",
    filter
  );

  return (
    <button
      class={[zzActiveClass, "text-white font-bold py-2 px-4 rounded-lg"]}
      use={[onClick(() => (filter.value = activeValue))]}
    >
      {children}
    </button>
  );
}

export class FilterComponent extends ViewComponent {
  readonly filter: zzString<"ALL" | "ACTIVE" | "COMPLETED">;

  constructor() {
    super();

    this.filter = new zzString<"ALL" | "ACTIVE" | "COMPLETED">("ALL");

    this.append(
      <div class="flex gap-1 my-1">
        <FilterButton activeValue="ALL" filter={this.filter}>
          Show all tasks
        </FilterButton>
        <FilterButton activeValue="ACTIVE" filter={this.filter}>
          Show active tasks
        </FilterButton>
        <FilterButton activeValue="COMPLETED" filter={this.filter}>
          Show completed tasks
        </FilterButton>
      </div>
    );
  }
}
