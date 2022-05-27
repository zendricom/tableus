import React from "react";
import { useContext } from "react";
import { TableInstance as ReactTableInstance } from "react-table";
import { TableUI, TableusContext } from "../context";
import { TableConfig } from "../core";
import { FetcherState } from "../fetcher";
import { isPaginationTableInstance } from "../type-guards";

export interface Props<D extends object> {
  reactTableInstance: ReactTableInstance<D>;
  tableConfig: TableConfig;
  fetcherState: FetcherState<D>;
}

export function TableusRenderer<D extends object>({
  reactTableInstance,
  tableConfig,
  fetcherState,
}: Props<D>) {
  const context = useContext(TableusContext);
  const config = context?.config;
  if (!config?.tableUI) {
    throw new Error("No UI context provided");
  }
  const { tableUI } = config;

  const { getTableProps, headerGroups, rows, prepareRow } = reactTableInstance;
  const tableComponentsProps = { fetcherState };

  return (
    <>
      <tableUI.Table {...getTableProps()} {...tableComponentsProps}>
        <tableUI.TableHead {...tableComponentsProps}>
          {headerGroups.map((headerGroup) => (
            <tableUI.TableHeadRow
              {...headerGroup.getHeaderGroupProps()}
              {...tableComponentsProps}
            >
              {headerGroup.headers.map((column) => (
                <tableUI.TableHeadCell
                  {...column.getHeaderProps()}
                  {...tableComponentsProps}
                >
                  {column.render("Header")}
                </tableUI.TableHeadCell>
              ))}
            </tableUI.TableHeadRow>
          ))}
        </tableUI.TableHead>
        <tableUI.TableBody {...tableComponentsProps}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tableUI.TableRow
                {...row.getRowProps()}
                {...tableComponentsProps}
              >
                {row.cells.map((cell) => (
                  <tableUI.TableCell
                    {...cell.getCellProps()}
                    {...tableComponentsProps}
                  >
                    {cell.render("Cell")}
                  </tableUI.TableCell>
                ))}
              </tableUI.TableRow>
            );
          })}
        </tableUI.TableBody>
      </tableUI.Table>
      <Pagination<D>
        tableConfig={tableConfig}
        tableUI={tableUI}
        reactTableInstance={reactTableInstance}
      />
    </>
  );
}

function Pagination<D extends object>({
  tableConfig,
  tableUI,
  reactTableInstance,
}: {
  reactTableInstance: ReactTableInstance<D>;
  tableConfig: TableConfig;
  tableUI: TableUI;
}) {
  if (!tableConfig.pagination) {
    return null;
  }
  const PaginationComponent = tableUI.TablePagination;
  if (PaginationComponent === undefined) {
    throw new Error("No Pagination component provided");
  }
  if (!isPaginationTableInstance(reactTableInstance)) {
    throw new Error("reactTableInstance is not a PaginationTableInstance");
  }
  return (
    <PaginationComponent
      {...reactTableInstance}
      paginationConfig={tableConfig}
    />
  );
}
