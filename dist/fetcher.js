"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFetcher = void 0;
const react_query_1 = require("react-query");
function useFetcher({ fetcher, columns, tableState, key, }) {
    const { isLoading, error, data } = (0, react_query_1.useQuery)(`${key}-fetch`, () => fetcher.fetch({ columns, tableState }));
    console.log("useFetcher", { isLoading, error, data });
    return { data, isLoading, error };
}
exports.useFetcher = useFetcher;
//# sourceMappingURL=fetcher.js.map