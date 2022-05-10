/// <reference types="react" />
import { TableInstance as ReactTableInstance } from "react-table";
export interface Props<D extends object> {
    reactTableInstance: ReactTableInstance<D>;
}
export declare function TableusRenderer<D extends object>({ reactTableInstance, }: Props<D>): JSX.Element;
//# sourceMappingURL=renderer.d.ts.map