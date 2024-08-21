import { Autocomplete, Button, FormControl, FormHelperText, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'

function FormComponent({ formConfig, onSave }) {
  const [formData, setFormData] = useState({})
  const [savedData, setSavedData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const initialData = formConfig?.reduce((acc, field) => {
      acc[field.name] = ''
      return acc;
    }, {})
    setFormData(initialData)
  }, [formConfig])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setValidationErrors({ ...validationErrors, [name]: '' });
  }

  useEffect(() => {
    const amount = parseFloat(formData.amount) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const total = amount - (amount * (discount / 100));
    setFormData(prevData => ({ ...prevData, total: total.toFixed(2) }));
  }, [formData.amount, formData.discount]);


  const handleAddToTable = () => {
    const errors = {}
    formConfig?.forEach((field) => {
      if (field.required && !formData[field.name]) {
        errors[field.name] = `${field.label} maydoni to'ldirilishi shart!`;
      }
    })

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setSavedData([...savedData, formData]);
    onSave(formData);

    // Formani tozalash
    setFormData(formConfig?.reduce((acc, field) => {
      acc[field.name] = ''
      return acc;
    }, {}));
  }

  const renderFields = () => {
    return formConfig?.map((field, index) => {
      switch (field.type) {
        case 'text':
        case 'number':
          return (
            <FormControl key={index} fullWidth margin='dense' size='small' error={!!validationErrors[field.name]}>
              <TextField
                margin='dense'
                label={field.label}
                name={field.name}
                type={field.type}
                value={formData[field.name] || ''}
                onChange={handleChange}
                fullWidth
                size='small'
                disabled={field.disabled}
              />
              <FormHelperText>{validationErrors[field.name]}</FormHelperText>
            </FormControl>
          );
        case 'select':
          return (
            <FormControl key={index} fullWidth margin="dense" size="small" error={!!validationErrors[field.name]}>
              <Autocomplete
                options={field.options || []}
                getOptionLabel={(option) => option.label}
                value={field?.options?.find(option => option.value === formData[field.name]) || null}
                onChange={(event, newValue) => {
                  setFormData({ 
                    ...formData, 
                    [field.name]: newValue ? newValue.value : '',
                    [`${field.name}Name`]: newValue ? newValue.label : ''
                  });
                }}
                size='small'
                renderInput={(params) => (
                  <TextField
                    size='small'
                    {...params}
                    label={field.label}
                    helperText={validationErrors[field.name]}
                    error={!!validationErrors[field.name]}
                  />
                )}
              />
            </FormControl>
          );
        default:
          return null;
      }
    })
  }

  return (
    <div className="form-component">
      <div className="render">
        {renderFields()}
      </div>
      <Button variant='outlined' className="add-to-table" onClick={handleAddToTable}>Qo'shish</Button>
    </div>
  )
}

export default FormComponent
