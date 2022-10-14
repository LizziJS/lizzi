import { zzArray, zzBoolean, zzReactive, zzString } from "@lizzi/core";
import { Debounce, EventWrapper } from "@lizzi/core/Event";
import { DomElementView, HtmlView } from "../view/TagView";

export function onInput<
  E extends DomElementView<HTMLInputElement | HTMLTextAreaElement>
>(value: zzReactive<any>) {
  return (view: E) => {
    if (!(value instanceof zzReactive))
      throw new Error("input variable is not zzReactive");

    const element = view.element;

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
        if (element.value !== value.value) {
          element.value = value.value;
        }
      }),
      new EventWrapper(
        element,
        "input",
        () => {
          if (element.value !== value.value) {
            value.value = element.value;
          }
        },
        false
      ),
      new EventWrapper(
        element,
        "blur",
        () => {
          if (element.value !== value.value) {
            element.value = value.value;
          }
        },
        false
      )
    );

    element.value = value.value;
  };
}

export function onInputFilter<
  T,
  E extends DomElementView<HTMLTextAreaElement | HTMLInputElement>
>(value: zzReactive<T>, filterFn: (value: string) => false | T) {
  return (view: E) => {
    if (!(value instanceof zzReactive))
      throw new Error("input variable is not zzReactive");

    const element = view.element;

    if (
      !(
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      )
    )
      throw new Error(
        "onInputFilter error: Element is not HTMLTextAreaElement | HTMLInputElement"
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
            const filteredValue = filterFn(element.value);
            if (filteredValue !== false) {
              value.value = filteredValue;
            }
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

export function AutoResizeTextarea<
  T extends DomElementView<HTMLTextAreaElement>
>(value: zzReactive<any>) {
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

export function CheckboxLink<T extends DomElementView<HTMLInputElement>>(
  value: zzArray<string> | zzBoolean | zzString
) {
  return (view: T) => {
    const element = view.element;

    if (!(element instanceof HTMLInputElement))
      throw new Error("CheckboxLink error: Element is not HTMLInputElement");

    if (value instanceof zzArray) {
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
            if (element.checked) {
              value.add([element.value]);
            } else {
              value.remove([element.value]);
            }
          },
          false
        )
      );
    } else if (value instanceof zzBoolean) {
      view.addToUnmount(
        value.onChange.addListener(() => {
          element.checked = value.value ? true : false;
        }),
        new EventWrapper(
          element,
          "change",
          () => {
            value.value = element.checked;
          },
          false
        )
      );
    } else if (value instanceof zzString) {
      view.addToUnmount(
        value.onChange.addListener((ev) => {
          element.checked = value.value === element.value;
        }),
        new EventWrapper(
          element,
          "change",
          () => {
            if (element.checked) {
              value.value = element.value;
            } else {
              if (value.value === element.value) {
                value.value = "";
              }
            }
          },
          false
        )
      );
    } else {
      throw Error("Wrong checkbox variable type");
    }
  };
}
