import React, { useState, useEffect } from 'react';
import { Box, TextField, FormControl, Button, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

function FormData({ onSave, formConfig, onCustomerIdChange, onServiceIdChange, price, onProductIdChange, productPrice }) {
    const [customerId, setCustomerId] = useState(null);
    const [formData, setFormData] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [serviceId, setServiceId] = useState(null);
    const [productId, setProductId] = useState(null);
    const [selectedService, setSelectedService] = useState(null)
    const [selectedProduct, setSelectedProduct] = useState(null)

    console.log(productId)

    useEffect(() => {
        const initialData = formConfig?.reduce((acc, field) => {
            acc[field.name] = '';
            return acc;
        }, {});
        setFormData(initialData);
    }, [formConfig]);


    useEffect(() => {
        if (price > 0) {
            const { part } = formData;
            const total = price * part;
            setFormData(prevData => ({
                ...prevData,
                total
            }));
        }
    }, [price, formData?.amount, formData?.discount, formData?.part]);
    useEffect(() => {
        if (productPrice > 0) {
            const { amount, discount } = formData;
            console.log(amount, discount);
            const discountValue = ((amount * productPrice * discount) / 100);
            const total = (productPrice * amount) - discountValue;
            console.log(total)
            setFormData(prevData => ({
                ...prevData,
                total
            }));
        }
    }, [productPrice, formData?.amount, formData?.discount]);
    console.log(formData)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        setValidationErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));

        if (name === 'customer') {
            setCustomerId(value);
        }
        if (name === 'service') {
            setServiceId(value);
        }
        if (name === 'product') {
            setProductId(value);
        }
    };

    useEffect(() => {
        if (customerId !== null) {
            onCustomerIdChange(customerId);
        }
        if (serviceId !== null) {
            onServiceIdChange(serviceId);
        }
        if (productId !== null) {
            onProductIdChange(productId);
        }
    }, [customerId, serviceId, onCustomerIdChange, productId, onServiceIdChange, onProductIdChange]);

    const handleSave = () => {
        const errors = {};
        formConfig.forEach(field => {
            if (field.required && !formData[field.name]) {
                errors[field.name] = `Kiritish majburiy!`;
            }
        });

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        onSave(formData);
        setFormData({});
        setServiceId(null);
        setProductId(null);
    };

    const renderFields = () => {
        return formConfig?.map((field, index) => {
            switch (field.type) {
                case 'text':
                case 'number':
                    return (
                        <FormControl key={index} margin="dense" size="small" error={!!validationErrors[field.name]}>
                            <TextField
                                margin="dense"
                                label={field.label}
                                name={field.name}
                                type={field.type}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                size="small"
                                disabled={field.disabled}
                            />
                        </FormControl>
                    );

                case 'select':
                    return (
                        <FormControl key={index} margin="dense" size="small">
                            <Box display="flex" alignItems="center">
                                <Autocomplete
                                    disabled={field.disabled}
                                    sx={{ minWidth: '200px' }}
                                    size="small"
                                    options={field.options || []}
                                    getOptionLabel={(option) => option?.label || ""}
                                    value={field?.options?.find(option => option.value === formData[field.name]) || null}
                                    onChange={(event, newValue) => {
                                        setFormData(prevData => ({
                                            ...prevData,
                                            [field.name]: newValue ? newValue.value : '',
                                            [`${field.name}Name`]: newValue ? newValue.label : ''
                                        }));
                                        if (field.name === 'customer') {
                                            setCustomerId(newValue ? newValue.value : '');
                                        }
                                        if (field.name === 'service') {
                                            setServiceId(newValue ? newValue.value : '');
                                            setSelectedService(newValue ? newValue : null);
                                        }
                                        if (field.name === 'product') {
                                            setProductId(newValue ? newValue.value : '');
                                            setSelectedProduct(newValue ? newValue : null);
                                        }

                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={field.label}
                                            error={!!validationErrors[field.name]}
                                        />
                                    )}
                                />
                                {field.renderButton && (
                                    <Box p={0} ml={1}>
                                        {field.renderButton()}
                                    </Box>
                                )}
                                {selectedService && (
                                    <Typography variant="caption" color="textSecondary">
                                        Narx: {price} so'm
                                    </Typography>
                                )}
                                {selectedProduct && (
                                    <Typography variant="caption" color="textSecondary">
                                        Narx: {productPrice} so'm
                                    </Typography>
                                )}
                            </Box>

                        </FormControl>
                    );
                default:
                    return null;
            }
        });
    };

    return (
        <>
            {renderFields()}
            <div style={{ marginTop: '10px' }}>
                <Button variant="contained" color="primary" onClick={handleSave}>Saqlash</Button>
            </div>
        </>
    );
}

export default FormData;
