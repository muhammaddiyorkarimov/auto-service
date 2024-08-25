import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControl, FormHelperText, IconButton, Input } from '@mui/material';
import { AddPhotoAlternate } from '@mui/icons-material';
import Autocomplete from '@mui/material/Autocomplete';
import OurProduct from '../../services/landing/ourProduct';
import Provider from './../../services/landing/provider';

function AddItemModal({ name, open, onClose, onSave, providerById }) {
    const [formData, setFormData] = useState({});
    const [file, setFile] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [provider, setProvider] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [formConfig, setFormConfig] = useState([]);

    const unitOptions = [
        {id: 1, name: 'Dona'},
        {id: 2, name: 'Komplekt'},
        {id: 3, name: 'Litr'},
    ]
    
    useEffect(() => {
        const fetchProvider = async () => {
            try {
                const response = await Provider.getProvider();
                setProvider(response);
                setFormConfig([
                    { type: 'text', label: 'Kod', name: 'code' },
                    { type: 'text', label: 'Nomi', name: 'name', required: true },
                    { type: 'number', label: 'Miqdori', name: 'amount', required: true },
                    { type: 'number', label: 'Min miqdor', name: 'min_amount', required: true },
                    { type: 'select', label: 'Birlik', name: 'unit', required: true, options: unitOptions.map(p => ({value: p.id, label: p.name}))},
                    { type: 'number', label: 'Import narxi', name: 'import_price', required: true },
                    { type: 'number', label: 'Eksport narxi', name: 'export_price' },
                    { type: 'number', label: 'Chegirma', name: 'max_discount', required: true },
                ]);
            } catch (error) {
                alert("Ta’minotchilarni olishda xatolik:", error);
            }
        };

        fetchProvider();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setValidationErrors({ ...validationErrors, [name]: '' }); // Xatolikni tozalash
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSave = async () => {
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
    
        try {
            // `providerById` ni `formData` ga qo'shing
            const dataToSend = { ...formData, provider: providerById };
            const newProduct = await OurProduct.postProduct(dataToSend);
            onSave(newProduct);
            setSuccessMsg("Muvaffaqiyatli qo'shildi");
            setSnackbarOpen(true);
            const updatedProvider = await Provider.getProvider();
            setProvider(updatedProvider);
        } catch (error) {
            setErrorMsg(error.message || "Mahsulotni qo'shishda xatolik yuz berdi!");
            setSnackbarOpen(true);
        } finally {
            onClose();
        }
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
                <DialogTitle>{name ? name : 'Yangi maxsulot qo\'shish'}</DialogTitle>
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
