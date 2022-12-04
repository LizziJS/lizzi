/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import {
  zzReactive,
  zzCompute,
  zzArray,
  zzIf,
  ValueOrReactive,
  zzArrayInstance,
  ValueChangeEvent,
} from "@lizzi/core";
import { ViewElement } from ".";

type OutputTypes<T extends any[]> = T[number] | zzReactive<T[number]>;
type InputTypes<T extends any[]> =
  | T[number]
  | zzReactive<T[number]>
  | (() => T[number]);
type InputArrayTypes<T extends any[]> =
  | InputTypes<T>
  | Array<InputTypes<T>>
  | zzArrayInstance<InputTypes<T>>;

function convertInputToReactiveArray<T extends any[]>(
  input: InputArrayTypes<T>
): zzArrayInstance<OutputTypes<T>> {
  if (typeof input === "string" || typeof input === "number") {
    return new zzArray<T | zzReactive<T>>([input]);
  } else if (typeof input === "function") {
    return new zzArray<T | zzReactive<T>>([zzCompute(input)]);
  } else if (Array.isArray(input)) {
    return new zzArray<T | zzReactive<T>>(
      input.map((value) =>
        typeof value === "function" ? zzCompute(value) : value
      )
    );
  } else if (input instanceof zzArrayInstance) {
    return input;
  } else if (input instanceof zzReactive) {
    return new zzArray<T | zzReactive<T>>([input]);
  } else {
    throw new Error("wrong input type");
  }
}

export function StyleLink<T extends ViewElement<HTMLElement | SVGElement>>(
  styleName: string,
  array: InputArrayTypes<[string, number]>
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

export function AttributeLink<T extends ViewElement>(
  name: string,
  attrvalue: InputArrayTypes<[string, number, boolean]>
) {
  return (view: T) => {
    const element = view.element;

    if (attrvalue === undefined) {
      return;
    }

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

    if (attrvalue instanceof zzArrayInstance) {
      attrvalue = attrvalue.join() as any;
    }

    if (typeof attrvalue === "function") {
      attrvalue = zzCompute(attrvalue);
    }

    const reactiveValue = attrvalue as zzReactive<any>;

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

export function ClassLink<T extends ViewElement>(
  array: InputArrayTypes<[string]>
) {
  return (view: T) => {
    const classArray = convertInputToReactiveArray(array);

    const element = view.element;
    const classList = element.classList;
    element.className = "";

    view.addToUnmount(
      classArray.setItemsListener((item) => {
        if (item instanceof zzReactive) {
          return item.onChange
            .addListener((event) => {
              if (event.last) {
                String(event.last)
                  .split(/\s+/)
                  .forEach(
                    (className) =>
                      className !== "" && classList.remove(className)
                  );
              }

              if (event.value) {
                String(event.value)
                  .split(/\s+/)
                  .forEach(
                    (className) => className !== "" && classList.add(className)
                  );
              }
            })
            .run(ValueChangeEvent.run(item));
        } else {
          String(item)
            .split(/\s+/)
            .forEach(
              (className) => className !== "" && classList.add(className)
            );
        }
      })
    );
  };
}

export function cssMap(
  array: InputArrayTypes<[string]>,
  styles: { [key: string]: string }
) {
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

export function zzCss<T>(
  cond: ValueOrReactive<T> | (() => T),
  isTrue: string,
  isFalse: string = ""
) {
  return zzIf(cond, isTrue, isFalse);
}
