import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

function DetailsModal({ open, onClose, data, onEdit, onDelete }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ma'lumot Tafsilotlari</DialogTitle>
      <DialogContent>
        {data ? (
          Object.entries(data).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '8px' }}>
              <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
            </div>
          ))
        ) : (
          <p>Ma'lumot yo'q</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onEdit(data)}
          startIcon={<Edit />}
          variant="contained"
          color="primary"
        >
          Tahrirlash
        </Button>
        <Button
          onClick={() => onDelete(data)}
          startIcon={<Delete />}
          variant="contained"
          color="secondary"
        >
          O'chirish
        </Button>
        <Button onClick={onClose} variant="outlined">Yopish</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DetailsModal;
