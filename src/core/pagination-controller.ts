import { useEffect } from "react";
import { PaginationState } from "./types";

export function useControlPagination(
  setPagination: (pagination: PaginationState) => void,
  pagination: PaginationState
) {
  useEffect(() => {
    if (
      pagination.pageCount !== undefined &&
      pagination.pageIndex >= pagination.pageCount
    ) {
      setPagination({
        ...pagination,
        pageIndex: pagination.pageCount - 1,
      });
    }
  }, [pagination]);
}
