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

  const queryParamKey = getQueryParamName(key);
  query.delete(queryParamKey);
  query.set(queryParamKey, encodeState(state));
  window.history.replaceState({}, "", `?${query.toString()}`);
}

function encodeState(state: Partial<TableState>): string {
  const slimState = {
    ...state,
  };
  if (slimState.filters?.length === 0) {
    delete slimState.filters;
  }
  if (slimState.sorting?.length === 0) {
    delete slimState.sorting;
  }

  return JSON.stringify(slimState);
}

function decodeState(state: string): Partial<TableState> {
  const parsedState = JSON.parse(state);
  if (!parsedState.filters) {
    parsedState.filters = [];
  }
  if (!parsedState.sorting) {
    parsedState.sorting = [];
  }
  return parsedState;
}

function getQueryParamName(key: string): string {
  return `${key}_state`;
}
