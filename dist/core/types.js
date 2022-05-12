"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMultiValueColumn = exports.isSingleValueColumn = exports.isHiddenSingleValueColumn = void 0;
function isHiddenSingleValueColumn(column) {
    return ("isVisible" in column && column.isVisible === false && !("Header" in column));
}
exports.isHiddenSingleValueColumn = isHiddenSingleValueColumn;
function isSingleValueColumn(column) {
    if ("isVisible" in column && column.isVisible === false) {
        return false;
    }
    return "accessor" in column && "Header" in column;
}
exports.isSingleValueColumn = isSingleValueColumn;
function isMultiValueColumn(column) {
    if ("isVisible" in column && column.isVisible === false) {
        return false;
    }
    return "Cell" in column && "Header" in column && "key" in column;
}
exports.isMultiValueColumn = isMultiValueColumn;
//# sourceMappingURL=types.js.map