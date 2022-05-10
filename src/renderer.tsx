import React from "react";
import { useContext } from "react";
import { UIContext } from "./context";
import { TableInstance as ReactTableInstance } from "react-table";

export interface Props<D extends object> {
  reactTableInstance: ReactTableInstance<D>;
}

export function TableusRenderer<D extends object>({
  reactTableInstance,
}: Props<D>) {
  const uiContext = useContext(UIContext);
  if (!uiContext?.UI) {
    throw new Error("No UI context provided");
  }
  const { UI } = uiContext;

  const { getTableProps, headerGroups, rows, prepareRow } = reactTableInstance;

  return (
    <UI.Table {...getTableProps()}>
      <UI.TableHead>
        {headerGroups.map((headerGroup) => (
          <UI.TableHeadRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <UI.TableHeadCell {...column.getHeaderProps()}>
                {column.render("Header")}
              </UI.TableHeadCell>
            ))}
            <UI.TableHeadCell>Age</UI.TableHeadCell>
          </UI.TableHeadRow>
        ))}
      </UI.TableHead>
      <UI.TableBody>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <UI.TableRow {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <UI.TableCell {...cell.getCellProps()}>
                  {cell.render("Cell")}
                </UI.TableCell>
              ))}
            </UI.TableRow>
          );
        })}
      </UI.TableBody>
    </UI.Table>
  );
}
