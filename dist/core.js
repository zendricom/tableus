"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTableus = void 0;
const react_1 = require("react");
const react_table_1 = require("react-table");
function isHiddenSingleValueColumn(column) {
    return ("isVisible" in column && column.isVisible === false && !("Header" in column));
}
function isSingleValueColumn(column) {
    if ("isVisible" in column && column.isVisible === false) {
        return false;
    }
    return "accessor" in column && "Header" in column;
}
function isMultiValueColumn(column) {
    if ("isVisible" in column && column.isVisible === false) {
        return false;
    }
    return "Cell" in column && "Header" in column && "key" in column;
}
function getReactTableColumns(columns) {
    return columns.map((column) => {
        if (isHiddenSingleValueColumn(column)) {
            return Object.assign({ accessor: column.accessor }, column.reactTableOptions);
        }
        else if (isSingleValueColumn(column)) {
            return Object.assign({ Header: column.Header, accessor: column.accessor }, column.reactTableOptions);
        }
        else if (isMultiValueColumn(column)) {
            return Object.assign({ Header: column.Header, id: column.key, Cell: column.Cell }, column.reactTableOptions);
        }
        throw new Error("Unknown column type");
    }); // temorary fix
}
function useTableus(options, data) {
    const reactTableOptions = (0, react_1.useMemo)(() => (Object.assign({ data, columns: getReactTableColumns(options.columns) }, options.reactTableOptions)), []);
    const reactTableInstance = (0, react_table_1.useTable)(reactTableOptions);
    return {
        tableusProps: "test",
        selectedRows: [],
        reactTableInstance: reactTableInstance,
    };
}
exports.useTableus = useTableus;
//# sourceMappingURL=core.js.map