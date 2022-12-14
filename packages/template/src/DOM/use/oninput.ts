import {
  zzArray,
  zzBoolean,
  zzCompute,
  zzReactive,
  zzStringType,
} from "@lizzi/core";
import { Debounce, EventWrapper } from "@lizzi/core";
import { ViewElement } from "..";

export function onInput<
  E extends ViewElement<HTMLTextAreaElement | HTMLInputElement>
>(
  value: zzReactive<string>,
  onChange?: (value: string) => void
): (view: E) => void;
export function onInput<
  T,
  E extends ViewElement<HTMLTextAreaElement | HTMLInputElement>
>(value: zzReactive<T>, onChange: (value: string) => void): (view: E) => void;
export function onInput<
  T,
  E extends ViewElement<HTMLTextAreaElement | HTMLInputElement>
>(value: zzReactive<T>, onChange?: (value: string) => void) {
  return (view: E) => {
    if (!(value instanceof zzReactive))
      throw new Error("onInput variable is not zzReactive");

    const element = view.element;
    const onInputChange =
      onChange ??
      ((inputValue: string) => {
        value.value = inputValue as T;
      });

    if (
      !(
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      )
    )
      throw new Error(
        "onInput error: Element is not HTMLTextAreaElement | HTMLInputElement"
      );

    view.addToUnmount(
      value.onChange.addListener(() => {
        if (element.value !== String(value.value)) {
          element.value = String(value.value);
        }
      }),
      new EventWrapper(
        element,
        "input",
        () => {
          if (element.value !== String(value.value)) {
            onInputChange(element.value);
          }
        },
        false
      ),
      new EventWrapper(
        element,
        "blur",
        () => {
          if (element.value !== String(value.value)) {
            element.value = String(value.value);
          }
        },
        false
      )
    );

    element.value = String(value.value);
  };
}

export function updateInputValue<
  E extends ViewElement<HTMLTextAreaElement | HTMLInputElement>
>(value: zzReactive<string> | (() => string)) {
  return (view: E) => {
    const element = view.element;

    if (typeof value === "function") {
      value = zzCompute(value);
    }

    if (!(value instanceof zzReactive))
      throw new Error("updateInputValue variable is not zzReactive");

    const reactiveValue = value as zzReactive<any>;

    if (
      !(
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      )
    )
      throw new Error(
        "updateInputValue error: Element is not HTMLTextAreaElement | HTMLInputElement"
      );

    view.addToUnmount(
      value.onChange.addListener(() => {
        if (element.value !== String(reactiveValue.value)) {
          element.value = String(reactiveValue.value);
        }
      }),
      new EventWrapper(
        element,
        "blur",
        () => {
          if (element.value !== String(reactiveValue.value)) {
            element.value = String(reactiveValue.value);
          }
        },
        false
      )
    );

    element.value = String(reactiveValue.value);
  };
}

export function onInputChange<
  E extends ViewElement<HTMLTextAreaElement | HTMLInputElement>
>(onInputChange: (value: string) => void) {
  return (view: E) => {
    const element = view.element;

    if (
      !(
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      )
    )
      throw new Error(
        "onInputChange error: Element is not HTMLTextAreaElement | HTMLInputElement"
      );

    view.addToUnmount(
      new EventWrapper(
        element,
        "input",
        () => {
          onInputChange(element.value);
        },
        false
      )
    );
  };
}

export function AutoResizeTextarea<T extends ViewElement<HTMLTextAreaElement>>(
  value: zzReactive<any>
) {
  return (view: T) => {
    const textElement = view.element;

    if (!(textElement instanceof HTMLTextAreaElement))
      throw new Error(
        "AutoResizeTextarea error: Element is not HTMLTextAreaElement"
      );

    const fn = Debounce(() => {
      textElement.style.height = "auto";
      textElement.style.height = textElement.scrollHeight + "px";
    });

    view.addToUnmount(
      new EventWrapper(textElement, "focus", fn, false),
      new EventWrapper(textElement, "change", fn, false),
      new EventWrapper(textElement, "input", fn, false),
      new EventWrapper(textElement, "cut", fn, false),
      new EventWrapper(textElement, "paste", fn, false),
      new EventWrapper(textElement, "drop", fn, false),
      new EventWrapper(textElement, "keydown", fn, false)
    );

    if (value instanceof zzReactive) {
      view.addToUnmount(value.onChange.addListener(fn));
    }

    fn();

    return value;
  };
}

export function onCheckboxInput<T extends ViewElement<HTMLInputElement>>(
  value: zzArray<string> | zzBoolean | zzStringType,
  onChange?: (checked: boolean, value: string) => void
) {
  return (view: T) => {
    const element = view.element;

    if (!(element instanceof HTMLInputElement))
      throw new Error("onCheckboxInput error: Element is not HTMLInputElement");

    if (value instanceof zzArray) {
      const onChangeInput =
        onChange ??
        ((checked: boolean, elvalue: string) => {
          if (checked) {
            value.add([elvalue]);
          } else {
            value.remove([elvalue]);
          }
        });

      view.addToUnmount(
        value.onAdd.addListener((ev) => {
          if (element.value === ev.added) {
            element.checked = true;
          }
        }),
        value.onRemove.addListener((ev) => {
          if (element.value === ev.removed) {
            element.checked = false;
          }
        }),
        new EventWrapper(
          element,
          "change",
          () => {
            onChangeInput(element.checked, element.value);
          },
          false
        )
      );
    } else if (value instanceof zzBoolean) {
      const onChangeInput =
        onChange ??
        ((checked: boolean, elvalue: string) => {
          value.value = checked;
        });

      view.addToUnmount(
        value.onChange.addListener(() => {
          element.checked = value.value ? true : false;
        }),
        new EventWrapper(
          element,
          "change",
          () => {
            onChangeInput(element.checked, element.value);
          },
          false
        )
      );
    } else if (value instanceof zzStringType) {
      const onChangeInput =
        onChange ??
        ((checked: boolean, elvalue: string) => {
          if (checked) {
            value.value = elvalue;
          } else {
            if (value.value === elvalue) {
              value.value = "";
            }
          }
        });

      view.addToUnmount(
        value.onChange.addListener((ev) => {
          element.checked = value.value === element.value;
        }),
        new EventWrapper(
          element,
          "change",
          () => {
            onChangeInput(element.checked, element.value);
          },
          false
        )
      );
    } else {
      throw Error("Wrong checkbox variable type");
    }
  };
}
