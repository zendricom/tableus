import React from "react";
import {
  ButtonGroup,
  Dropdown,
  DropdownButton,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import { FilterProps } from "../context";
import {
  SearchFilterDef,
  SearchFilterState,
  SelectFilterDef,
  SelectFilterState,
} from "../filtering";

export const SelectFilter = ({
  filterDefinition,
  filter,
  setFilter,
  props,
}: FilterProps<SelectFilterState, SelectFilterDef>) => {
  const activeOption = filterDefinition.options.find(
    (option) => option.value === filter?.value
  );
  return (
    <DropdownButton
      title={filterDefinition.label}
      variant="secondary"
      as={ButtonGroup}
      {...props}
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

      <Dropdown.Divider />
      <Dropdown.Item onClick={() => setFilter("")} active={!activeOption}>
        Keine Filterung
      </Dropdown.Item>
    </DropdownButton>
  );
};

export const SearchFilter = ({
  filterDefinition,
  filter,
  setFilter,
  props,
}: FilterProps<SearchFilterState, SearchFilterDef>) => {
  return (
    <InputGroup {...props}>
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
