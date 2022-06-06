import React from "react";
import {
  Dropdown,
  DropdownButton,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import { FilterContainerProps, FilterProps } from "../context";
import {
  SearchFilterDef,
  SearchFilterState,
  SelectFilterDef,
  SelectFilterState,
} from "../filtering";

export const FilterContainer = (props: FilterContainerProps) => {
  return <div>{props.children}</div>;
};

export const SelectFilter = ({
  filterDefinition,
  filter,
  setFilter,
}: FilterProps<SelectFilterState, SelectFilterDef>) => {
  const activeOption = filterDefinition.options.find(
    (option) => option.value === filter?.value
  );
  return (
    <DropdownButton
      title={activeOption ? activeOption.label : filterDefinition.label}
    >
      {filterDefinition.options.map((option) => (
        <Dropdown.Item
          active={option.value === filter?.value}
          key={option.value}
          onClick={() => setFilter(option.value)}
        >
          {option.label}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

export const SearchFilter = ({
  filterDefinition,
  filter,
  setFilter,
}: FilterProps<SearchFilterState, SearchFilterDef>) => {
  return (
    <InputGroup>
      <InputGroup.Text>{filterDefinition.label}</InputGroup.Text>
      <FormControl
        type="text"
        value={filter?.value || ""}
        onChange={(e) => setFilter(e.target.value)}
        placeholder={filterDefinition.placeholder}
      />
    </InputGroup>
  );
};
