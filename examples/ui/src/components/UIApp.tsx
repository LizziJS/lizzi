import {
  zzArray,
  zzBoolean,
  zzMakeReactive,
  zzReactive,
  zzRoV,
  zzString,
} from "@lizzi/core";
import { EventWrapper, zzEvent } from "@lizzi/core/Event";
import {
  on,
  ViewComponent,
  If,
  onInput,
  DomElementView,
  onClick,
} from "@lizzi/template";
import { JSX } from "@lizzi/template/jsx-runtime";
import { names, People } from "../data/people";

class ComboboxOptions extends ViewComponent {
  getOptionAfter(afterValue: any) {
    const options = this.filterChilds<ComboboxOption<any>>(
      (view) => view instanceof ComboboxOption
    );

    const index = options.findIndex((option) => option.value === afterValue);

    if (index === -1) return options[0] ?? null;

    return options[index + 1] ?? null;
  }

  getOptionBefore(beforeValue: any) {
    const options = this.filterChilds<ComboboxOption<any>>(
      (view) => view instanceof ComboboxOption
    );

    const index = options.findIndex((option) => option.value === beforeValue);

    if (index === -1) return null;

    return options[index - 1] ?? null;
  }

  constructor({ children }: JSX.PropsWithChildren) {
    super();

    this.onMount(() => {
      const comboBox = this.parentContext(Combobox);

      this.append(<If condition={comboBox.isOpenOptions}>{children}</If>);

      this.addToUnmount(
        new EventWrapper(document, "keydown", ((ev: KeyboardEvent) => {
          if (ev.code === "ArrowUp") {
            comboBox.activeValue(
              this.getOptionBefore(comboBox.active.value)?.value ?? null
            );
          }
          if (ev.code === "ArrowDown") {
            comboBox.activeValue(
              this.getOptionAfter(comboBox.active.value)?.value ?? null
            );
          }
        }) as any)
      );

      this.onceUnmount(() => this.removeAllChilds());
    });
  }
}

class ComboboxOption<T extends any> extends ViewComponent {
  readonly value: T;

  constructor({ children, value }: JSX.PropsWithChildren<{ value: T }>) {
    super();

    this.value = value;

    this.onMount(() => {
      const comboBox = this.parentContext(Combobox);

      this.append(
        <div
          use={[
            onClick(() => {
              comboBox.selectValue(value);
            }),
            on("mouseenter", () => comboBox.activeValue(value)),
          ]}
        >
          {children}
        </div>
      );

      this.onceUnmount(() => this.removeAllChilds());
    });
  }
}

class ComboboxInput extends ViewComponent {
  constructor({ use, ...args }: JSX.Attributes<"input">) {
    super();

    const inputView = (
      <input
        {...args}
        use={[
          ...(use ?? []),
          on("focus", () => {
            const comboBox = this.parentContext(Combobox);
            comboBox.openOptions();

            inputView.element.select();
          }),
        ]}
      />
    ) as DomElementView<HTMLInputElement>;

    this.append(inputView);
  }
}

class Combobox<T> extends ViewComponent {
  readonly onChange = new zzEvent<(value: T) => void>();

  readonly isOpenOptions: zzBoolean;
  readonly selected: zzReactive<T | null>;
  readonly active: zzReactive<T | null>;

  openOptions() {
    this.isOpenOptions.value = true;
  }

  closeOptions() {
    this.isOpenOptions.value = false;
  }

  activeValue(value: T) {
    this.active.value = value;
  }

  selectValue(value: T) {
    this.selected.value = value;

    this.closeOptions();

    this.onChange.emit(value);
  }

  constructor({
    children,
    defaultValue,
    onSelect,
  }: JSX.PropsWithChildren<
    {
      defaultValue: zzRoV<T | null>;
      onSelect?: (value: T) => void;
    },
    Combobox<T>
  >) {
    super({ children });

    this.selected = new zzReactive<T | null>(null);
    this.active = new zzReactive<T | null>(zzMakeReactive(defaultValue).value);

    this.isOpenOptions = new zzBoolean(false);

    if (onSelect) {
      this.onChange.addListener(onSelect);
    }
  }

  static Options({ children }: JSX.PropsWithChildren) {
    return <ComboboxOptions>{children}</ComboboxOptions>;
  }

  static Option({ children, value }: JSX.PropsWithChildren<{ value: any }>) {
    return <ComboboxOption value={value}>{children}</ComboboxOption>;
  }

  static Input(args: JSX.Attributes<"input">) {
    return <ComboboxInput {...args} />;
  }
}

export function UIApp() {
  const filterInput = new zzString("");

  const filteredPeople = names.filter(
    (people) =>
      people.name.value
        .toLocaleLowerCase()
        .startsWith(filterInput.value.toLocaleLowerCase()),
    filterInput
  );

  return (
    <Combobox<People>
      defaultValue={null}
      onSelect={(value) => {
        filterInput.value = value.name.value;
      }}
    >
      <Combobox.Input use={[onInput(filterInput)]} />
      <Combobox.Options>
        {filteredPeople.map((person) => (
          <Combobox.Option value={person}>{person.name}</Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
}
