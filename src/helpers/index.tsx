import React, { ComponentType } from "react";
import { CellProps, Renderer } from "react-table";

export function flexRender(Comp: Renderer<any>, props: any) {
  return isReactComponent(Comp) ? <Comp {...props} /> : Comp;
}

function isReactComponent(
  component: Renderer<any>
): component is ComponentType<any> {
  return (
    isClassComponent(component) ||
    typeof component === "function" ||
    isExoticComponent(component)
  );
}

function isClassComponent(component: Renderer<any>) {
  return (
    typeof component === "function" &&
    (() => {
      const proto = Object.getPrototypeOf(component);
      return proto.prototype && proto.prototype.isReactComponent;
    })()
  );
}

function isExoticComponent(component: Renderer<any>) {
  return (
    typeof component === "object" &&
    // @ts-ignore
    typeof component.$$typeof === "symbol" &&
    // @ts-ignore
    ["react.memo", "react.forward_ref"].includes(component.$$typeof.description)
  );
}
