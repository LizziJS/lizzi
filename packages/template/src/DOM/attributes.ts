/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import {
  zzReactive,
  zzCompute,
  zzArray,
  zzArrayInstance,
  EventChangeValue,
} from "@lizzi/core";
import { zzHtmlNode } from "../..";

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

export function StyleLink<T extends zzHtmlNode<HTMLElement | SVGElement>>(
  styleName: string,
  value: InputTypes<[string, number]>
) {
  return (view: T) => {
    const element = view.element;

    if (typeof value === "string" || typeof value === "number") {
      element.style.setProperty(styleName, String(value));
      return;
    }

    const reactiveValue = (
      typeof value === "function" ? zzCompute(value) : value
    ) as zzReactive<any>;

    const onChange = () => {
      const value = reactiveValue.value;

      if (value === "") {
        element.style.removeProperty(styleName);
      } else {
        element.style.setProperty(styleName, value);
      }
    };

    reactiveValue.onChange.addListener(onChange).run();
  };
}

export function AttributeLink<T extends zzHtmlNode>(
  name: string,
  attrvalue: InputTypes<[string, number, boolean]>
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

    const reactiveValue = (
      typeof attrvalue === "function" ? zzCompute(attrvalue) : attrvalue
    ) as zzReactive<any>;

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

    reactiveValue.onChange.addListener(onChange).run();
  };
}

export function ClassLink<T extends zzHtmlNode>(
  array: InputArrayTypes<[string]>
) {
  return (view: T) => {
    const classArray = convertInputToReactiveArray(array);

    const element = view.element;
    const classList = element.classList;
    element.className = "";

    classArray.itemsListener((item) => {
      if (item instanceof zzReactive) {
        return item.onChange
          .addListener((event) => {
            if (event.last) {
              String(event.last)
                .split(/\s+/)
                .forEach(
                  (className) => className !== "" && classList.remove(className)
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
          .run(EventChangeValue.new(item));
      } else {
        String(item)
          .split(/\s+/)
          .forEach((className) => className !== "" && classList.add(className));
      }
    });
  };
}
