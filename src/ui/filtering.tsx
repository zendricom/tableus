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
  const isMulti = filterDefinition.isMulti;
  const activeOptions = filterDefinition.options.filter((option) =>
    isMulti
      ? (filter?.value as string[] | undefined)?.includes(option.value)
      : filter?.value === option.value
  );

  return (
    <DropdownButton
      title={filterDefinition.label}
      variant="secondary"
      as={ButtonGroup}
      {...props}
    >
      {filterDefinition.options.map((option) => {
        const isActive = activeOptions.includes(option);
        const handleClick = () => {
          if (!isMulti) {
            setFilter(option.value);
            return;
          }
          setFilter((prev) =>
            isActive
              ? (prev as string[]).filter((o) => o !== option.value)
              : [...(prev ? prev : []), option.value]
          );
        };

        return (
          <Dropdown.Item
            active={isActive}
            key={option.value}
            onClick={handleClick}
          >
            {option.label}
          </Dropdown.Item>
        );
      })}

      <Dropdown.Divider />
      <Dropdown.Item
        onClick={() => setFilter(isMulti ? [] : "")}
        active={activeOptions.length === 0}
      >
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
