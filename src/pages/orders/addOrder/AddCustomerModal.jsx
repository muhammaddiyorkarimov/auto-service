import React, { useEffect, useState } from 'react';
import CustomersService from '../../../services/landing/customers';
import { Alert, AlertTitle, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

function AddCustomerModal({ open, onClose, onSuccess }) {
    const [formConfig, setFormConfig] = useState([
        { type: 'text', label: 'First Name', name: 'first_name', required: true },
        { type: 'text', label: 'Last Name', name: 'last_name', required: true },
        { type: 'text', label: 'Phone Number', name: 'phone_number', required: true },
        { type: 'text', label: 'Phone Number Extra', name: 'phone_number_extra' },
        { type: 'text', label: 'Passport Serial Numbers', name: 'passport_serial_numbers' },
        { type: 'text', label: 'Passport Serial Letters', name: 'passport_serial_letters' },
        { type: 'text', label: 'Address', name: 'address' },
        { type: 'number', label: 'Debt', name: 'debt', required: true },
    ]);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        phone_number_extra: '',
        passport_serial_numbers: '',
        passport_serial_letters: '',
        address: '',
        debt: '',
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const validateForm = () => {
        const errors = {};
        formConfig.forEach((field) => {
            if (field.required && !formData[field.name]) {
                errors[field.name] = `${field.label} to'ldirilishi shart`;
            }
        });
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submit behavior
        if (!validateForm()) {
            return;
        }

        try {
            const response = await CustomersService.postCustomers(formData);
            if (response) {
                setSuccess(true);
                onClose();
                onSuccess(response);

                setFormData({
                    first_name: '',
                    last_name: '',
                    phone_number: '',
                    phone_number_extra: '',
                    passport_serial_numbers: '',
                    passport_serial_letters: '',
                    address: '',
                    debt: '',
                });
            } else {
                setError(true);
            }
        } catch (error) {
            setError(true);
        }
    };

    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess(false);
                setError(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    const renderFields = () => {
        return formConfig.map((field, index) => (
            <TextField
                key={index}
                margin="dense"
                label={field.label}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                fullWidth
                size="small"
                error={!!validationErrors[field.name]}
                helperText={validationErrors[field.name]}
                required={field.required}
            />
        ));
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Mijoz qo'shish</DialogTitle>
            <DialogContent>
                {success && (
                    <Alert severity="success" onClose={() => setSuccess(false)}>
                        <AlertTitle>Muvaffaqiyatli</AlertTitle>
                        Mijoz muvaffaqiyatli qo'shildi
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" onClose={() => setError(false)}>
                        <AlertTitle>Xato</AlertTitle>
                        Mijoz qo'shishda xato yuz berdi
                    </Alert>
                )}
                {renderFields()}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Bekor qilish</Button>
                <Button onClick={handleSubmit}>Saqlash</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddCustomerModal;
