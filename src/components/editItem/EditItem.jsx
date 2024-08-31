import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

// Helper function to format numbers with spaces
const formatNumberWithSpaces = (number) => {
  return number?.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

function EditItem({ name, open, onClose, onSave, formConfig, initialData }) {
  const [formData, setFormData] = useState(initialData || {});
  const [file, setFile] = useState(null);

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    let updatedFormData = { ...formData, [name]: value };

    if (name === 'paid' || name === 'debt') {
      const paid = Number(updatedFormData.paid || 0);

      if (paid >= (formData.total || 0)) {
        updatedFormData.debt = 0;
      } else {
        updatedFormData.debt = (formData.total || 0) - paid;
      }
    }

    // Apply number formatting only if field type is 'number'
    if (formConfig.find((field) => field.name === name && field.type === 'number')) {
      const rawValue = value.replace(/\s/g, ''); // Remove spaces to get raw number
      if (/^\d*$/.test(rawValue)) { // Only allow digits
        updatedFormData[name] = formatNumberWithSpaces(rawValue);
      }
    }

    setFormData(updatedFormData);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    setFormData({
      ...formData,
      [event.target.name]: file,
    });
  };

  const handleSave = () => {
    // Remove spaces from number fields before saving
    const rawData = { ...formData };
    Object.keys(rawData).forEach(key => {
      if (formConfig.some(f => f.type === 'number' && f.name === key)) {
        const value = rawData[key];
        // Faqat string bo'lgan qiymatlarga replace qo'llanadi
        if (typeof value === 'string') {
          rawData[key] = value.replace(/\s/g, ''); // Remove spaces for number fields
        }
      }
    });

    onSave(rawData);
    onClose();
  };


  const renderFields = () => {
    return formConfig && formConfig.map((field, index) => {
      switch (field.type) {
        case 'text':
        case 'number':
          return (
            <TextField
              key={index}
              margin="dense"
              label={field.label}
              name={field.name}
              type="text" // Always render as text to allow formatting for number types
              value={formData[field.name] || ''}
              onChange={handleChange}
              fullWidth
              disabled={field.disabled}
              inputProps={field.type === 'number' ? { inputMode: 'numeric' } : {}}
            />
          );
        case 'textarea':
          return (
            <TextField
              key={index}
              margin="dense"
              label={field.label}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              disabled={field.disabled}
            />
          );
        case 'select':
          return (
            <FormControl key={index} fullWidth margin="dense">
              <Autocomplete
                options={field.options}
                getOptionLabel={(option) => option.label}
                value={field.options.find(option => option.value === formData[field.name]) || null}
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    [field.name]: newValue ? newValue.value : '',
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={field.label}
                    variant="outlined"
                    fullWidth
                  />
                )}
                disabled={field.disabled}
              />
            </FormControl>
          );
        case 'file':
          return (
            <Button key={index} variant="contained" component="label">
              {field.label}
              <input
                type="file"
                hidden
                name={field.name}
                onChange={handleFileChange}
              />
            </Button>
          );
        default:
          return null;
      }
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{name ? name : 'Maxsulotni tahrirlash'}</DialogTitle>
      <DialogContent>{renderFields()}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Bekor qilish</Button>
        <Button onClick={handleSave}>Saqlash</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditItem;
