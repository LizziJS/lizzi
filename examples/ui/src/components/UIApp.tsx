import {
  zzBoolean,
  zzReactive,
  zzString,
  zzObject,
  IDestructor,
} from "@lizzi/core";
import { EventWrapper, zzEvent } from "@lizzi/core";
import {
  on,
  ViewComponent,
  If,
  onClick,
  updateInputValue,
  onInputChange,
  useEffect,
  Else,
  ViewElement,
} from "@lizzi/template";
import { JSX } from "@lizzi/jsx-runtime";
import { names, People } from "../data/people";

class ComboboxOptions extends ViewComponent {
  protected comboBox = this.zzParentContext(Combobox<any>);

  protected activeOption = new zzObject<ComboboxOption<any>>();

  selectOption(option: ComboboxOption<any> | null) {
    if (option) {
      this.setActiveOption(option);
      this.comboBox.value?.selectValue(option.value);
    }
  }

  setActiveOption(option: ComboboxOption<any> | null) {
    this.activeOption.value = option;
  }

  getOptionAfter(afterValue: any) {
    const options = this.findChildNodes(ComboboxOption);

    const index = options.findIndex((option) => option === afterValue);

    if (index === -1) return options.at(0) ?? null;

    return options[index + 1] ?? null;
  }

  getOptionBefore(beforeValue: any) {
    const options = this.findChildNodes(ComboboxOption);

    const index = options.findIndex((option) => option === beforeValue);

    if (index === -1) return options.at(-1) ?? null;

    return options[index - 1] ?? null;
  }

  constructor({ children }: JSX.PropsWithChildren) {
    super();

    this.activeOption.onChange.addListener((ev) => {
      if (ev.last) {
        ev.last.isActive.value = false;
      }

      if (ev.value) {
        ev.value.isActive.value = true;
      }
    });

    this.onMount(() => {
      this.addToUnmount(
        new EventWrapper(document, "keydown", ((ev: KeyboardEvent) => {
          if (!this.comboBox.value?.isOpenOptions.value) return;

          if (ev.code === "ArrowUp") {
            this.activeOption.value =
              this.getOptionBefore(this.activeOption.value) ?? null;
          }
          if (ev.code === "ArrowDown") {
            this.activeOption.value =
              this.getOptionAfter(this.activeOption.value) ?? null;
          }
          if (ev.code === "Enter") {
            this.selectOption(this.activeOption.value);
          }
        }) as any)
      );
    });

    this.append(
      <If condition={() => this.comboBox.value?.isOpenOptions.value}>
        {children}
      </If>
    );
  }
}

class ComboboxOption<T extends any> extends ViewComponent {
  readonly value: T;
  readonly isActive = new zzBoolean(false);

  protected comboBoxOptions = this.zzParentContext(ComboboxOptions);

  changeValue() {
    this.comboBoxOptions.value?.selectOption(this);
  }

  activeValue() {
    this.comboBoxOptions.value?.setActiveOption(this);
  }

  constructor({
    children,
    value,
  }: {
    value: T;
    children: JSX.FuncChildrens<ComboboxOption<T>>;
  }) {
    super();

    this.value = value;

    this.append(this.callChildrenFunc(children));
  }
}

class ComboboxInput extends ViewComponent {
  constructor({ use, ...args }: JSX.Attributes<"input">) {
    super();

    const comboBox = this.zzParentContext(Combobox);

    this.append(
      <input
        {...args}
        use={[
          ...(use ?? []),
          on("focus", (ev, view) => {
            comboBox.value?.openOptions();
            view.element.select();
          }),
          useEffect((inputRef) => {
            if (!comboBox.value?.isOpenOptions.value) {
              inputRef.element.blur();
            }
          }),
        ]}
      />
    );
  }
}

class Combobox<T> extends ViewComponent {
  readonly onChange = new zzEvent<(value: T) => void>();

  readonly isOpenOptions: zzBoolean;
  readonly selected: zzReactive<T | null>;

  openOptions() {
    this.isOpenOptions.value = true;
  }

  closeOptions() {
    this.isOpenOptions.value = false;
  }

  selectValue(value: T) {
    this.selected.value = value;

    this.closeOptions();

    this.onChange.emit(value);
  }

  constructor({
    children,
    onChange,
  }: {
    children: JSX.FuncChildrens<Combobox<T>>;
    onChange: (value: T) => void;
  }) {
    super();

    onChange && this.onChange.addListener(onChange);

    this.selected = new zzReactive<T | null>(null);

    this.isOpenOptions = new zzBoolean(false);

    this.append(this.callChildrenFunc(children));
  }

  static Options({ children }: JSX.PropsWithChildren) {
    return <ComboboxOptions>{children}</ComboboxOptions>;
  }

  static Option<T>({
    children,
    value,
  }: {
    value: T;
    children: JSX.FuncChildrens<ComboboxOption<T>>;
  }) {
    return <ComboboxOption value={value}>{children}</ComboboxOption>;
  }

  static Input(args: JSX.Attributes<"input">) {
    return <ComboboxInput {...args} />;
  }
}

function onClickOutside(fn: () => void) {
  return (view: ViewElement<any>) => {
    view.addToUnmount(
      new EventWrapper(document, "click", (ev) => {
        ev.stopPropagation();
        if (!view.element.contains(ev.target as any)) {
          fn();
        }
      })
    );
  };
}

export function UIApp() {
  const filterInput = new zzString("");

  const sortedPeople = names.sort((p1, p2) =>
    p1.name.value.localeCompare(p2.name.value)
  );

  const filteredPeople = sortedPeople.filter(
    (people) =>
      people.name.value
        .toLocaleLowerCase()
        .startsWith(filterInput.value.toLocaleLowerCase()),
    filterInput
  );

  return (
    <Combobox<People> onChange={() => (filterInput.value = "")}>
      {(comboBox) => (
        <div
          class="relative m-2"
          use={[
            onClickOutside(() => {
              comboBox.closeOptions();
            }),
          ]}
        >
          <Combobox.Input
            class="border border-2 border-gray-300 w-full p-1 rounded-md"
            use={[
              updateInputValue(() => comboBox.selected.value?.name.value ?? ""),
              onInputChange((value) => (filterInput.value = value)),
            ]}
          />
          <Combobox.Options>
            <div class="absolute max-h-[20rem] w-full overflow-auto border border-2 border-gray-300 p-1 mt-1 rounded-md">
              <If condition={() => filteredPeople.length > 0}>
                {filteredPeople.map((person, index) => (
                  <Combobox.Option value={person}>
                    {(option) => (
                      <button
                        class="focus:bg-purple-500 block w-full text-left p-1 rounded-md"
                        use={[
                          onClick(() => option.changeValue()),
                          on("mouseenter", () => option.activeValue()),
                          useEffect((view) => {
                            if (option.isActive.value) {
                              view.element.focus();
                            }
                          }),
                        ]}
                      >
                        {index} {person.name}
                      </button>
                    )}
                  </Combobox.Option>
                ))}
                <Else>
                  <div class="text-sm">Nothing found.</div>
                </Else>
              </If>
            </div>
          </Combobox.Options>
        </div>
      )}
    </Combobox>
  );
}
