import { zzString } from "@lizzi/core";
import { onInput, zzHtmlComponent } from "@lizzi/template";

export class SearchComponent extends zzHtmlComponent {
  readonly search: zzString;

  constructor() {
    super();

    this.search = new zzString("");

    this.append(
      <div>
        <label
          for="search_todo"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Search
        </label>
        <input
          type="text"
          id="search_todo"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
            focus:border-blue-500 block w-full p-2.5"
          placeholder="Type to search"
          use={[onInput(this.search)]}
        />
      </div>
    );
  }
}
