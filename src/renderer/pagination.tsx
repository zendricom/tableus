import React from "react";
import { Table as ReactTable } from "@tanstack/react-table";
import { PaginationProps } from "../context";
import { TableConfig } from "../core";
import { PaginationState } from "../core/types";
import { useTableusConfig } from "../helpers";

export interface Props<D extends Record<string, any>> {
  paginationState: PaginationState;
  reactTable: ReactTable<D>;
  tableConfig: TableConfig;
  position: "top" | "bottom" | "custom";
}

export function Pagination<D extends Record<string, any>>({
  paginationState,
  reactTable,
  tableConfig,
  position,
}: Props<D>) {
  const config = useTableusConfig();
  const { tableUI } = config;

  const PaginationComponent = tableUI.TablePagination;
  if (PaginationComponent === undefined) {
    throw new Error("No Pagination component provided");
  }
  const props: PaginationProps = {
    paginationMethods: reactTable,
    paginationState: {
      ...paginationState,
    },
    paginationConfig: tableConfig,
    position,
  };
  return <PaginationComponent {...props} />;
}
