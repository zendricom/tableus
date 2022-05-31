import React, { ComponentType } from "react";
import { flexRender } from "../../helpers";
import { TableUI, TableusConfig } from "../../context";
import { CellProps, ColumnDef, EasyCellProps } from "../types";
import {
  ColumnDef as ReactTableColumnDef,
  Renderable,
  TableGenerics,
} from "@tanstack/react-table";

type Wrapper<D extends Record<string, any>> = ComponentType<
  EasyCellProps<D> & { children: React.ReactNode }
>;

class ColumnTranslator<T extends TableGenerics> {
  // private idColumnAccessor?: Accessor<T>;

  constructor(
    private columns: ColumnDef<T>[],
    private tableusConfig: TableusConfig
  ) {
    // this.idColumnAccessor = this.findIdColumn()?.accessor;
  }

  translateColumns(): ReactTableColumnDef<T>[] {
    return this.columns.map((column) => {
      return this.translateColumnDef(column);
      // }) as ReactTableColumn<T>[]; // temorary fix
    }); // temorary fix
  }

  // findIdColumn(): SingleValueColumn<T> | undefined {
  //   return this.columns.find((column) => "isId" in column && column.isId) as
  //     | SingleValueColumn<T>
  //     | undefined;
  // }

  translateColumnDef(column: ColumnDef<T>) {
    const reactTableColumn = {
      ...column,
    };

    reactTableColumn.cell = this.buildCell(
      column,
      column.cell || this.buildDefaultCell(column)
    ) as any;
    return reactTableColumn;
  }

  buildCell(
    column: ColumnDef<T>,
    Cell: Renderable<CellProps<T>>
  ): Renderable<CellProps<T>> {
    const wrapper = this.buildWrapper(column);

    return (props: CellProps<T>) => {
      const easyCellProps = this.makeEasyCellProps(props);
      return wrapper(easyCellProps, Cell);
    };
  }

  buildWrapper(column: ColumnDef<T>) {
    const wrapperPipe: Wrapper<T>[] = [];

    const link = column.meta?.link;
    if (link !== undefined) {
      const { Link } = this.tableusConfig;
      if (Link === undefined) throw new Error("Link component is not defined");
      wrapperPipe.push((props) => (
        <Link href={link(props)}>{props.children}</Link>
      ));
    }

    const tooltip = column.meta?.tooltip;
    if (tooltip !== undefined) {
      const { Tooltip } = this.tableusConfig;
      if (Tooltip === undefined)
        throw new Error("Tooltip component is not defined");
      wrapperPipe.push((props) => (
        <Tooltip text={tooltip(props)}>{props.children}</Tooltip>
      ));
    }

    return this.buildWrapperFromPipe(wrapperPipe);
  }

  buildWrapperFromPipe(wrapperPipe: Wrapper<T>[]) {
    return (
      props: EasyCellProps<T>,
      renderer: Renderable<EasyCellProps<T>>
    ) => {
      return wrapperPipe.reduce(
        // (prev, Wrapper) => React.createElement(Wrapper, props, prev),
        (prev, Wrapper) => <Wrapper {...props}>{prev}</Wrapper>,
        flexRender(renderer, props.cellProps || props)
      );
    };
  }

  buildDefaultCell(column: ColumnDef<T>): ComponentType<EasyCellProps<T>> {
    const { EmptyValue } = this.tableusConfig;

    switch (column.meta?.type) {
      case "date":
        if (!this.tableusConfig.DateCell) {
          throw new Error("DateCell is not defined");
        }
        const DateCell = this.tableusConfig.DateCell;

        // @ts-ignore https://stackoverflow.com/questions/72392225/reactnode-is-not-a-valid-jsx-element
        return (props) => <DateCell {...props} />;
      case "datetime":
        if (!this.tableusConfig.DatetimeCell) {
          throw new Error("DatetimeCell is not defined");
        }
        const DateTimeCell = this.tableusConfig.DatetimeCell;

        // @ts-ignore https://stackoverflow.com/questions/72392225/reactnode-is-not-a-valid-jsx-element
        return (props) => <DateTimeCell {...props} />;
    }
    // @ts-ignore https://stackoverflow.com/questions/72392225/reactnode-is-not-a-valid-jsx-element
    return (props) => props.getValue() || <EmptyValue />;
  }

  makeEasyCellProps(props: CellProps<T>) {
    const { getValue } = props;
    const data = props.row.original;
    const easyCellProps: EasyCellProps<T["Row"]> = {
      value: getValue(),
      data,
      cellProps: props as any,
    };
    // if (this.idColumnAccessor) {
    //   easyCellProps.id = props.row.values[this.idColumnAccessor as IdType<T>];
    // }
    return easyCellProps;
  }
}

export function translateColumns<T extends TableGenerics>(
  columns: ColumnDef<T>[],
  tableusConfig: TableusConfig
) {
  return new ColumnTranslator(columns, tableusConfig).translateColumns();
}
