import {
  PaginationInstance as ReactTablePaginationInstance,
  PaginationState,
  SortingColumn,
} from "@tanstack/react-table";
import { ComponentType, createContext, ReactNode } from "react";
import { PaginationTableConfig, TableConfig } from "./core";
import { CellProps } from "./core/types";

export type Props = {
  children: ReactNode;
  fetcherState: { isLoading: boolean; error?: unknown };
  tableConfig: TableConfig;
};

export type HeaderProps = Props & SortingColumn<any>;
type TableComponent = ComponentType<Props>;
type HeaderComponent = ComponentType<HeaderProps>;

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
  TableHeadCell: HeaderComponent;
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
