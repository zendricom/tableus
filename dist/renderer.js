"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableusRenderer = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
const context_1 = require("./context");
function TableusRenderer({ reactTableInstance, }) {
    const uiContext = (0, react_2.useContext)(context_1.UIContext);
    if (!(uiContext === null || uiContext === void 0 ? void 0 : uiContext.UI)) {
        throw new Error("No UI context provided");
    }
    const { UI } = uiContext;
    const { getTableProps, headerGroups, rows, prepareRow } = reactTableInstance;
    return (react_1.default.createElement(UI.Table, Object.assign({}, getTableProps()),
        react_1.default.createElement(UI.TableHead, null, headerGroups.map((headerGroup) => (react_1.default.createElement(UI.TableHeadRow, Object.assign({}, headerGroup.getHeaderGroupProps()),
            headerGroup.headers.map((column) => (react_1.default.createElement(UI.TableHeadCell, Object.assign({}, column.getHeaderProps()), column.render("Header")))),
            react_1.default.createElement(UI.TableHeadCell, null, "Age"))))),
        react_1.default.createElement(UI.TableBody, null, rows.map((row) => {
            prepareRow(row);
            return (react_1.default.createElement(UI.TableRow, Object.assign({}, row.getRowProps()), row.cells.map((cell) => (react_1.default.createElement(UI.TableCell, Object.assign({}, cell.getCellProps()), cell.render("Cell"))))));
        }))));
}
exports.TableusRenderer = TableusRenderer;
//# sourceMappingURL=renderer.js.map