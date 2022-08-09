import {
  CellContext,
  PaginationInstance as ReactTablePaginationInstance,
  SortingColumn,
} from "@tanstack/react-table";
import { ComponentType, createContext, ReactNode, useMemo } from "react";
import React from "react";

import { PaginationTableConfig, TableConfig } from "./core";
import { FilterDefinition, FilterState, PaginationState } from "./core/types";
import { FetcherState } from "./fetcher";
import {
  CheckFilterDef,
  CheckFilterState,
  SearchFilterDef,
  SearchFilterState,
  SelectFilterDef,
  SelectFilterState,
} from "./filtering";

type RelevantFetcherState = Pick<FetcherState<{}>, "isLoading" | "error">;

export interface TableComponentProps {
  children: ReactNode;
  fetcherState: RelevantFetcherState;
  tableConfig: TableConfig;
}

export interface FilterProps<
  FS extends FilterState,
  FD extends FilterDefinition
> {
  filterDefinition: FD;
  filter?: FS;
  setFilter: (filter: FS["value"] | ((value: FS["value"]) => void)) => void;
  props?: any;
}

export type HeaderProps = TableComponentProps & SortingColumn<any>;
type TableComponent = ComponentType<TableComponentProps>;
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
  position: "top" | "bottom" | "custom";
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

  SelectFilter?: ComponentType<FilterProps<SelectFilterState, SelectFilterDef>>;
  SearchFilter?: ComponentType<FilterProps<SearchFilterState, SearchFilterDef>>;
  CheckFilter?: ComponentType<FilterProps<CheckFilterState, CheckFilterDef>>;
}

export type TableusConfig = Pick<
  PaginationTableConfig,
  "pageSize" | "pageSizeSelect"
> & {
  tableUI: TableUI;

  EmptyValue?: (() => ReactNode) | string | number | null | undefined;

  DateCell?: (props: CellContext<unknown, any>) => ReactNode;
  DatetimeCell?: (props: CellContext<unknown, any>) => ReactNode;
  TimeCell?: (props: CellContext<unknown, any>) => ReactNode;

  Link?: ComponentType<LinkProps>;
  Tooltip?: ComponentType<TooltipProps>;
};

interface Context {
  config: TableusConfig;
}

export const TableusContext = createContext<Context | null>(null);

export const TableusContextProvider = ({
  config,
  children,
}: {
  config: TableusConfig;
  children: ReactNode;
}) => {
  return (
    <TableusContext.Provider
      value={useMemo(() => ({ config }), [config])}
      children={children}
    />
  );
};
