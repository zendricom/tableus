import React, { useMemo } from "react";
import { useContext } from "react";
import { UIContext } from "../ui/context";
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

  const Table = useMemo(() => UI.getTableComponent(), [UI]);
  const TableHead = useMemo(() => UI.getTableHeadComponent(), [UI]);
  const TableHeadRow = useMemo(() => UI.getTableHeadRowComponent(), [UI]);
  const TableHeadCell = useMemo(() => UI.getTableHeadCellComponent(), [UI]);
  const TableBody = useMemo(() => UI.getTableBodyComponent(), [UI]);
  const TableRow = useMemo(() => UI.getTableRowComponent(), [UI]);
  const TableCell = useMemo(() => UI.getTableCellComponent(), [UI]);
  // const TablePagination = useMemo(() => UI.getTablePaginationComponent(), [UI]);
  // const TablePaginationActions = useMemo(() => UI.getTablePaginationActionsComponent(), [UI]);

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup) => (
          <TableHeadRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <TableHeadCell {...column.getHeaderProps()}>
                {column.render("Header")}
              </TableHeadCell>
            ))}
          </TableHeadRow>
        ))}
      </TableHead>
      <TableBody>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <TableCell {...cell.getCellProps()}>
                  {cell.render("Cell")}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
