import React, { useState } from 'react';
import AddItemBtn from '../addItemBtn/AddItemBtn';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert, AlertTitle } from '@mui/material';
import Provider from '../../services/landing/provider';

function AddProvider() {
    const [open, setOpen] = useState(false);
    const [formConfig] = useState([
        { type: 'text', label: 'Nomi', name: 'name' },
        { type: 'text', label: 'Telefon raqam', name: 'phone_number' },
        { type: 'number', label: 'Debt', name: 'debt' },
    ]);
    const [formData, setFormData] = useState({
        name: '',
        phone_number: '',
        debt: ''
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name) {
            errors.name = 'Ushbu maydoni to\'ldirilishi shart';
        }
        if (!formData.debt) {
            errors.debt = 'Ushbu maydoni to\'ldirilishi shart';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const response = await Provider.postProvider(formData);
            setSuccess(true);
            setOpen(false);
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            setError(true);
        }
    };

    const renderFields = () => {
        return formConfig.map((field, index) => (
            <TextField
                key={index}
                margin="dense"
                label={field.label}
                name={field.name}
                type={field.type}
                onChange={handleChange}
                fullWidth
                size="small"
                error={!!validationErrors[field.name]}
                helperText={validationErrors[field.name]}
                required={field.name === 'name' || field.name === 'debt'}
            />
        ));
    };

    return (
        <div>
            {success && (
                <Alert severity="success" onClose={() => setSuccess(false)}>
                    <AlertTitle>Muvaffaqiyatli</AlertTitle>
                </Alert>
            )}
            {error && (
                <Alert severity="error" onClose={() => setError(false)}>
                    <AlertTitle>{error}</AlertTitle>
                </Alert>
            )}
            <AddItemBtn name="Provider qo'shish" onClick={() => setOpen(true)} />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <div className="dialog-wrapper">
                    <DialogTitle>Ta'minlovchi qo'shish</DialogTitle>
                    <DialogContent className="dialog-content">{renderFields()}</DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Bekor qilish</Button>
                        <Button onClick={handleSubmit}>Saqlash</Button>
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    );
}

export default AddProvider;
