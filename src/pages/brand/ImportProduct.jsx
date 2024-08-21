import './brand.css'
import Navbar from '../../components/navbar/Navbar'
import SideBar from '../../components/sidebar/SideBar'
import { Autocomplete, Box, Button, FormControl, FormHelperText, IconButton, TextField } from '@mui/material'
import { AddIcon } from '@mui/icons-material/Add';
import { useCallback, useEffect, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import Provider from '../../services/landing/provider'
import OurProduct from '../../services/landing/ourProduct'
import AddProvider from './../../components/addProvider/AddProvider';
import ImportProduct from './../../services/landing/importProduct';
import AddItemModal from './AddProductModal';



function Import() {
    const [provider, setProvider] = useState([])
    const [providerById, setProviderById] = useState([])
    const [productById, setProductById] = useState([])
    const [product, setProduct] = useState([])
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [overallTotal, setOverallTotal] = useState(0);
    const [selectedProvider, setSelectedProvider] = useState(null)
    const [productId, setProductId] = useState(null)
    const [providerOptions, setProviderOptions] = useState([]);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [loading, setLoading] = useState(false)
    const [addOpen, setAddOpen] = useState(false);

    const { data: providerData, loading: providerLoading, error: providerError } = useFetch(Provider.getProvider)

    useEffect(() => {
        if (selectedProvider) {
            Provider.getProviderById(selectedProvider)
                .then(response => {
                    setProviderById(response);
                })
                .catch(error => {
                    alert('Error fetching provider by ID:', error.message);
                });
        }
        if (productId) {
            OurProduct.getProductById(productId)
                .then(response => {
                    if (response) {
                        setProductById(response);
                    } else {
                        alert('Product not found or ID is invalid');
                    }
                })
                .catch(error => {
                    alert('Error fetching product by ID:', error.message);
                });
        }

    }, [selectedProvider, productId]);



    const { data: productData, loading: productLoading, error: productError } = useFetch(OurProduct.getProduct)


    const [formData, setFormData] = useState({});
    const [openDetail, setOpenDetail] = useState(false)
    const [showAddProvider, setShowAddProvider] = useState(false)
    const [validationErrors, setValidationErrors] = useState({});
    const [formConfig, setFormConfig] = useState([])

    useEffect(() => {
        if (productData) {
            setProduct(productData.results)
        }
    }, [productData])

    useEffect(() => {
        if (providerData) {
            const options = providerData.map(provider => ({
                value: provider.id,
                label: provider.name,
            }));
            setProviderOptions(options);
        }
    }, [providerData]);


    useEffect(() => {
        if (productData && providerData) {
            setFormConfig([
                { type: 'number', label: 'Artikul', name: 'code', required: true },
                { type: 'select', label: 'Maxsulot', name: 'product', options: product?.map(p => ({ value: p.id, label: p.name })), required: true },
                { type: 'number', label: 'Miqdor', name: 'amount' },
                { type: 'number', label: 'Min miqdor', name: 'min_amount' },
                { type: 'text', label: 'Birlik', name: 'unit' },
                { type: 'number', label: 'Kelish summasi', name: 'import_price', required: true },
                { type: 'number', label: 'Sotish summasi', name: 'export_price', required: true },
                { type: 'number', label: 'Maksimal chegirma', name: 'max_discount' },
                { type: 'number', label: 'Umumiy', name: 'total', disabled: true },
            ]);
        }
    }, [productData, providerData]);



    const handleAddProviderSuccess = (newProvider) => {
        const newOption = { value: newProvider.id, label: newProvider.name };
        setProviderOptions(prevOptions => [...prevOptions, newOption]);
        setSelectedProvider(newProvider.id);
    };

    const currentDate = new Date().toLocaleDateString();

    const handleClick = () => {
        setFormSubmitted(true);
        setOpenDetail(true);

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

        // onSave(formData, file);
    };

    // const providerOptions = provider?.map(p => ({ label: p.name, value: p.id }));

    useEffect(() => {
        const initialData = formConfig?.reduce((acc, field) => {
            acc[field.name] = '';
            return acc;
        }, {});
        setFormData(initialData);
    }, [formConfig]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (typeof formData[name] === 'object' && formData[name] !== null) {
            setFormData({
                ...formData,
                [name]: { ...formData[name], value: value }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }

        setValidationErrors({ ...validationErrors, [name]: '' });
    };


    useEffect(() => {
        const calculateTotal = async () => {
            const amount = parseFloat(formData.amount) || 0;
            const importPrice = parseFloat(formData.import_price) || 0;
            const maxDiscountPercent = parseFloat(formData.max_discount) || 0;

            const discountAmount = (importPrice * amount * maxDiscountPercent) / 100;
            const total = (importPrice * amount) - discountAmount;

            setFormData(prevFormData => ({ ...prevFormData, total }));
        };
        calculateTotal();
    }, [formData.amount, formData.import_price, formData.max_discount]);



    const validateForm = () => {
        let errors = {};
        formConfig.forEach(field => {
            if (field.required && !formData[field.name]) {
                errors[field.name] = `${field.label} maydonini to'ldirish majburiy`;
            }
        });
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddProduct = () => {
        if (!isTableValid()) {
            alert('Jadvaldagi barcha kerakli maydonlarni to\'ldiring');
            return;
        }
        if (!validateForm()) {
            return;
        }
        setSelectedProducts([...selectedProducts, formData]);

        const newOverallTotal = selectedProducts.reduce((acc, product) => acc + product.total, formData.total);
        setOverallTotal(newOverallTotal);

        setFormData({});
    };

    const handlePaidAmountChange = (event) => {
        const paidAmount = parseFloat(event.target.value) || 0;
        const newDebt = overallTotal - paidAmount;
        setFormData({ ...formData, paidAmount, debt: newDebt });
    };



    const handleRemoveProduct = (index) => {
        const updatedProducts = selectedProducts.filter((_, i) => i !== index);
        setSelectedProducts(updatedProducts);

        const newOverallTotal = updatedProducts.reduce((acc, product) => acc + product.total, 0);
        setOverallTotal(newOverallTotal);

        const newDebt = newOverallTotal - (formData.paidAmount || 0);
    }

    console.log(formData)
    const handleSubmit = async () => {
        setLoading(true);
        const providerId = selectedProvider;

        const postData = selectedProducts.map(product => ({
            code: product.code,
            product: product.product.value,
            amount: product.amount,
            min_amount: product.min_amount,
            unit: product.unit,
            import_price: product.import_price,
            export_price: product.export_price,
            max_discount: product.max_discount,
            total: product.total,
            provider: providerId
        }));

        try {
            for (const productData of postData) {
                const response = await ImportProduct.postImportProduct(productData);
                if (!response) {
                    alert('Failed to post data');
                    return;
                }
            }
            alert('Data successfully posted');

            setSelectedProducts([]);
            setSelectedProvider(null)
        } catch (error) {
            alert(`Error posting data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddProduct = () => {
        setAddOpen(true);
    }


    const renderFields = () => {
        return formConfig?.map((field, index) => {
            switch (field.type) {
                case 'text':
                case 'number':
                    return (
                        <FormControl key={index} fullWidth margin="dense" size="small" error={formSubmitted && !!validationErrors[field.name]}>
                            <TextField
                                margin="dense"
                                label={field.label}
                                name={field.name}
                                type={field.type}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                disabled={field.disabled}
                                error={formSubmitted && !!validationErrors[field.name]}
                            />
                        </FormControl>
                    );
                case 'select':
                    return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FormControl key={index} fullWidth margin="dense" size="small" error={formSubmitted && !!validationErrors[field.name]}>
                                <Autocomplete
                                    size="small"
                                    options={field.options || []}
                                    getOptionLabel={(option) => option.label}
                                    value={field.options?.find(option => option.value === formData[field.name]?.value) || null}
                                    onChange={(event, newValue) => {
                                        setFormData({
                                            ...formData,
                                            [field.name]: newValue ? { value: newValue.value, label: newValue.label } : null
                                        });
                                        if (field.name === 'product') {
                                            setProductId(newValue ? newValue.value : null);
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={field.label}
                                            error={formSubmitted && !!validationErrors[field.name]}
                                        />
                                    )}
                                />
                            </FormControl>
                            <button className='add-provider-btn' onClick={handleOpenAddProduct}>+</button>
                        </div>
                    );
                default:
                    return null;
            }
        });
    };

    const isTableValid = () => {
        // Har bir mahsulot uchun ma'lumotlarni tekshirish
        return selectedProducts?.every(product =>
            product.amount && product.import_price && product.export_price
        );
    };



    return (
        <div className='import-product'>
            <SideBar />
            <main>
                <Navbar title='Kirim tovarlar' />
                <div className="extra-items">
                    {!openDetail && <div className="add-product-btn">
                        <Button onClick={handleClick} variant='outlined'>Maxsulot qo'shish</Button>
                    </div>}
                    {openDetail &&
                        <section className="order-details">
                            <div className="top-items">
                                <div className="title">Kirim buyurtma tafsilotlari</div>
                                <div className="btns">
                                    <Button
                                        variant="contained"
                                        onClick={handleSubmit}
                                        disabled={!isTableValid() || loading}
                                    >
                                        {loading ? 'Yuborilmoqda...' : 'Yuborish'}
                                    </Button>
                                </div>

                            </div>
                            <div className="main-items">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Sana</th>
                                            <th>To'langan summa</th>
                                            <th>Qarz</th>
                                            <th>Umumiy</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{currentDate}</td>
                                            <td>
                                                <TextField
                                                    margin="dense"
                                                    label="To'langan summa"
                                                    type="number"
                                                    value={formData.paidAmount || ''}
                                                    onChange={handlePaidAmountChange}
                                                    fullWidth
                                                    size="small"
                                                />
                                            </td>
                                            <td>{formData.debt}</td>
                                            <td>{overallTotal}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="provider-about">
                                    <div className="header">
                                        <div className="title">Ta'minotchi</div>
                                        <FormControl fullWidth margin="dense" size="small">
                                            <Autocomplete
                                                sx={{ minWidth: '150px' }}
                                                fullWidth
                                                size="small"
                                                disablePortal
                                                options={providerOptions || []}
                                                getOptionLabel={(option) => option.label}
                                                value={providerOptions?.find(option => option.value === selectedProvider) || null}
                                                onChange={(event, newValue) => {
                                                    setSelectedProvider(newValue ? newValue.value : '');
                                                }}
                                                renderInput={(params) => <TextField {...params} label="Ta'minotchi" />}
                                            />
                                        </FormControl>


                                        <AddProvider onSuccess={handleAddProviderSuccess} addProvider={true} />
                                    </div>
                                    <div className="provider-info">
                                        {selectedProvider && <table>
                                            <thead>
                                                <tr>
                                                    <th>Ism</th>
                                                    <th>Telefon raqam</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedProvider &&
                                                    <tr>
                                                        <td>{providerById.name}</td>
                                                        <td>{providerById.phone_number}</td>
                                                    </tr>}
                                            </tbody>
                                        </table>}
                                    </div>
                                    {selectedProvider && <div className="enter-product">
                                        <div className="title">Maxsulot qo'shish</div>
                                        <div className="header">
                                            {renderFields()}
                                            <Button className='btn' variant='contained' onClick={handleAddProduct} disabled={!isTableValid()}>Tasdiqlash</Button>
                                        </div>
                                        <div className="render-fields-table">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Artikul</th>
                                                        <th>Maxsulot</th>
                                                        <th>Miqdor</th>
                                                        <th>Min miqdor</th>
                                                        <th>Kelish summasi</th>
                                                        <th>Sotish summasi</th>
                                                        <th>Birlik</th>
                                                        <th>Chegirma</th>
                                                        <th>Umumiy</th>
                                                        <th>Holat</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedProducts?.map((product, index) => (
                                                        <tr key={index}>
                                                            <td>{product.code || ''}</td>
                                                            <td>{product.product?.label || ''}</td>
                                                            <td>{product.amount || ''}</td>
                                                            <td>{product.min_amount || ''}</td>
                                                            <td>{product.import_price || ''}</td>
                                                            <td>{product.export_price || ''}</td>
                                                            <td>{product.unit || ''}</td>
                                                            <td>{product.max_discount || ''}%</td>
                                                            <td>{product.total || ''}</td>
                                                            <td style={{ textAlign: 'center' }}>
                                                                <Button
                                                                    onClick={() => handleRemoveProduct(index)}
                                                                    variant='contained'
                                                                    color='error'
                                                                    size='small'
                                                                >
                                                                    O'chirish
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>

                                            </table>
                                        </div>
                                        <div />
                                    </div>}
                                </div>
                            </div>
                        </section>}
                </div>
            </main>
            {addOpen &&
                <AddItemModal open={addOpen} onClose={() => setAddOpen(false)}/>
            }
        </div>
    )
}

export default Import