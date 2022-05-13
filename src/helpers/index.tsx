import React, { ComponentType } from "react";
import { CellProps, Renderer } from "react-table";

export function flexRender<D extends object>(
  Comp: Renderer<CellProps<D>>,
  props: CellProps<D>
) {
  return isReactComponent(Comp) ? <Comp {...props} /> : Comp;
}

function isReactComponent<D extends object>(
  component: Renderer<CellProps<D>>
): component is ComponentType<CellProps<D>> {
  return (
    isClassComponent(component) ||
    typeof component === "function" ||
    isExoticComponent(component)
  );
}

function isClassComponent<D extends object>(component: Renderer<CellProps<D>>) {
  return (
    typeof component === "function" &&
    (() => {
      const proto = Object.getPrototypeOf(component);
      return proto.prototype && proto.prototype.isReactComponent;
    })()
  );
}

function isExoticComponent<D extends object>(
  component: Renderer<CellProps<D>>
) {
  return (
    typeof component === "object" &&
    // @ts-ignore
    typeof component.$$typeof === "symbol" &&
    // @ts-ignore
    ["react.memo", "react.forward_ref"].includes(component.$$typeof.description)
  );
}
