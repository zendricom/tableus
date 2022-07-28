import React, { ComponentType } from "react";
import { TableusConfig } from "../../context";
import {
  CellContext,
  ColumnDef,
  ColumnDef as ReactTableColumnDef,
  ColumnDefTemplate,
  flexRender,
  Renderable,
} from "@tanstack/react-table";
import {
  DateCell as DefaultDateCell,
  DateTimeCell as DefaultDateTimeCell,
  TimeCell as DefaultTimeCell,
  Link as DefaultLink,
  Tooltip as DefaultTooltip,
} from "./builtin-cells";

type Wrapper<
  D extends Record<string, any>,
  T extends any = unknown
> = ComponentType<CellContext<D, T> & { children: React.ReactNode }>;

class ColumnTranslator<D extends Record<string, any>> {
  constructor(
    private columns: ColumnDef<D>[],
    private tableusConfig: TableusConfig
  ) {}

  translateColumns(): ReactTableColumnDef<D, any>[] {
    return this.columns.map((column) => {
      return this.translateColumnDef(column);
    });
  }

  translateColumnDef(column: ColumnDef<D, any>) {
    const reactTableColumn = {
      ...column,
    };

    reactTableColumn.cell = this.buildCell(
      column,
      column.cell || this.buildDefaultCell(column)
    );
    return reactTableColumn;
  }

  buildCell(
    column: ColumnDef<D>,
    Cell: Renderable<CellContext<D, any>>
  ): ColumnDefTemplate<CellContext<D, any>> {
    const wrapper = this.buildWrapper(column);

    return (props: CellContext<D, any>) => {
      return wrapper(props, Cell);
    };
  }

  buildWrapper(column: ColumnDef<D>) {
    const wrapperPipe: Wrapper<D>[] = [];

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

  buildWrapperFromPipe(wrapperPipe: Wrapper<D>[]) {
    return (
      props: CellContext<D, any>,
      renderer: Renderable<CellContext<D, any>>
    ) => {
      return wrapperPipe.reduce(
        (prev, Wrapper) => <Wrapper {...props}>{prev}</Wrapper>,
        flexRender(renderer, props)
      );
    };
  }

  buildDefaultCell(column: ColumnDef<D>): ComponentType<CellContext<D, any>> {
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
}

export function translateColumns<D extends Record<string, any>>(
  columns: ColumnDef<D>[],
  tableusConfig: TableusConfig
) {
  return new ColumnTranslator(columns, tableusConfig).translateColumns();
}
