import { zzBoolean, zzString } from "@lizzi/core";
import { onEvent, ViewComponent, If, onInput } from "@lizzi/template";
import { JSX } from "@lizzi/template/jsx-runtime";

class ComboboxOptions extends ViewComponent {
  constructor({ children }: { children: JSX.Childrens<ComboboxOptions> }) {
    super();

    this.onMount(() => {
      const comboBox = this.parentContext(Combobox);

      this.append(<If condition={comboBox.isOpenOptions}>{children}</If>);

      this.onceUnmount(() => this.removeAllChilds());
    });
  }
}

class ComboboxInput extends ViewComponent {
  constructor({ use, ...args }: JSX.Attributes<"input">) {
    super();

    this.append(
      <input
        {...args}
        use={[
          ...(use ?? []),
          (inputView) => {
            onEvent("focus", (ev: FocusEvent) => {
              const comboBox = this.parentContext(Combobox);
              comboBox.openOptions();

              inputView.element.select();
            })(inputView);

            onEvent("blur", (ev: FocusEvent) => {
              const comboBox = this.parentContext(Combobox);
              comboBox.closeOptions();
            })(inputView);
          },
        ]}
      />
    );
  }
}

class Combobox extends ViewComponent {
  readonly isOpenOptions: zzBoolean;

  openOptions() {
    this.isOpenOptions.value = true;
  }

  closeOptions() {
    this.isOpenOptions.value = false;
  }

  constructor({ children }: JSX.PropsWithChildren<{}, Combobox>) {
    super({ children });

    this.isOpenOptions = new zzBoolean(false);
  }

  static Options({ children }: JSX.PropsWithChildren) {
    return <ComboboxOptions>{children}</ComboboxOptions>;
  }

  static Input(args: JSX.Attributes<"input">) {
    return <ComboboxInput {...args} />;
  }
}

export function UIApp() {
  const filterInput = new zzString("");

  const filteredPeople = [];

  return (
    <Combobox>
      <Combobox.Input use={[onInput(filterInput)]} />
      <Combobox.Options>
        {filteredPeople.map((person) => (
          <Combobox.Option value={person}>{person}</Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
}
