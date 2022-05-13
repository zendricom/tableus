import React, { ComponentType, ReactNode } from "react";
import {
  Column,
  ColumnOptions,
  HiddenSingleValueColumn,
  isHiddenSingleValueColumn,
  isMultiValueColumn,
  isSingleValueColumn,
  MultiValueColumn,
  SingleValueColumn,
} from "../types";
import {
  CellProps,
  Column as ReactTableColumn,
  ColumnWithLooseAccessor,
  Renderer,
} from "react-table";
import { UIComponents } from "../../ui/context";
import { flexRender } from "../../helpers";

export function translateColumns<D extends object>(
  columns: Column<D>[],
  UIComponents: UIComponents
): ReactTableColumn<D>[] {
  return columns.map((column) => {
    if (isHiddenSingleValueColumn<D>(column)) {
      return translateHiddenSingleValueColumn(column);
    } else if (isSingleValueColumn<D>(column)) {
      return translateSingleValueColumn<D>(column, UIComponents);
    } else if (isMultiValueColumn<D>(column)) {
      return translateMultiValueColumn<D>(column);
    }
    throw new Error("Unknown column type");
  }) as ReactTableColumn<D>[]; // temorary fix
}

function translateHiddenSingleValueColumn<D extends object>(
  column: HiddenSingleValueColumn<D> & ColumnOptions<D>
) {
  return {
    accessor: column.accessor,
    ...column.reactTableOptions,
  };
}

function translateSingleValueColumn<D extends object>(
  column: SingleValueColumn<D> & ColumnOptions<D>,
  UIComponents: UIComponents
) {
  const reactTableColumn: ColumnWithLooseAccessor<D> = {
    Header: column.Header,
    // @ts-ignore
    accessor: column.accessor,
    ...column.reactTableOptions,
  };

  const wrapper = buildWrapper(column, UIComponents);

  // @ts-ignore
  reactTableColumn.Cell = (props: CellProps<D>) =>
    wrapper(props, column.Cell || buildCell(column, UIComponents));

  return reactTableColumn;
}

type Wrapper<D extends object> = ComponentType<
  CellProps<D> & { children: React.ReactNode }
>;

function buildWrapper<D extends object>(
  column: SingleValueColumn<D> | MultiValueColumn<D>,
  UIComponents: UIComponents
) {
  const wrapperPipe: Wrapper<D>[] = [];

  if (column.link !== undefined) {
    wrapperPipe.push(({ children }) => (
      <UIComponents.LinkComponent href={column.link as string}>
        {children}
      </UIComponents.LinkComponent>
    ));
  }

  if (column.tooltip !== undefined) {
    wrapperPipe.push(({ children }) => (
      <UIComponents.TooltipComponent text={column.tooltip as string}>
        {children}
      </UIComponents.TooltipComponent>
    ));
  }

  return buildWrapperFromPipe(wrapperPipe);
}

function buildWrapperFromPipe<D extends object>(wrapperPipe: Wrapper<D>[]) {
  return (props: CellProps<D>, renderer: Renderer<CellProps<D>>) => {
    return wrapperPipe.reduce(
      // @ts-ignore
      (prev, Wrapper) => <Wrapper> {flexRender(prev, props)} </Wrapper>,
      flexRender(renderer, props)
    );
  };
}

function buildCell<D extends object>(
  column: SingleValueColumn<D>,
  UIComponents: UIComponents
): Renderer<CellProps<D>> {
  const EmptyValue = UIComponents.EmptyValue;

  switch (column.type) {
    case "date":
      if (!UIComponents.DateCell) {
        throw new Error("DateCell is not defined");
      }
      const DateCell = UIComponents.DateCell;

      return ({ cell: { value } }) => <DateCell value={value} />;
    case "datetime":
      if (!UIComponents.DatetimeCell) {
        throw new Error("DatetimeCell is not defined");
      }
      const DateTimeCell = UIComponents.DatetimeCell;

      return ({ cell: { value } }) => <DateTimeCell value={value} />;
  }
  return ({ cell: { value } }) => value || <EmptyValue />;
}

function translateMultiValueColumn<D extends object>(
  column: MultiValueColumn<D> & ColumnOptions<D>
) {
  return {
    Header: column.Header,
    id: column.key,
    Cell: column.Cell,
    ...column.reactTableOptions,
  };
}
