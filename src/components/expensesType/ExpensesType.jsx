import React, { useState } from 'react';
import AddItemBtn from '../addItemBtn/AddItemBtn';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert, AlertTitle, Snackbar } from '@mui/material';
import ExpensesTypeService from '../../services/landing/expensesTypeSerive';

function ExpensesType() {
    const [open, setOpen] = useState(false);
    const [formConfig] = useState([
        { type: 'text', label: 'Nomi', name: 'name' },
    ]);
    const [formData, setFormData] = useState({
        name: '',
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);

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
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const response = await ExpensesTypeService.postExpensesTypeService(formData);
            setSuccess(true);
            setOpen(false);
            setSnackbarOpen(true)
            setTimeout(() => {
                window.location.reload();
            }, 1000);
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
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert onClose={() => setSnackbarOpen(false)} severity={success ? "success" : "error"} sx={{ width: '100%' }}>
                        Muvaffaqiyatli qo'shildi
                    </Alert>
                </Snackbar>
            )}
            {error && (
                <Alert severity="error" onClose={() => setError(false)}>
                    <AlertTitle>{error}</AlertTitle>
                </Alert>
            )}
            <AddItemBtn name="Xarajat turi qo'shish" onClick={() => setOpen(true)} />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <div className="dialog-wrapper">
                    <DialogTitle>Xarajat turi qo'shish</DialogTitle>
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

export default ExpensesType;
