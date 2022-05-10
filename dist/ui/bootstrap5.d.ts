import { TableProps } from "react-bootstrap";
import { Props, UI } from "../context";
import { ValidJSX } from "../types/helpers";
interface Config {
    tableProps: TableProps;
}
export declare class Bootstrap5UI implements UI {
    private config?;
    constructor(config?: Config | undefined);
    Table(props: Props): ValidJSX;
    TableHead(props: Props): ValidJSX;
    TableHeadRow(props: Props): ValidJSX;
    TableHeadCell(props: Props): ValidJSX;
    TableBody(props: Props): ValidJSX;
    TableRow(props: Props): ValidJSX;
    TableCell(props: Props): ValidJSX;
}
export {};
//# sourceMappingURL=bootstrap5.d.ts.map