import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControl, FormHelperText, IconButton, Input } from '@mui/material';
import { AddPhotoAlternate } from '@mui/icons-material';
import Autocomplete from '@mui/material/Autocomplete';

function AddItemModal({ open, onClose, onSave, formConfig }) {
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const initialData = formConfig?.reduce((acc, field) => {
      acc[field.name] = '';
      return acc;
    }, {});
    setFormData(initialData);
  }, [formConfig]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationErrors({ ...validationErrors, [name]: '' }); // Xatolikni tozalash
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSave = () => {
    const errors = {};
    formConfig.forEach((field) => {
      if (field.required && !formData[field.name]) {
        errors[field.name] = `${field.label} maydoni to'ldirilishi shart!`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    onSave(formData, file);
  };

  const renderFields = () => {
    return formConfig?.map((field, index) => {
      switch (field.type) {
        case 'text':
        case 'number':
          return (
            <FormControl key={index} fullWidth margin="dense" size="small" error={!!validationErrors[field.name]}>
              <TextField
                margin="dense"
                label={field.label}
                name={field.name}
                type={field.type}
                value={formData[field.name] || ''}
                onChange={handleChange}
                fullWidth
                size="small"
              />
              <FormHelperText>{validationErrors[field.name]}</FormHelperText>
            </FormControl>
          );
        case 'textarea':
          return (
            <FormControl key={index} fullWidth margin="dense" error={!!validationErrors[field.name]}>
              <TextField
                margin="dense"
                label={field.label}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
              />
              <FormHelperText>{validationErrors[field.name]}</FormHelperText>
            </FormControl>
          );
        case 'select':
          return (
            <FormControl key={index} fullWidth margin="dense" size="small" error={!!validationErrors[field.name]}>
              <Autocomplete
                options={field.options || []} // Default to empty array if undefined
                getOptionLabel={(option) => option.label}
                value={field?.options?.find(option => option.value === formData[field.name]) || null}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, [field.name]: newValue ? newValue.value : '' });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={field.label}
                    error={!!validationErrors[field.name]}
                    helperText={validationErrors[field.name]}
                  />
                )}
              />
            </FormControl>
          );
        case 'file':
          return (
            <div key={index} style={{ margin: '16px 0' }}>
              <Input
                type="file"
                onChange={handleFileChange}
                inputProps={{ accept: field.accept || 'image/*' }}
              />
              <IconButton component="label">
                <AddPhotoAlternate />
              </IconButton>
            </div>
          );
        default:
          return null;
      }
    });
  };
  

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="dialog-wrapper">
        <DialogTitle>Yangi maxsulot qo'shish</DialogTitle>
        <DialogContent className='dialog-content'>{renderFields()}</DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Bekor qilish</Button>
          <Button onClick={handleSave}>Saqlash</Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}

export default AddItemModal;
