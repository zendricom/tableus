import React, { ReactNode } from "react";
import { flexRender, Table as ReactTable } from "@tanstack/react-table";
import { TableConfig } from "../core";
import { FetcherState } from "../fetcher";
import { StateFunctions, TableState } from "../core/types";
import { Pagination } from "./pagination";
import { useTableusConfig } from "../helpers";

export interface Props<D extends Record<string, any>> {
  reactTable: ReactTable<D>;
  tableState: TableState;
  tableConfig: TableConfig;
  fetcherState: FetcherState<D>;
  stateFunctions: StateFunctions;
}

export function TableusRenderer<D extends Record<string, any>>({
  reactTable,
  tableConfig,
  fetcherState,
  tableState,
  stateFunctions,
}: Props<D>) {
  const config = useTableusConfig();
  const { tableUI } = config;

  const tableComponentsProps = { fetcherState, tableConfig };

  return (
    <>
      {tableConfig.pagination &&
        (tableConfig.showPagination === "top" ||
          tableConfig.showPagination === "both") && (
          <Pagination
            paginationMethods={reactTable}
            paginationState={tableState.pagination}
            paginationConfig={tableConfig}
            position="top"
          />
        )}
      <tableUI.Table {...tableComponentsProps}>
        <tableUI.TableHead {...tableComponentsProps}>
          {reactTable.getHeaderGroups().map((headerGroup) => (
            <tableUI.TableHeadRow
              key={headerGroup.id}
              {...tableComponentsProps}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <tableUI.TableHeadCell
                    key={header.id}
                    {...header.column}
                    {...tableComponentsProps}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </tableUI.TableHeadCell>
                );
              })}
            </tableUI.TableHeadRow>
          ))}
        </tableUI.TableHead>
        <tableUI.TableBody {...tableComponentsProps}>
          {reactTable.getRowModel().rows.map((row) => (
            <tableUI.TableRow key={row.id} {...tableComponentsProps}>
              {row.getVisibleCells().map((cell) => (
                <tableUI.TableCell key={cell.id} {...tableComponentsProps}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </tableUI.TableCell>
              ))}
            </tableUI.TableRow>
          ))}
        </tableUI.TableBody>
      </tableUI.Table>
      {tableConfig.pagination &&
        (tableConfig.showPagination === "bottom" ||
          tableConfig.showPagination === "both") && (
          <Pagination
            paginationMethods={reactTable}
            paginationState={tableState.pagination}
            paginationConfig={tableConfig}
            position="bottom"
          />
        )}
    </>
  );
}
