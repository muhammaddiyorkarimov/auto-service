import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SortAvailable = ({ value, onChange }) => {
    return (
        <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="import-required-label">Mavjud</InputLabel>
            <Select
                labelId="import-required-label"
                id="import-required"
                value={value}
                onChange={e => onChange(e.target.value)}
                label="Import Required"
            >
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
            </Select>
        </FormControl>
    );
};

export default SortAvailable;
