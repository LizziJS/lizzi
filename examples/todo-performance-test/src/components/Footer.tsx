import {
  SHOW_ALL,
  SHOW_COMPLETED,
  SHOW_ACTIVE,
  AppState,
  FILTERS,
} from "../stores/appstate";
import { If, onEvent, ViewComponent, ViewNode, zzCss } from "@lizzi/template";
import { zzCompute, zzIf } from "@lizzi/core";

const FILTER_TITLES = {
  [SHOW_ALL]: "All",
  [SHOW_ACTIVE]: "Active",
  [SHOW_COMPLETED]: "Completed",
};

class Footer extends ViewComponent {
  constructor({ store }: { store: AppState }) {
    super();

    const renderTodoCount = () => {
      const activeCount = zzCompute(
        () => store.todos.length - store.completedCount.value
      );
      const itemWord = zzCompute(() =>
        activeCount.value === 1 ? "item" : "items"
      );

      return (
        <span class="todo-count">
          <strong>{zzCompute(() => activeCount.value || "No")}</strong>{" "}
          {itemWord} left
        </span>
      );
    };

    const renderFilterLink = (filter: FILTERS) => {
      const title = FILTER_TITLES[filter];

      return (
        <a
          class={[zzCss(() => filter === store.filter.value, "selected")]}
          style={{ cursor: "pointer" }}
          use={[onEvent("click", () => store.setFilter(filter))]}
        >
          {title}
        </a>
      );
    };

    const renderClearButton = () => {
      return (
        <If condition={() => store.completedCount.value > 0}>
          <button
            class="clear-completed"
            use={[onEvent("click", () => store.clearCompleted())]}
          >
            Clear completed
          </button>
        </If>
      );
    };

    this.append(
      <footer class="footer">
        {renderTodoCount()}
        <ul class="filters">
          {[SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED].map((filter) => (
            <li>{renderFilterLink(filter as any)}</li>
          ))}
        </ul>
        {renderClearButton()}
      </footer>
    );
  }
}

export default Footer;
