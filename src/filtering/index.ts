import { FilterDefinition, FilterState } from "../core/types";

export function getFilterStates(filters: FilterDefinition[]): FilterState[] {
  return filters.map((filter) => ({
    key: filter.key,
    type: filter.type,
    value: filter.defaultValue || null,
  }));
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFilterDef extends FilterDefinition {
  type: "select";
  label: string;
  options: SelectOption[];
  defaultValue?: SelectOption["value"] | SelectOption["value"][];
  isMulti?: boolean;
}
export interface SelectFilterState {
  type: "select";
  key: string;
  value: SelectOption["value"] | SelectOption["value"][];
}
export function defineSelectFilter(
  args: Omit<SelectFilterDef, "type">
): SelectFilterDef {
  return {
    type: "select",
    ...args,
  };
}

export interface SearchFilterDef extends FilterDefinition {
  type: "search";
  label: string;
  placeholder?: string;
}
export interface SearchFilterState {
  type: "search";
  key: string;
  value: string;
}

export function defineSearchFilter(
  args: Omit<SearchFilterDef, "type">
): SearchFilterDef {
  return {
    type: "search",
    ...args,
  };
}
