import React, { useContext } from "react";
import { TableUI, TableusContext } from "../context";
import { TableConfig } from "../core";
import { FilterDefinition, FilteringState, FilterState } from "../core/types";
import { FetcherState } from "../fetcher";
import {
  SearchFilterDef,
  SearchFilterState,
  SelectFilterDef,
  SelectFilterState,
} from "../filtering";

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
  const context = useContext(TableusContext);
  const config = context?.config;
  if (!config?.tableUI) {
    throw new Error("No UI context provided");
  }
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
    return (value: F["value"]) => {
      if (value === undefined || value === null || value === "") {
        setFilters(filters.filter((f) => f.key !== key));
        return;
      }

      const filterExists = filters.find((f) => f.key === key);

      if (!filterExists) {
        setFilters([...filters, { key, value, type }]);
        return;
      }

      const newFilters = filters.map((filter) => {
        if (filter.key === key) {
          return {
            ...filter,
            value,
          };
        }
        return filter;
      });
      setFilters(newFilters);
    };
  };

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
          setFilter={getSetFilterFunc(filterDefinition.key, "search")}
          key={filterDefinition.key}
          props={props}
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
          setFilter={getSetFilterFunc<SelectFilterState>(
            filterDefinition.key,
            "select"
          )}
          key={filterDefinition.key}
          props={props}
        />
      );
    default:
      throw new Error("Unknown filter type");
  }
}
