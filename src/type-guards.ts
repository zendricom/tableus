import {
  TableInstance,
  TableState,
  UsePaginationInstanceProps,
  UsePaginationState,
} from "react-table";

export function isPaginationTableState<D extends object>(
  state: TableState<D>
): state is TableState<D> & UsePaginationState<D> {
  return "pageSize" in state && "pageIndex" in state;
}

export function isPaginationTableInstance<D extends object>(
  instance: TableInstance<D>
): instance is TableInstance<D> &
  UsePaginationInstanceProps<D> & { state: UsePaginationState<D> } {
  return (
    "page" in instance &&
    "pageCount" in instance &&
    "pageOptions" in instance &&
    "canPreviousPage" in instance &&
    "canNextPage" in instance &&
    "gotoPage" in instance &&
    "previousPage" in instance &&
    "nextPage" in instance &&
    "setPageSize" in instance &&
    "state" in instance &&
    isPaginationTableState(instance.state)
  );
}
