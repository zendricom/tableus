import {
  ColumnDef as ReactTableColumnDef,
  TableInstance as ReactTableInstance,
  Row as ReactTableRow,
  Column as ReactTableColumn,
  Cell as ReactTableCell,
  PaginationState as ReactTablePaginationState,
  SortingState,
} from "@tanstack/react-table";
import { TableGenerics } from "@tanstack/react-table";

export type ColumnValueType = "date" | "datetime";

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

export interface FilterState {
  type: FilterTypes;
  key: string;
  value: any;
}

export interface FilterDefinition {
  type: FilterTypes;
  key: string;
  defaultValue?: any;
}

export type FilteringState = FilterState[];

export type PaginationState = ReactTablePaginationState & {
  total?: number;
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
