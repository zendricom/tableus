import React from "react";
import { TableConfig } from "..";
import { LinkProps, TableusConfig, TooltipProps } from "../../context";
import { flexRender } from "../../helpers";
import { CellProps } from "../types";

type Props<T> = CellProps<T> & {
  EmptyValue: TableusConfig["EmptyValue"];
};

export function DateCell<T>(props: Props<T>) {
  const date = parseDateFromProps(props);
  if (date === null) {
    return flexRender(props.EmptyValue, props);
  }
  return <span>{date.toLocaleDateString()}</span>;
}

export function DateTimeCell<T>(props: Props<T>) {
  const date = parseDateFromProps(props);
  if (date === null) {
    return flexRender(props.EmptyValue, props);
  }
  return <span>{date.toLocaleString()}</span>;
}

export function TimeCell<T>(props: Props<T>) {
  const date = parseDateFromProps(props);
  if (date === null) {
    return flexRender(props.EmptyValue, props);
  }
  return <span>{date.toLocaleTimeString()}</span>;
}

function parseDateFromProps<T>(props: Props<T>) {
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
      typeof value
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
