import { TableState } from "./types";

export function read(key: string): Partial<TableState> {
  const query = new URLSearchParams(window.location.search);
  const state = query.get(getQueryParamName(key));
  if (state) {
    return JSON.parse(state);
  }
  return {};
}

export function write(key: string, state: Partial<TableState>) {
  const query = new URLSearchParams(window.location.search);
  query.set(getQueryParamName(key), JSON.stringify(state));
  window.history.replaceState({}, "", `?${query.toString()}`);
}

function getQueryParamName(key: string): string {
  return `${key}_state`;
}

export default {
  read,
  write,
};
