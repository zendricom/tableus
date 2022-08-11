import React, { useContext } from "react";
import { TableUI, TableusContext } from "../context";
import { TableConfig } from "../core";
import {
  FilterDefinition,
  FilteringState,
  FilterState,
  isBuiltinFilterDefinition,
} from "../core/types";
import { FetcherState } from "../fetcher";
import {
  CheckFilterDef,
  CheckFilterState,
  SearchFilterDef,
  SearchFilterState,
  SelectFilterDef,
  SelectFilterState,
} from "../filtering";
import { assertUnreachable, useTableusConfig } from "../helpers";

export interface FilterContainerProps<D extends Record<string, any>> {
  filters: FilteringState;
  fetcherState: FetcherState<D>;
  filterDefinitions: FilterDefinition[];
  tableUI: TableUI;
  tableConfig: TableConfig;
  setFilters: (filters: FilteringState) => void;
}

export interface FilterComponentProps {
  filterDefinitions: FilterDefinition[];
  filters: FilteringState;
  setFilters: (filters: FilteringState) => void;

  filterKey: FilterDefinition["key"];
  props?: any;
}

export function FilterComponent({
  filterDefinitions,
  filters,
  setFilters,
  filterKey,
  props,
}: FilterComponentProps) {
  const config = useTableusConfig();
  const { tableUI } = config;

  const filter = filters.find((f) => f.key === filterKey);
  const filterDefinition = filterDefinitions.find((f) => f.key === filterKey);
  if (filterDefinition === undefined) {
    throw new Error(`Filter ${filterKey} not found`);
  }

  const getSetFilterFunc = <F extends FilterState>(
    key: string,
    type: F["type"]
  ) => {
    return (value: F["value"] | ((value: F["value"]) => void)) => {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (value instanceof Array && value.length === 0)
      ) {
        setFilters(filters.filter((f) => f.key !== key));
        return;
      }

      const filterExists = filters.find((f) => f.key === key);

      if (!filterExists) {
        const newValue = value instanceof Function ? value(undefined) : value;
        setFilters([...filters, { key, value: newValue, type }]);
        return;
      }

      const newFilters = filters.map((filter) => {
        if (filter.key === key) {
          const newValue =
            value instanceof Function ? value(filter.value) : value;
          return {
            ...filter,
            value: newValue,
          };
        }
        return filter;
      });
      setFilters(newFilters);
    };
  };

  if (!isBuiltinFilterDefinition(filterDefinition)) {
    const Renderer = filterDefinition.renderer;
    return (
      <Renderer
        filterDefinition={filterDefinition}
        filter={filter}
        key={filterDefinition.key}
        props={props}
        setFilter={getSetFilterFunc(filterKey, filterDefinition.type)}
      />
    );
  }

  switch (filterDefinition.type) {
    case "search":
      const SearchFilter = tableUI.SearchFilter;
      if (SearchFilter === undefined) {
        throw new Error("SearchFilter component is not defined");
      }
      return (
        <SearchFilter
          filterDefinition={filterDefinition as SearchFilterDef}
          filter={filter as SearchFilterState}
          key={filterDefinition.key}
          props={props}
          setFilter={getSetFilterFunc(filterKey, "search")}
        />
      );
    case "select":
      const SelectFilter = tableUI.SelectFilter;
      if (SelectFilter === undefined) {
        throw new Error("SelectFilter component is not defined");
      }
      return (
        <SelectFilter
          filterDefinition={filterDefinition as SelectFilterDef}
          filter={filter as SelectFilterState}
          key={filterDefinition.key}
          props={props}
          setFilter={getSetFilterFunc<SelectFilterState>(
            filterDefinition.key,
            "select"
          )}
        />
      );
    case "check":
      const CheckFilter = tableUI.CheckFilter;
      if (CheckFilter === undefined) {
        throw new Error("CheckFilter component is not defined");
      }
      return (
        <CheckFilter
          filterDefinition={filterDefinition as CheckFilterDef}
          filter={filter as CheckFilterState}
          key={filterDefinition.key}
          props={props}
          setFilter={getSetFilterFunc<CheckFilterState>(
            filterDefinition.key,
            "check"
          )}
        />
      );

    default:
      assertUnreachable(filterDefinition);
  }
}
