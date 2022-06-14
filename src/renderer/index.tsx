import React, { ReactNode } from "react";
import { useContext } from "react";
import {
  TableGenerics,
  TableInstance as ReactTableInstance,
} from "@tanstack/react-table";
import { TableUI, TableusContext } from "../context";
import { TableConfig } from "../core";
import { FetcherState } from "../fetcher";
import { StateFunctions, TableState } from "../core/types";
import { Pagination } from "./pagination";
import { FilterContainer } from "./filtering";

export interface Props<T extends TableGenerics> {
  reactTableInstance: ReactTableInstance<T>;
  tableState: TableState;
  tableConfig: TableConfig;
  fetcherState: FetcherState<T["Row"]>;
  stateFunctions: StateFunctions;
}

export function TableusRenderer<T extends TableGenerics>({
  reactTableInstance,
  tableConfig,
  fetcherState,
  tableState,
  stateFunctions,
}: Props<T>) {
  const context = useContext(TableusContext);
  const config = context?.config;
  if (!config?.tableUI) {
    throw new Error("No UI context provided");
  }
  const { tableUI } = config;

  const tableComponentsProps = { fetcherState, tableConfig };

  return (
    <>
      {tableConfig.pagination && (
        <Pagination<T["Row"]>
          reactTableInstance={reactTableInstance}
          paginationState={tableState.pagination}
          tableUI={tableUI}
          tableConfig={tableConfig}
          position="top"
        />
      )}
      <tableUI.Table {...tableComponentsProps}>
        <tableUI.TableHead {...tableComponentsProps}>
          {reactTableInstance.getHeaderGroups().map((headerGroup) => (
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
                      : (header.renderHeader() as ReactNode)}
                  </tableUI.TableHeadCell>
                );
              })}
            </tableUI.TableHeadRow>
          ))}
        </tableUI.TableHead>
        <tableUI.TableBody {...tableComponentsProps}>
          {reactTableInstance.getRowModel().rows.map((row) => (
            <tableUI.TableRow key={row.id} {...tableComponentsProps}>
              {row.getVisibleCells().map((cell) => (
                <tableUI.TableCell key={cell.id} {...tableComponentsProps}>
                  {cell.renderCell() as ReactNode}
                </tableUI.TableCell>
              ))}
            </tableUI.TableRow>
          ))}
        </tableUI.TableBody>
      </tableUI.Table>
      {tableConfig.pagination && (
        <Pagination<T["Row"]>
          reactTableInstance={reactTableInstance}
          paginationState={tableState.pagination}
          tableUI={tableUI}
          tableConfig={tableConfig}
          position="bottom"
        />
      )}
    </>
  );
}
