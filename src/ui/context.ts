import { ComponentType, createContext, ReactNode } from "react";

export type Props = {
  children: ReactNode;
};

type TableComponent = ComponentType<Props>;

export interface PaginationProps {
  canPreviousPage: () => boolean;
  canNextPage: () => boolean;
  pageCount: number;
  gotoPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (pageSize: number) => void;
  state: {
    pageIndex: number;
    pageSize: number;
  };
}
export interface TooltipProps {
  children: ReactNode;
  text: string;
}
export interface LinkProps {
  children: ReactNode;
  href: string;
}

export interface UI {
  Table: TableComponent;
  TableHead: TableComponent;
  TableHeadRow: TableComponent;
  TableHeadCell: TableComponent;
  TableBody: TableComponent;
  TableRow: TableComponent;
  TableCell: TableComponent;

  EmptyValue: () => ReactNode;

  DateCell?: ({ value }: { value: string }) => ReactNode;
  DatetimeCell?: ({ value }: { value: string }) => ReactNode;
  TablePagination?: TableComponent;
  TablePaginationActions?: TableComponent;
  Link?: ComponentType<LinkProps>;
  Tooltip?: ComponentType<TooltipProps>;
}

interface Context {
  UI: UI;
}

export const UIContext = createContext<Context | null>(null);
