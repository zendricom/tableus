import {
  BuiltinFilterDefinition,
  CustomFilterDefinition,
  CustomFilterRenderer,
  CustomFilterState,
} from "../core/types";

// export function getFilterStates(filters: FilterDefinition[]): FilterState[] {
//   return filters.map((filter) => ({
//     key: filter.key,
//     type: filter.type,
//     value: filter.defaultValue || null,
//   }));
// }

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFilterDef extends BuiltinFilterDefinition {
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

export interface CheckFilterDef extends BuiltinFilterDefinition {
  type: "check";
  label: string;
  defaultValue?: boolean;
}

export interface CheckFilterState {
  type: "check";
  key: string;
  value: boolean;
}

export function defineCheckFilter(
  args: Omit<CheckFilterDef, "type">
): CheckFilterDef {
  return {
    type: "check",
    ...args,
  };
}

export interface SearchFilterDef extends BuiltinFilterDefinition {
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

export function defineCustomFilter<D>(
  props: Omit<CustomFilterDefinition<CustomFilterState<D>>, "type">
): CustomFilterDefinition<CustomFilterState<D>> {
  return {
    ...props,
    type: "custom",
  } as CustomFilterDefinition<CustomFilterState<D>>;
}
