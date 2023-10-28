import { IReadOnlyReactive, zzArray, zzCompute, zzReactive } from "@lizzi/core";
import { Debounce, EventWrapper } from "@lizzi/core";
import { zzHtmlNode } from "../../view/zzHtmlNode";

export function onInput<
  E extends zzHtmlNode<HTMLTextAreaElement | HTMLInputElement>
>(
  value: zzReactive<string>,
  onChange?: (value: string) => void
): (view: E) => void;
export function onInput<
  T,
  E extends zzHtmlNode<HTMLTextAreaElement | HTMLInputElement>
>(value: zzReactive<T>, onChange: (value: string) => void): (view: E) => void;
export function onInput<
  T,
  E extends zzHtmlNode<HTMLTextAreaElement | HTMLInputElement>
>(value: zzReactive<T>, onChange?: (value: string) => void) {
  return (view: E) => {
    if (!zzReactive.isReactive(value))
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

    value.onChange.addListener(() => {
      if (element.value !== String(value.value)) {
        element.value = String(value.value);
      }
    });

    new EventWrapper(
      element,
      "input",
      () => {
        if (element.value !== String(value.value)) {
          onInputChange(element.value);
        }
      },
      false
    );

    new EventWrapper(
      element,
      "blur",
      () => {
        if (element.value !== String(value.value)) {
          element.value = String(value.value);
        }
      },
      false
    );

    element.value = String(value.value);
  };
}

export function updateInputValue<
  E extends zzHtmlNode<HTMLTextAreaElement | HTMLInputElement>
>(value: IReadOnlyReactive<string> | (() => string)) {
  return (view: E) => {
    const element = view.element;

    if (typeof value === "function") {
      value = zzCompute(value);
    }

    if (!zzReactive.isReactive(value))
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

    value.onChange.addListener(() => {
      if (element.value !== String(reactiveValue.value)) {
        element.value = String(reactiveValue.value);
      }
    });

    new EventWrapper(
      element,
      "blur",
      () => {
        if (element.value !== String(reactiveValue.value)) {
          element.value = String(reactiveValue.value);
        }
      },
      false
    );

    element.value = String(reactiveValue.value);
  };
}

export function onInputChange<
  E extends zzHtmlNode<HTMLTextAreaElement | HTMLInputElement>
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

    new EventWrapper(
      element,
      "input",
      () => {
        onInputChange(element.value);
      },
      false
    );
  };
}

export function AutoResizeTextarea<T extends zzHtmlNode<HTMLTextAreaElement>>(
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

    new EventWrapper(textElement, "focus", fn, false);
    new EventWrapper(textElement, "change", fn, false);
    new EventWrapper(textElement, "input", fn, false);
    new EventWrapper(textElement, "cut", fn, false);
    new EventWrapper(textElement, "paste", fn, false);
    new EventWrapper(textElement, "drop", fn, false);
    new EventWrapper(textElement, "keydown", fn, false);

    if (zzReactive.isReactive(value)) {
      value.onChange.addListener(fn);
    }

    fn();
  };
}

export function onCheckboxInput<T extends zzHtmlNode<HTMLInputElement>>(
  value: zzArray<string> | zzReactive<string> | zzReactive<boolean>,
  onChange?: (checked: boolean, value: string) => void
) {
  return (view: T) => {
    const element = view.element;

    if (!(element instanceof HTMLInputElement))
      throw new Error("onCheckboxInput error: Element is not HTMLInputElement");

    if (zzArray.isArray(value)) {
      const onChangeInput =
        onChange ??
        ((checked: boolean, elvalue: string) => {
          if (checked) {
            value.add([elvalue]);
          } else {
            value.remove([elvalue]);
          }
        });

      value.onAdd.addListener((ev) => {
        if (element.value === ev.added) {
          element.checked = true;
        }
      });

      value.onRemove.addListener((ev) => {
        if (element.value === ev.removed) {
          element.checked = false;
        }
      });

      new EventWrapper(
        element,
        "change",
        () => {
          onChangeInput(element.checked, element.value);
        },
        false
      );
    } else if (zzReactive.isReactive(value)) {
      const onChangeInput =
        onChange ??
        ((checked: boolean, elvalue: string) => {
          if (value.value === true || value.value === false) {
            value.value = checked;
          } else {
            if (checked) {
              value.value = elvalue;
            } else {
              if (value.value === elvalue) {
                value.value = "";
              }
            }
          }
        });

      (value as zzReactive<boolean | string>).onChange.addListener(() => {
        if (value.value === true || value.value === false) {
          element.checked = value.value ? true : false;
        } else {
          element.checked = value.value === element.value;
        }
      });

      new EventWrapper(
        element,
        "change",
        () => {
          onChangeInput(element.checked, element.value);
        },
        false
      );
    } else {
      throw Error("Wrong checkbox variable type");
    }
  };
}
