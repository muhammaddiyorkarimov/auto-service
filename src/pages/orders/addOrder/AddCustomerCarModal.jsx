import React, { useEffect, useState } from 'react';
import CustomersService from '../../../services/landing/customers';
import { Alert, AlertTitle, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import OurCars from '../../ourCars/OurCars';
import CarsService from '../../../services/landing/carsService';

function AddCustomerCarModal({ open, onClose, onSuccess, selectedCustomerId }) {
    const [formConfig, setFormConfig] = useState([
        { type: 'text', label: 'Code', name: 'code', required: true },
        { type: 'text', label: 'Name', name: 'name', required: true },
        { type: 'text', label: 'Brand', name: 'brand', required: true },
        { type: 'text', label: 'Color', name: 'color', required: true },
        { type: 'text', label: 'State Number', name: 'state_number', required: true },
    ]);

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        brand: '',
        color: '',
        state_number: '',
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
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const postData = {
            code: formData.code,
            name: formData.name,
            brand: formData.brand,
            color: formData.color,
            state_number: formData.state_number,
            customer: selectedCustomerId,
        }

        try {
            const response = await CarsService.postCars(postData);
            if (response) {
                setSuccess(true);
                onClose();
                onSuccess(response);
            } else {
                setError(true);
            }
        } catch (error) {
            if (error.response.data.customer[0] === "This field may not be null.") {
                setError("Iltimos, mijozni tanlang");
            }
        }
    };

    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess(false);
                setError(false);
            }, 5000);
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
            <DialogTitle>Mashina qo'shish</DialogTitle>
            <DialogContent>
                {success && (
                    <Alert severity="success" onClose={() => setSuccess(false)}>
                        <AlertTitle>Muvaffaqiyatli</AlertTitle>
                        Mashina muvaffaqiyatli qo'shildi
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" onClose={() => setError(false)}>
                        <AlertTitle>Xato</AlertTitle>
                        Mashina qo'shishda xato yuz berdi. Iltimos Mijoz tanlanganligini tekshirib ko'ring!
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

export default AddCustomerCarModal;
