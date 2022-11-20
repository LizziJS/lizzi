import { ViewComponent, ViewNode } from "@lizzi/template";
import { AppState } from "../stores/appstate";
import Header from "./Header";
import MainSection from "./MainSection";

export class App extends ViewComponent {
  constructor({ store }: { store: AppState }) {
    super();

    this.append(
      <div>
        <Header store={store} />
        <MainSection store={store} />
      </div>
    );
  }
}
