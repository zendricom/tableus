import { TableState } from "./types";

export function read(key: string): Partial<TableState> {
  const query = new URLSearchParams(window.location.search);
  const state = query.get(getQueryParamName(key));
  if (state) {
    return decodeState(state);
  }
  return {};
}

export function write(key: string, state: Partial<TableState>) {
  const query = new URLSearchParams(window.location.search);
  query.set(getQueryParamName(key), encodeState(state));
  window.history.replaceState({}, "", `?${query.toString()}`);
}

function encodeState(state: Partial<TableState>): string {
  return JSON.stringify(state);
}
function decodeState(state: string): Partial<TableState> {
  // TODO: check if state is valid
  return JSON.parse(state);
}

function getQueryParamName(key: string): string {
  return `${key}_state`;
}
