import { createContext, ReactNode } from "react";

export type Props = {
  children: ReactNode;
};

type TableComponent = React.ComponentType<Props>;

export interface UI {
  getTableComponent: () => TableComponent;
  getTableHeadComponent: () => TableComponent;
  getTableHeadRowComponent: () => TableComponent;
  getTableHeadCellComponent: () => TableComponent;
  getTableBodyComponent: () => TableComponent;
  getTableRowComponent: () => TableComponent;
  getTableCellComponent: () => TableComponent;
  getEmptyValueComponent: () => React.ComponentType<{}>;

  getDateCellComponent?: () => React.ComponentType<{ value: string }>;
  getDatetimeCellComponent?: () => React.ComponentType<{ value: string }>;
  getTablePaginationComponent?: () => TableComponent;
  getTablePaginationActionsComponent?: () => TableComponent;
  getLinkComponent?: () => React.ComponentType<{
    children: React.ReactNode;
    href: string;
  }>;
  getTooltipComponent?: () => React.ComponentType<{
    children: React.ReactNode;
    text: string;
  }>;

  getComponents: () => UIComponents;
}

export interface UIComponents {
  Table: TableComponent;
  TableHead: TableComponent;
  TableHeadRow: TableComponent;
  TableHeadCell: TableComponent;
  TableBody: TableComponent;
  TableRow: TableComponent;
  TableCell: TableComponent;
  DateCell?: React.ComponentType<{ value: string }>;
  DatetimeCell?: React.ComponentType<{ value: string }>;
  TablePagination?: TableComponent;
  TablePaginationActions?: TableComponent;
  EmptyValue: React.ComponentType<{}>;
  LinkComponent: React.ComponentType<{
    children: React.ReactNode;
    href: string;
  }>;
  TooltipComponent: React.ComponentType<{
    children: React.ReactNode;
    text: string;
  }>;
}

interface Context {
  UI: UI;
}

export const UIContext = createContext<Context | null>(null);
