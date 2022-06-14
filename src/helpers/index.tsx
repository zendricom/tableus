import { Renderable } from "@tanstack/react-table";
import React, { ComponentType, useContext, useEffect, useRef } from "react";
import { TableusContext } from "../context";

export function flexRender(Comp: Renderable<any>, props: any) {
  return isReactComponent(Comp) ? <Comp {...props} /> : Comp;
}

function isReactComponent(
  component: Renderable<any>
): component is ComponentType<any> {
  return (
    isClassComponent(component) ||
    typeof component === "function" ||
    isExoticComponent(component)
  );
}

function isClassComponent(component: Renderable<any>) {
  return (
    typeof component === "function" &&
    (() => {
      const proto = Object.getPrototypeOf(component);
      return proto.prototype && proto.prototype.isReactComponent;
    })()
  );
}

function isExoticComponent(component: Renderable<any>) {
  return (
    typeof component === "object" &&
    // @ts-ignore
    typeof component.$$typeof === "symbol" &&
    // @ts-ignore
    ["react.memo", "react.forward_ref"].includes(component.$$typeof.description)
  );
}

export function useTableusConfig() {
  const context = useContext(TableusContext);
  const config = context?.config;
  if (!config?.tableUI) {
    throw new Error("No UI context provided");
  }
  return config;
}

export function useDebouncedCallback<A extends any[]>(
  callback: (...args: A) => void,
  wait: number
) {
  const argsRef = useRef<A>();
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  function cleanup() {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }

  useEffect(() => cleanup, []);

  return function debouncedCallback(...args: A) {
    argsRef.current = args;

    cleanup();

    timeout.current = setTimeout(() => {
      if (argsRef.current) {
        callback(...argsRef.current);
      }
    }, wait);
  };
}
