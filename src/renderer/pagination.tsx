import React from "react";
import {
  TableGenerics,
  PaginationState,
  TableInstance as ReactTableInstance,
} from "@tanstack/react-table";
import { PaginationProps, TableUI } from "../context";
import { TableConfig } from "../core";

export function Pagination<T extends TableGenerics>({
  paginationState,
  reactTableInstance,
  tableUI,
  tableConfig,
}: {
  paginationState: PaginationState;
  reactTableInstance: ReactTableInstance<T>;
  tableUI: TableUI;
  tableConfig: TableConfig;
}) {
  const PaginationComponent = tableUI.TablePagination;
  if (PaginationComponent === undefined) {
    throw new Error("No Pagination component provided");
  }
  const props: PaginationProps = {
    paginationMethods: reactTableInstance,
    paginationState,
    paginationConfig: tableConfig,
  };
  return <PaginationComponent {...props} />;
}
