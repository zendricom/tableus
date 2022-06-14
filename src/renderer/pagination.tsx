import React from "react";
import {
  TableGenerics,
  TableInstance as ReactTableInstance,
} from "@tanstack/react-table";
import { PaginationProps } from "../context";
import { TableConfig } from "../core";
import { PaginationState } from "../core/types";
import { useTableusConfig } from "../helpers";

export interface Props<T extends TableGenerics> {
  paginationState: PaginationState;
  reactTableInstance: ReactTableInstance<T>;
  tableConfig: TableConfig;
  position: "top" | "bottom" | "custom";
}

export function Pagination<T extends TableGenerics>({
  paginationState,
  reactTableInstance,
  tableConfig,
  position,
}: Props<T>) {
  const config = useTableusConfig();
  const { tableUI } = config;

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
