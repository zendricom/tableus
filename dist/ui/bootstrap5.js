"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bootstrap5UI = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
class Bootstrap5UI {
    constructor(config) {
        this.config = config;
    }
    Table(props) {
        var _a;
        return react_1.default.createElement(react_bootstrap_1.Table, Object.assign({}, (_a = this === null || this === void 0 ? void 0 : this.config) === null || _a === void 0 ? void 0 : _a.tableProps), props.children);
    }
    TableHead(props) {
        return react_1.default.createElement("thead", null, props.children);
    }
    TableHeadRow(props) {
        return react_1.default.createElement("tr", null, props.children);
    }
    TableHeadCell(props) {
        return react_1.default.createElement("th", null, props.children);
    }
    TableBody(props) {
        return react_1.default.createElement("tbody", null, props.children);
    }
    TableRow(props) {
        return react_1.default.createElement("tr", null, props.children);
    }
    TableCell(props) {
        return react_1.default.createElement("td", null, props.children);
    }
}
exports.Bootstrap5UI = Bootstrap5UI;
//# sourceMappingURL=bootstrap5.js.map