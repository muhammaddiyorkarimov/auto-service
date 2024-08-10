import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

function DeleteProduct({ open, itemName, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Maxsulotni o'chirish</DialogTitle>
      <DialogContent>
        <Typography>Haqiqatan ham {itemName} nomli maxsulotni o'chirmoqchimisiz?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Bekor qilish</Button>
        <Button onClick={onConfirm} color="secondary">O'chirish</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteProduct;
