import { ReactNode } from "react";
import { ValidJSX } from "./helpers/types";
export declare type Props = {
  children: ReactNode;
};
export interface UI {
  Table: ({ children }: Props) => ValidJSX;
  TableHead: ({ children }: Props) => ValidJSX;
  TableHeadRow: ({ children }: Props) => ValidJSX;
  TableHeadCell: ({ children }: Props) => ValidJSX;
  TableBody: ({ children }: Props) => ValidJSX;
  TableRow: ({ children }: Props) => ValidJSX;
  TableCell: ({ children }: Props) => ValidJSX;
  TablePagination?: ({ children }: Props) => ValidJSX;
  TablePaginationActions?: ({ children }: Props) => ValidJSX;
}
interface Context {
  UI: UI;
}
export declare const UIContext: import("react").Context<Context | null>;
export {};
//# sourceMappingURL=context.d.ts.map
