import React, { useState, useEffect } from 'react';
import { Box, TextField, FormControl, Button, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

function FormData({ onSave, formConfig, onCustomerIdChange, onManagerIdChange, onServiceIdChange, price, onProductIdChange, productPrice, productAmount }) {
    const [customerId, setCustomerId] = useState(null);
    const [formData, setFormData] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [serviceId, setServiceId] = useState(null);
    const [productId, setProductId] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [managerId, setManagerId] = useState(null);

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
            const amount = formData?.amount || 0;
            const discount = formData?.discount || 0;
            const discountValue = ((amount * productPrice * discount) / 100);
            const total = (productPrice * amount) - discountValue;

            setFormData(prevData => ({
                ...prevData,
                total: isNaN(total) ? 0 : total
            }));
        }
    }, [productPrice, formData?.amount, formData?.discount]);

    function formatNumberWithCommas(number) {
        return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    const handleChange = (e, type) => {
        let { name, value } = e.target;

        // Agar input raqam bo'lsa, raqamni formatlaymiz
        if (type === 'number') {
            const plainNumber = value.replace(/\s/g, ''); // Oldingi probellarni olib tashlaymiz

            if (/^\d*$/.test(plainNumber)) {
                const formattedValue = formatNumberWithCommas(plainNumber);

                // Formatlangan qiymatni ko'rsatamiz va asl raqamni saqlaymiz
                setFormData(prevData => ({
                    ...prevData,
                    [name]: plainNumber // FormData uchun asl raqamni saqlaymiz
                }));
            }
        } else {
            // Agar matn bo'lsa, oddiy qiymatni qabul qilamiz
            setFormData(prevData => ({
                ...prevData,
                [name]: value // FormData uchun oddiy qiymatni saqlaymiz
            }));
        }
    };

    useEffect(() => {
        if (customerId !== null) {
            onCustomerIdChange(customerId);
        }
        if (managerId !== null) {
            onManagerIdChange(managerId);
        }
        if (serviceId !== null) {
            onServiceIdChange(serviceId);
        }
        if (productId !== null) {
            onProductIdChange(productId);
        }
    }, [customerId, serviceId, onCustomerIdChange, managerId, onManagerIdChange, productId, onServiceIdChange, onProductIdChange]);

    const handleSave = () => {
        const errors = {};
        formConfig.forEach(field => {
            if (field.required && !formData[field.name]) {
                errors[field.name] = `Kiritish majburiy!`;
            }
            // Default qiymatlarni formData'ga kiritish
            if (field.name === 'discount' && !formData.hasOwnProperty(field.name)) {
                formData[field.name] = 0;
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
                                type={field.type === 'number' ? 'text' : field.type} // Raqam uchun type="text" bo'ladi
                                value={field.type === 'number'
                                    ? formatNumberWithCommas(formData[field.name] !== undefined ? formData[field.name] : (field.name === 'discount' ? 0 : ''))
                                    : (formData[field.name] !== undefined ? formData[field.name] : '')}
                                onChange={(e) => handleChange(e, field.type)} // Tip bo'yicha handleChange ni chaqiramiz
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
                                    value={field?.options?.find(option => option.value === (formData[field.name] || field.value)) || null}
                                    onChange={(event, newValue) => {
                                        setFormData(prevData => ({
                                            ...prevData,
                                            [field.name]: newValue ? newValue.value : '',
                                            [`${field.name}Name`]: newValue ? newValue.label : ''
                                        }));
                                        if (field.name === 'customer') {
                                            setCustomerId(newValue ? newValue.value : '');
                                        }
                                        if (field.name === 'manager') {
                                            setManagerId(newValue ? newValue.value : '');
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
                                        <p style={{ fontSize: '16px', paddingLeft: '18px' }}>Narx: {formatNumberWithCommas(price)} so'm</p>
                                    </Typography>
                                )}
                                {selectedProduct && (
                                    <Typography variant="caption" color="textSecondary">
                                        <p style={{ fontSize: '16px', paddingLeft: '18px' }}>Tannarx: {formatNumberWithCommas(productPrice)} so'm</p>
                                        <p style={{ fontSize: '16px', paddingLeft: '18px' }}>Mavjud: {productAmount} ta</p>
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
            <div style={{ margin: '10px 0' }}>
                {formConfig?.length > 0 && <Button variant="contained" color="primary" onClick={handleSave}>Saqlash</Button>}
            </div>
        </>
    );
}

export default FormData;
