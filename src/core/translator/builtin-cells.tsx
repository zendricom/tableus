import { CellContext, flexRender } from "@tanstack/react-table";
import React from "react";
import { LinkProps, TableusConfig, TooltipProps } from "../../context";

type Props<
  D extends Record<string, any>,
  T extends any = unknown,
> = CellContext<D, T> & {
  EmptyValue: TableusConfig["EmptyValue"];
};

export function DateCell<D extends Record<string, any>>(props: Props<D>) {
  const date = parseDateFromProps(props);
  if (date === null) {
    return flexRender(props.EmptyValue, props);
  }
  return <span>{date.toLocaleDateString()}</span>;
}

export function DateTimeCell<D extends Record<string, any>>(props: Props<D>) {
  const date = parseDateFromProps(props);
  if (date === null) {
    return flexRender(props.EmptyValue, props);
  }
  return <span>{date.toLocaleString()}</span>;
}

export function TimeCell<D extends Record<string, any>>(props: Props<D>) {
  const date = parseDateFromProps(props);
  if (date === null) {
    return flexRender(props.EmptyValue, props);
  }
  return <span>{date.toLocaleTimeString()}</span>;
}

function parseDateFromProps<D extends Record<string, any>>(props: Props<D>) {
  const { getValue } = props;
  const value = getValue();

  if (value === null || value === undefined) {
    return null;
  }
  // check if value is number or string or date
  if (
    typeof value === "number" ||
    typeof value === "string" ||
    value instanceof Date
  ) {
    return new Date(value);
  }
  throw new Error(
    "Invalid date value for builtin cell, expected number, string or Date, got " +
      typeof value,
  );
}

export const Link = (props: LinkProps) => {
  const { children, href } = props;
  return <a href={href}>{children}</a>;
};

export const Tooltip = (props: TooltipProps) => {
  const { children, text } = props;
  return <span title={text}>{children}</span>;
};
