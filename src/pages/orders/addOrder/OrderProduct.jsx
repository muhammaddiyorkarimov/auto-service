import React, { useCallback, useEffect, useState } from 'react'
import AddItemBtn from '../../../components/addItemBtn/AddItemBtn'
import useFetch from '../../../hooks/useFetch'
import OurProduct from '../../../services/landing/ourProduct'
import FormData from './FormData'
import OrderProducts from '../../../services/landing/orderProduct'

function OrderProduct({ selectedCustomerId, onTotalChange }) {
    const [formConfig, setFormConfig] = useState([])
    const [products, setProducts] = useState([])
    const [formData, setFormData] = useState([])
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [price, setPrice] = useState(0);
    const [customerId, setCustomerId] = useState(null);

    useEffect(() => {
        setCustomerId(selectedCustomerId);
    }, [selectedCustomerId]);

    const fetchProduct = useCallback(() => {
        if (selectedProductId) {
            return OurProduct.getProductById(selectedProductId);
        }
    }, [selectedProductId]);

    const { data: product } = useFetch(OurProduct.getProduct)
    const { data: productById } = useFetch(fetchProduct)

    useEffect(() => {
        if (product) {
            setProducts(product.results)
        }
    }, [product])

    useEffect(() => {
        const totalSum = formData.reduce((acc, product) => acc + product.total, 0);
        onTotalChange(totalSum);
    }, [formData, onTotalChange]);

    useEffect(() => {
        if (productById) {
            console.log(productById)
            setPrice(productById.export_price);
        }
    }, [productById]);

    const handleSave = (data) => {
        setFormData(prevData => [...prevData, { ...data }]);
        setFormConfig([]);
        setSelectedProductId(null);
        setPrice(0);
    };

    const handleAddProduct = () => {
        setFormConfig([
            { type: 'select', label: 'Maxsulot', name: 'product', options: products?.map(p => ({ label: p.name, value: p.id })), required: true },
            { type: 'number', label: 'Miqdor', name: 'amount', required: true },
            { type: 'number', label: 'Chegirma', name: 'discount', required: true },
            { type: 'number', label: 'Umumiy', name: 'total', required: true, disabled: true },
        ]);
    }

    const onProductChange = (id) => {
        console.log(id)
        setSelectedProductId(id);
    };

    console.log(formData);

    const handleSubmit = async () => {
        const postData = formData.map(product => ({
            order: orderId,
            amount: product.amount,
            product: product.product,
            discount: product.discount,
            total: product.total,
        }));

        try {
            for (const productData of postData) {
                const response = await OrderProducts.postOrders(productData);
                if (!response) {
                    alert('Failed to post data');
                    return;
                }
            }
            alert('Data successfully posted');
        } catch (error) {
            alert(`Error posting data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='order-product'>
            <div className="header">
                <AddItemBtn name='Maxsulot qoshish' onClick={handleAddProduct} />
            </div>
            <div className="order-product-content">
                <FormData formConfig={formConfig} onSave={handleSave} onProductIdChange={onProductChange} productPrice={price} />
                <table>
                    <thead>
                        <tr>
                            <th>Maxsulot</th>
                            <th>Miqdor</th>
                            <th>Chegirma</th>
                            <th>Umumiy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData?.map(product => (
                            <tr key={product.product}>
                                <td>{product.productName}</td>
                                <td>{product.amount}</td>
                                <td>{product.discount}</td>
                                <td>{product.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderProduct