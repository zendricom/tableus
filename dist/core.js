"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTableus = void 0;
const react_1 = require("react");
const react_table_1 = require("react-table");
const fetcher_1 = require("./fetcher");
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
function useTableus(options) {
    const { columns, fetcher, config, key } = options;
    const reactTableColumns = (0, react_1.useMemo)(() => getReactTableColumns(columns), [columns]);
    const { data, isLoading, error } = (0, fetcher_1.useFetcher)({
        fetcher,
        columns,
        tableState: {},
        key,
    });
    const reactTableOptions = (0, react_1.useMemo)(() => (Object.assign({ data: data !== null && data !== void 0 ? data : [], columns: reactTableColumns }, options.reactTableOptions)), [data]);
    const reactTableInstance = (0, react_table_1.useTable)(reactTableOptions);
    return {
        tableusProps: { reactTableInstance },
        selectedRows: [],
        reactTableInstance: reactTableInstance,
    };
}
exports.useTableus = useTableus;
//# sourceMappingURL=core.js.map