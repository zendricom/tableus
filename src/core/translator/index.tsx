import React, { ComponentType } from "react";
import {
  Accessor,
  Column,
  ColumnOptions,
  EasyCellProps,
  HiddenSingleValueColumn,
  isHiddenSingleValueColumn,
  isMultiValueColumn,
  isSingleValueColumn,
  MultiValueColumn,
  SingleValueColumn,
  VisibleColumnOptions,
} from "../types";
import {
  CellProps,
  Column as ReactTableColumn,
  ColumnWithLooseAccessor,
  IdType,
  Renderer,
} from "react-table";
import { UIComponents } from "../../ui/context";
import { flexRender } from "../../helpers";

type Wrapper<D extends object> = ComponentType<
  EasyCellProps<D> & { children: React.ReactNode }
>;

class ColumnTranslator<D extends object> {
  private idColumnAccessor?: Accessor<D>;

  constructor(
    private columns: Column<D>[],
    private UIComponents: UIComponents
  ) {
    this.idColumnAccessor = this.findIdColumn()?.accessor;
  }

  translateColumns(): ReactTableColumn<D>[] {
    return this.columns.map((column) => {
      if (isHiddenSingleValueColumn(column)) {
        return this.translateHiddenSingleValueColumn(column);
      } else if (isSingleValueColumn(column)) {
        return this.translateSingleValueColumn(column);
      } else if (isMultiValueColumn(column)) {
        return this.translateMultiValueColumn(column);
      }
      throw new Error("Unknown column type");
    }) as ReactTableColumn<D>[]; // temorary fix
  }

  findIdColumn():
    | SingleValueColumn<D>
    | HiddenSingleValueColumn<D>
    | undefined {
    return this.columns.find((column) => "isId" in column && column.isId) as
      | SingleValueColumn<D>
      | HiddenSingleValueColumn<D>
      | undefined;
  }

  translateHiddenSingleValueColumn(
    column: HiddenSingleValueColumn<D> & ColumnOptions<D>
  ) {
    return {
      accessor: column.accessor,
      ...column.reactTableOptions,
    };
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
    column: (SingleValueColumn<D> | MultiValueColumn<D>) &
      VisibleColumnOptions<D>
  ) {
    const wrapperPipe: Wrapper<D>[] = [];

    const link = column.link;
    if (link !== undefined) {
      const { LinkComponent } = this.UIComponents;
      wrapperPipe.push((props) => (
        <LinkComponent href={link(props)}>{props.children}</LinkComponent>
      ));
    }

    const tooltip = column.tooltip;
    if (tooltip !== undefined) {
      const { TooltipComponent } = this.UIComponents;
      wrapperPipe.push((props) => (
        <TooltipComponent text={tooltip(props)}>
          {props.children}
        </TooltipComponent>
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
    const { EmptyValue } = this.UIComponents;

    switch (column.type) {
      case "date":
        if (!this.UIComponents.DateCell) {
          throw new Error("DateCell is not defined");
        }
        const DateCell = this.UIComponents.DateCell;

        return ({ value }) => <DateCell value={value} />;
      case "datetime":
        if (!this.UIComponents.DatetimeCell) {
          throw new Error("DatetimeCell is not defined");
        }
        const DateTimeCell = this.UIComponents.DatetimeCell;

        return ({ value }) => <DateTimeCell value={value} />;
    }
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
  UIComponents: UIComponents
) {
  return new ColumnTranslator(columns, UIComponents).translateColumns();
}
