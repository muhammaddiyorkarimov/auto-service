import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Filter = ({ selectedFilter, onFilterChange, options }) => {
  const handleChange = (event) => {
    onFilterChange(event.target.value);
  };

  return (
    <FormControl >
      <InputLabel>Sortlash</InputLabel>
      <Select
        value={selectedFilter}
        onChange={handleChange}
        label="Sortlash"
        size='small'
      >
        {options?.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Filter;
