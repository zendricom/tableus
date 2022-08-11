import React from "react";
import { PaginationProps } from "../context";
import { useTableusConfig } from "../helpers";

export function Pagination({
  paginationState,
  paginationMethods,
  paginationConfig,
  position,
}: PaginationProps) {
  const config = useTableusConfig();
  const { tableUI } = config;

  const PaginationComponent = tableUI.TablePagination;
  if (PaginationComponent === undefined) {
    throw new Error("No Pagination component provided");
  }
  const props: PaginationProps = {
    paginationMethods,
    paginationState,
    paginationConfig,
    position,
  };
  return <PaginationComponent {...props} />;
}
