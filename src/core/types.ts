import {
  PaginationState as ReactTablePaginationState,
  SortingState,
  CellContext,
  RowData,
} from "@tanstack/react-table";
import { ComponentType } from "react";

import { FilterProps } from "../context";

export type ColumnValueType = "date" | "datetime" | "time";

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    type?: ColumnValueType;
    link?: (props: CellContext<TData, TValue>) => string;
    tooltip?: (props: CellContext<TData, TValue>) => string;
  }
}

type FilterTypes = "select" | "search" | "check";

export interface CoreFilterState {
  type: string;
  key: string;
  value: any;
}
export interface BuiltinFilterState extends CoreFilterState {
  type: FilterTypes;
}

export type CustomFilterState<D> = CoreFilterState & {
  type: "custom";
  key: string;
  value: D;
};

export type FilterState = BuiltinFilterState | CustomFilterState<any>;

export interface CoreFilterDefinition {
  type: FilterTypes | "custom";
  key: string;
  defaultValue?: any;
}

export interface BuiltinFilterDefinition extends CoreFilterDefinition {
  type: FilterTypes;
}

export function isBuiltinFilterDefinition(
  filter: FilterDefinition,
): filter is BuiltinFilterDefinition {
  return filter.type !== "custom";
}

export type CustomFilterRenderer<S extends CustomFilterState<any>> =
  ComponentType<FilterProps<S, CustomFilterDefinition<S>>>;

export type CustomFilterTranslator<S extends CustomFilterState<any>> = (
  filter: S,
  args: any,
) => any;

export interface CustomFilterDefinition<S extends CustomFilterState<any>>
  extends CoreFilterDefinition {
  renderer: CustomFilterRenderer<S>;
  translator: CustomFilterTranslator<S>;
  type: "custom";
  [key: string]: any;
}

export type FilterDefinition =
  | BuiltinFilterDefinition
  | CustomFilterDefinition<any>;

export type FilteringState = FilterState[];

export type PaginationState = ReactTablePaginationState & {
  total?: number;
  pageCount?: number;
};

export interface TableState {
  pagination: PaginationState;
  sorting: SortingState;
  filters: FilteringState;
}

export interface StateFunctions {
  setFilters: (filters: FilteringState) => void;
  setPagination: (pagination: PaginationState) => void;
  setSorting: (sorting: SortingState) => void;
}
