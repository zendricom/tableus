import React from "react";
import {
  TableGenerics,
  TableInstance as ReactTableInstance,
} from "@tanstack/react-table";
import { PaginationProps, TableUI } from "../context";
import { TableConfig } from "../core";
import { PaginationState } from "../core/types";

export function Pagination<T extends TableGenerics>({
  paginationState,
  reactTableInstance,
  tableUI,
  tableConfig,
  position,
}: {
  paginationState: PaginationState;
  reactTableInstance: ReactTableInstance<T>;
  tableUI: TableUI;
  tableConfig: TableConfig;
  position: "top" | "bottom";
}) {
  const PaginationComponent = tableUI.TablePagination;
  if (PaginationComponent === undefined) {
    throw new Error("No Pagination component provided");
  }
  const props: PaginationProps = {
    paginationMethods: reactTableInstance,
    paginationState,
    paginationConfig: tableConfig,
    position,
  };
  return <PaginationComponent {...props} />;
}
