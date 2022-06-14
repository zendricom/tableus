import {
  PaginationInstance as ReactTablePaginationInstance,
  SortingColumn,
} from "@tanstack/react-table";
import { ComponentType, createContext, ReactNode } from "react";

import { PaginationTableConfig, TableConfig } from "./core";
import {
  CellProps,
  FilterDefinition,
  FilterState,
  PaginationState,
} from "./core/types";
import { FetcherState } from "./fetcher";
import {
  SearchFilterDef,
  SearchFilterState,
  SelectFilterDef,
  SelectFilterState,
} from "./filtering";

type RelevantFetcherState = Pick<FetcherState<{}>, "isLoading" | "error">;

export interface Props {
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
  setFilter: (filter: FS["value"]) => void;
  props?: any;
}

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
  position: "top" | "bottom";
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
