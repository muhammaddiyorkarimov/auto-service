import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

function EditItem({ open, onClose, onSave, formConfig, initialData }) {
  const [formData, setFormData] = useState(initialData || {});
  const [file, setFile] = useState(null);

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
    onSave(formData);
    onClose(); // Close the dialog after saving
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
              type={field.type}
              value={formData[field.name] || ''}
              onChange={handleChange}
              fullWidth
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
            />
          );
        case 'select':
          return (
            <FormControl key={index} fullWidth margin="dense">
              <InputLabel>{field.label}</InputLabel>
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
      <DialogTitle>Maxsulotni tahrirlash</DialogTitle>
      <DialogContent>{renderFields()}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Bekor qilish</Button>
        <Button onClick={handleSave}>Saqlash</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditItem;
