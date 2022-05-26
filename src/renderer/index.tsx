import React, { useMemo } from "react";
import { useContext } from "react";
import { TableInstance as ReactTableInstance } from "react-table";
import { TableusContext } from "../context";

export interface Props<D extends object> {
  reactTableInstance: ReactTableInstance<D>;
}

export function TableusRenderer<D extends object>({
  reactTableInstance,
}: Props<D>) {
  const context = useContext(TableusContext);
  const config = context?.config;
  if (!config?.tableUI) {
    throw new Error("No UI context provided");
  }
  const { tableUI } = config;

  const { getTableProps, headerGroups, rows, prepareRow } = reactTableInstance;

  return (
    <tableUI.Table {...getTableProps()}>
      <tableUI.TableHead>
        {headerGroups.map((headerGroup) => (
          <tableUI.TableHeadRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <tableUI.TableHeadCell {...column.getHeaderProps()}>
                {column.render("Header")}
              </tableUI.TableHeadCell>
            ))}
          </tableUI.TableHeadRow>
        ))}
      </tableUI.TableHead>
      <tableUI.TableBody>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tableUI.TableRow {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <tableUI.TableCell {...cell.getCellProps()}>
                  {cell.render("Cell")}
                </tableUI.TableCell>
              ))}
            </tableUI.TableRow>
          );
        })}
      </tableUI.TableBody>
    </tableUI.Table>
  );
}
