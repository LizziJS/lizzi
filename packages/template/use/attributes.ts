/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzReactive, zzCompute, zzArray, runVar } from "@lizzi/core";
import { DomElementView } from "../view/TagView";

type InputTypes =
  | string
  | number
  | zzReactive<any>
  | Array<string | number | zzReactive<any>>
  | zzArray<string | number | zzReactive<any>>;

function convertInputToReactiveArray(
  input: InputTypes
): zzArray<string | number | zzReactive<any>> {
  if (typeof input === "string" || typeof input === "number") {
    return new zzArray<string | number | zzReactive<any>>([input]);
  } else if (Array.isArray(input)) {
    return new zzArray(input);
  } else if (input instanceof zzArray) {
    return input;
  } else if (input instanceof zzReactive) {
    return new zzArray<string | number | zzReactive<any>>([input]);
  } else {
    throw new Error("wrong input type");
  }
}

export function StyleLink<T extends DomElementView<HTMLElement | SVGElement>>(
  styleName: string,
  array: InputTypes
) {
  return (view: T) => {
    const element = view.element;

    let reactiveValue = convertInputToReactiveArray(array).join();

    const onChange = () => {
      const value = reactiveValue.value;

      if (value === "") {
        element.style.removeProperty(styleName);
      } else {
        element.style.setProperty(styleName, value);
      }
    };

    view.addToUnmount(reactiveValue.onChange.addListener(onChange).run());
  };
}

export function AttributeLink<T extends DomElementView>(
  name: string,
  attrvalue: boolean | InputTypes
) {
  return (view: T) => {
    const element = view.element;

    if (typeof attrvalue === "string" || typeof attrvalue === "number") {
      element.setAttribute(name, String(attrvalue));

      return;
    }

    if (typeof attrvalue === "boolean") {
      if (attrvalue) {
        element.setAttribute(name, "");
      }

      return;
    }

    if (Array.isArray(attrvalue)) {
      attrvalue = new zzArray(attrvalue);
    }

    if (attrvalue instanceof zzArray) {
      attrvalue = attrvalue.join();
    }

    const reactiveValue = attrvalue;

    const onChange = () => {
      const value = reactiveValue.value;

      if (!value && value !== "") {
        element.removeAttribute(name);
      } else if (value === true) {
        element.setAttribute(name, "");
      } else {
        element.setAttribute(name, String(value));
      }
    };

    view.addToUnmount(reactiveValue.onChange.addListener(onChange).run());
  };
}

export function ClassLink<T extends DomElementView>(array: InputTypes) {
  return (view: T) => {
    const classArray = convertInputToReactiveArray(array);

    const element = view.element;
    const classList = element.classList;

    view.onceUnmount(() => {
      for (const className of classArray) {
        classList.remove(
          String(className instanceof zzReactive ? className.value : className)
        );
      }
    });

    view.addToUnmount(
      classArray.setItemsListener(
        (item) => {
          if (item instanceof zzReactive) {
            return item.onChange
              .addListener((event) => {
                if (event.last) {
                  classList.remove(String(event.last));
                }

                if (event.value) {
                  classList.add(String(event.value));
                }
              })
              .run(runVar(item));
          } else {
            String(item)
              .split(/\s+/)
              .forEach(
                (className) => className !== "" && classList.add(className)
              );
          }
        },
        (item) => {
          classList.remove(
            String(item instanceof zzReactive ? item.value : item)
          );
        }
      )
    );
  };
}

export function cssMap(array: InputTypes, styles: { [key: string]: string }) {
  const classArray = convertInputToReactiveArray(array);

  return classArray.map((className) => {
    if (typeof className === "string" || typeof className === "number") {
      return styles[className] ?? className;
    }

    return zzCompute(
      () => styles[className.value] ?? className.value,
      className
    );
  });
}
