import React, { ComponentType } from "react";
import {
  Accessor,
  Column,
  ColumnOptions,
  EasyCellProps,
  isMultiValueColumn,
  isSingleValueColumn,
  MultiValueColumn,
  SingleValueColumn,
} from "../types";
import {
  CellProps,
  Column as ReactTableColumn,
  ColumnWithLooseAccessor,
  IdType,
  Renderer,
} from "react-table";
import { flexRender } from "../../helpers";
import { TableUI, TableusConfig } from "../../context";

type Wrapper<D extends object> = ComponentType<
  EasyCellProps<D> & { children: React.ReactNode }
>;

class ColumnTranslator<D extends object> {
  private idColumnAccessor?: Accessor<D>;

  constructor(
    private columns: Column<D>[],
    private tableusConfig: TableusConfig
  ) {
    this.idColumnAccessor = this.findIdColumn()?.accessor;
  }

  translateColumns(): ReactTableColumn<D>[] {
    return this.columns.map((column) => {
      if (isSingleValueColumn(column)) {
        return this.translateSingleValueColumn(column);
      } else if (isMultiValueColumn(column)) {
        return this.translateMultiValueColumn(column);
      }
      throw new Error("Unknown column type");
    }) as ReactTableColumn<D>[]; // temorary fix
  }

  findIdColumn(): SingleValueColumn<D> | undefined {
    return this.columns.find((column) => "isId" in column && column.isId) as
      | SingleValueColumn<D>
      | undefined;
  }

  translateSingleValueColumn(column: SingleValueColumn<D> & ColumnOptions<D>) {
    const reactTableColumn: ColumnWithLooseAccessor<D> = {
      Header: column.Header,
      // @ts-ignore
      accessor: column.accessor,
      ...column.reactTableOptions,
    };

    reactTableColumn.Cell = this.buildCell(
      column,
      column.Cell || this.buildDefaultSingleValueCell(column)
    );

    return reactTableColumn;
  }

  translateMultiValueColumn(column: MultiValueColumn<D> & ColumnOptions<D>) {
    const reactTableColumn = {
      Header: column.Header,
      id: column.key,
      Cell: this.buildCell(column, column.Cell),
      ...column.reactTableOptions,
    };

    return reactTableColumn;
  }

  buildCell(
    column: SingleValueColumn<D> | MultiValueColumn<D>,
    Cell: Renderer<EasyCellProps<D>>
  ): Renderer<CellProps<D>> {
    const wrapper = this.buildWrapper(column);

    return ((props: CellProps<D>) => {
      const easyCellProps = this.makeEasyCellProps(props);
      return wrapper(easyCellProps, Cell);
    }) as Renderer<CellProps<D>>;
  }

  buildWrapper(
    column: (SingleValueColumn<D> | MultiValueColumn<D>) & ColumnOptions<D>
  ) {
    const wrapperPipe: Wrapper<D>[] = [];

    const link = column.link;
    if (link !== undefined) {
      const { Link } = this.tableusConfig;
      if (Link === undefined) throw new Error("Link component is not defined");
      wrapperPipe.push((props) => (
        <Link href={link(props)}>{props.children}</Link>
      ));
    }

    const tooltip = column.tooltip;
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

  buildWrapperFromPipe(wrapperPipe: Wrapper<D>[]) {
    return (props: EasyCellProps<D>, renderer: Renderer<EasyCellProps<D>>) => {
      return wrapperPipe.reduce(
        // (prev, Wrapper) => React.createElement(Wrapper, props, prev),
        (prev, Wrapper) => <Wrapper {...props}>{prev}</Wrapper>,
        flexRender(renderer, props)
      );
    };
  }

  buildDefaultSingleValueCell(
    column: SingleValueColumn<D>
  ): ComponentType<EasyCellProps<D>> {
    const { EmptyValue } = this.tableusConfig;

    switch (column.type) {
      case "date":
        if (!this.tableusConfig.DateCell) {
          throw new Error("DateCell is not defined");
        }
        const DateCell = this.tableusConfig.DateCell;

        // @ts-ignore https://stackoverflow.com/questions/72392225/reactnode-is-not-a-valid-jsx-element
        return ({ value }) => <DateCell value={value} />;
      case "datetime":
        if (!this.tableusConfig.DatetimeCell) {
          throw new Error("DatetimeCell is not defined");
        }
        const DateTimeCell = this.tableusConfig.DatetimeCell;

        // @ts-ignore https://stackoverflow.com/questions/72392225/reactnode-is-not-a-valid-jsx-element
        return ({ value }) => <DateTimeCell value={value} />;
    }
    // @ts-ignore https://stackoverflow.com/questions/72392225/reactnode-is-not-a-valid-jsx-element
    return ({ value }) => value || <EmptyValue />;
  }

  makeEasyCellProps(props: CellProps<D>) {
    const { value } = props;
    const data = props.row.original;
    const easyCellProps: EasyCellProps<D> = {
      value,
      data,
      cellProps: props,
    };
    if (this.idColumnAccessor) {
      easyCellProps.id = props.row.values[this.idColumnAccessor as IdType<D>];
    }
    return easyCellProps;
  }
}

export function translateColumns<D extends object>(
  columns: Column<D>[],
  tableusConfig: TableusConfig
) {
  return new ColumnTranslator(columns, tableusConfig).translateColumns();
}
