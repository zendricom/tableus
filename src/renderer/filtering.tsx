import React from "react";
import { TableUI } from "../context";
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

export function FilterContainer<D extends Record<string, any>>({
  filters,
  filterDefinitions,
  tableUI,
  fetcherState,
  setFilters,
}: FilterContainerProps<D>) {
  if (filterDefinitions.length === 0) return null;

  const FilterContainerComponent = tableUI.FilterContainer;
  if (FilterContainerComponent === undefined) {
    throw new Error("FilterContainer component is not defined");
  }

  const zippedFilters = filterDefinitions.map((filterDefinition) => {
    const filter = filters.find((f) => f.key === filterDefinition.key);
    return {
      filterDefinition,
      filter,
    };
  });

  const getSetFilterFunc = <F extends FilterState>(
    key: string,
    type: F["type"]
  ) => {
    return (value: F["value"]) => {
      if (!value) {
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

  return (
    <FilterContainerComponent
      filters={filters}
      filterDefinitions={filterDefinitions}
      fetcherState={fetcherState}
      setFilters={setFilters}
    >
      {zippedFilters.map(({ filterDefinition, filter }) => {
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
              />
            );
          default:
            throw new Error("Unknown filter type");
        }
      })}
    </FilterContainerComponent>
  );
}
