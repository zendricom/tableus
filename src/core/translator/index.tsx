import React, { ComponentType } from "react";
import { flexRender } from "../../helpers";
import { TableusConfig } from "../../context";
import { CellProps, ColumnDef, EasyCellProps } from "../types";
import {
  ColumnDef as ReactTableColumnDef,
  Renderable,
  TableGenerics,
} from "@tanstack/react-table";
import {
  DateCell as DefaultDateCell,
  DateTimeCell as DefaultDateTimeCell,
  TimeCell as DefaultTimeCell,
  Link as DefaultLink,
  Tooltip as DefaultTooltip,
} from "./builtin-cells";

type Wrapper<D extends Record<string, any>> = ComponentType<
  EasyCellProps<D> & { children: React.ReactNode }
>;

class ColumnTranslator<T extends TableGenerics> {
  constructor(
    private columns: ColumnDef<T>[],
    private tableusConfig: TableusConfig
  ) {}

  translateColumns(): ReactTableColumnDef<T>[] {
    return this.columns.map((column) => {
      return this.translateColumnDef(column);
    });
  }

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

    const getLink = column.meta?.link;
    if (getLink !== undefined) {
      const LinkComponent = this.tableusConfig.Link ?? DefaultLink;
      wrapperPipe.push((props) => (
        <LinkComponent href={getLink(props)}>{props.children}</LinkComponent>
      ));
    }

    const getTooltip = column.meta?.tooltip;
    if (getTooltip !== undefined) {
      const TooltipComponent = this.tableusConfig.Tooltip ?? DefaultTooltip;
      wrapperPipe.push((props) => (
        <TooltipComponent text={getTooltip(props)}>
          {props.children}
        </TooltipComponent>
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
        (prev, Wrapper) => <Wrapper {...props}>{prev}</Wrapper>,
        flexRender(renderer, props.cellProps || props)
      );
    };
  }

  buildDefaultCell(column: ColumnDef<T>): ComponentType<CellProps<T>> {
    const EmptyValue = this.tableusConfig.EmptyValue ?? "";

    switch (column.meta?.type) {
      case "date":
        if (!this.tableusConfig.DateCell) {
          return (props) => (
            // @ts-ignore https://stackoverflow.com/questions/72392225/reactnode-is-not-a-valid-jsx-element
            <DefaultDateCell {...props} EmptyValue={EmptyValue} />
          );
        }
        const DateCell = this.tableusConfig.DateCell;

        // @ts-ignore https://stackoverflow.com/questions/72392225/reactnode-is-not-a-valid-jsx-element
        return (props) => <DateCell {...props} />;
      case "datetime":
        if (!this.tableusConfig.DatetimeCell) {
          return (props) => (
            // @ts-ignore https://stackoverflow.com/questions/72392225/reactnode-is-not-a-valid-jsx-element
            <DefaultDateTimeCell {...props} EmptyValue={EmptyValue} />
          );
        }
        const DateTimeCell = this.tableusConfig.DatetimeCell;

        // @ts-ignore https://stackoverflow.com/questions/72392225/reactnode-is-not-a-valid-jsx-element
        return (props) => <DateTimeCell {...props} />;
      case "time":
        if (!this.tableusConfig.TimeCell) {
          return (props) => (
            // @ts-ignore https://stackoverflow.com/questions/72392225/reactnode-is-not-a-valid-jsx-element
            <DefaultTimeCell {...props} EmptyValue={EmptyValue} />
          );
        }
        const TimeCell = this.tableusConfig.TimeCell;

        // @ts-ignore https://stackoverflow.com/questions/72392225/reactnode-is-not-a-valid-jsx-jsx wrap selection with elementjsx wrap selection with elementjsx wrap selection with element
        return (props) => <TimeCell {...props} />;
    }
    // @ts-ignore https://stackoverflow.com/questions/72392225/reactnode-is-not-a-valid-jsx-element
    return (props) => props.getValue() || flexRender(EmptyValue);
  }

  makeEasyCellProps(props: CellProps<T>) {
    const { getValue } = props;
    const data = props.row.original;
    const easyCellProps: EasyCellProps<T["Row"]> = {
      value: getValue(),
      data,
      cellProps: props as any,
    };
    return easyCellProps;
  }
}

export function translateColumns<T extends TableGenerics>(
  columns: ColumnDef<T>[],
  tableusConfig: TableusConfig
) {
  return new ColumnTranslator(columns, tableusConfig).translateColumns();
}
