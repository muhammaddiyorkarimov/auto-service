import React from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

function AddItemBtn({ name, onClick }) {
    return (
        <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onClick}
        >
            {name}
        </Button>
    );
}

export default AddItemBtn;
