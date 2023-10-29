import { zz } from "@lizzi/core";
import { zzNode } from "@lizzi/node";
import { Text, onInput } from "@lizzi/template";

export class SearchComponent extends zzNode {
  protected readonly _input = zz.String("");

  constructor() {
    super();

    this.append(
      <div>
        <label
          for="search_todo"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          <Text>Search {this._input}</Text>
        </label>
        <input
          type="text"
          id="search_todo"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
            focus:border-blue-500 block w-full p-2.5"
          placeholder="Type to search"
          use={[onInput(this._input)]}
        />
      </div>
    );
  }

  get input() {
    return this._input.readonly();
  }
}
