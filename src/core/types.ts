import {
  Cell as ReactTableCell,
  Column as ReactTableColumn,
  ColumnDef as ReactTableColumnDef,
  PaginationState as ReactTablePaginationState,
  Row as ReactTableRow,
  SortingState,
  TableGenerics,
  TableInstance as ReactTableInstance,
} from "@tanstack/react-table";
import { ComponentType } from "react";

import { FilterProps } from "../context";

export type ColumnValueType = "date" | "datetime" | "time";

export interface AdditionalColumnDef<T extends TableGenerics> {
  type?: ColumnValueType;
  link?: (props: EasyCellProps<T["Row"]>) => string;
  tooltip?: (props: EasyCellProps<T["Row"]>) => string;
}

export type ColumnDef<T extends TableGenerics> = ReactTableColumnDef<T> & {
  meta?: AdditionalColumnDef<T>;
};

export interface CellProps<T extends TableGenerics> {
  instance: ReactTableInstance<T>;
  row: ReactTableRow<T>;
  column: ReactTableColumn<T>;
  cell: ReactTableCell<T>;
  getValue: () => T["Value"];
}

export interface EasyCellProps<D extends Record<string, any>> {
  value: any;
  data: D;
  cellProps: CellProps<{}>;
}

type FilterTypes = "select" | "search";

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
  type: string;
  key: string;
  defaultValue?: any;
}

export interface BuiltinFilterDefinition extends CoreFilterDefinition {
  type: FilterTypes;
}

export function isBuiltinFilterDefinition(
  filter: FilterDefinition
): filter is BuiltinFilterDefinition {
  return filter.type !== "custom";
}

export type CustomFilterRenderer<S extends CustomFilterState<any>> =
  ComponentType<FilterProps<S, CustomFilterDefinition<S>>>;

export type CustomFilterTranslator<S extends CustomFilterState<any>> = (
  filter: S,
  args: any
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
