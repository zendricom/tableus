import {
  PaginationInstance as ReactTablePaginationInstance,
  PaginationState,
} from "@tanstack/react-table";
import { ComponentType, createContext, ReactNode } from "react";
import { PaginationTableConfig } from "./core";
import { CellProps } from "./core/types";

export type Props = {
  children: ReactNode;
  fetcherState: { isLoading: boolean; error?: unknown };
};

type TableComponent = ComponentType<Props>;

export interface PaginationProps {
  paginationConfig: PaginationTableConfig;
  paginationMethods: Omit<
    ReactTablePaginationInstance<{}>,
    | "getPrePaginationRowModel"
    | "getPaginationRowModel"
    | "_getPaginationRowModel"
    | "_autoResetPageIndex"
  >;
  paginationState: PaginationState;
}
export interface TooltipProps {
  children: ReactNode;
  text: string;
}
export interface LinkProps {
  children: ReactNode;
  href: string;
}

export interface TableUI {
  Table: TableComponent;
  TableHead: TableComponent;
  TableHeadRow: TableComponent;
  TableHeadCell: TableComponent;
  TableBody: TableComponent;
  TableRow: TableComponent;
  TableCell: TableComponent;

  TablePagination?: ComponentType<PaginationProps>;
}

export interface TableusConfig {
  tableUI: TableUI;

  EmptyValue: () => ReactNode;

  DateCell?: (props: CellProps<{}>) => ReactNode;
  DatetimeCell?: (props: CellProps<{}>) => ReactNode;

  Link?: ComponentType<LinkProps>;
  Tooltip?: ComponentType<TooltipProps>;
}

interface Context {
  config: TableusConfig;
}

export const TableusContext = createContext<Context | null>(null);
