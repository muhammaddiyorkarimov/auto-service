import React, { useCallback, useEffect, useState } from 'react';
import AddItemBtn from '../../../components/addItemBtn/AddItemBtn';
import useFetch from '../../../hooks/useFetch';
import OurProduct from '../../../services/landing/ourProduct';
import FormData from './FormData';
import OrderProducts from '../../../services/landing/orderProduct';

function OrderProduct({ onTotalChange, orderId, onSave }) {
    const [formConfig, setFormConfig] = useState([]);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState([]);
    const [ selectedProductId, setSelectedProductId] = useState(null);
    const [price, setPrice] = useState(0);
    const [amountProduct, setAmountProduct] = useState(0);

    const fetchProduct = useCallback(() => {
        if (selectedProductId) {
            return OurProduct.getProductById(selectedProductId);
        }
    }, [selectedProductId]);

    const { data: product } = useFetch(OurProduct.getProduct);
    const { data: productById } = useFetch(fetchProduct);

    useEffect(() => {
        if (product) {
            setProducts(product.results);
        }
    }, [product]);

    useEffect(() => {
        const totalSum = formData.reduce((acc, product) => acc + product.total, 0);
        onTotalChange(totalSum);
    }, [formData, onTotalChange]);

    useEffect(() => {
        if (productById) {
            setPrice(productById.export_price);
        }
    }, [productById]);
    useEffect(() => {
        if (productById) {
            setAmountProduct(productById.amount);
        }
    }, [productById]);

    const handleSave = (data) => {
        setFormData(prevData => {
            const updatedData = [...prevData, { ...data }];
            onSave(updatedData);
            return updatedData;
        });
        setFormConfig([]);
        setSelectedProductId(null);
        setPrice(0);
        setAmountProduct(0);
    };

    const handleAddProduct = () => {
        setFormConfig([
            { type: 'select', label: 'Maxsulot', name: 'product', options: products?.map(p => ({ label: p.name, value: p.id })), required: true },
            { type: 'number', label: 'Miqdor', name: 'amount', required: true },
            { type: 'number', label: 'Chegirma', name: 'discount', required: true },
            { type: 'number', label: 'Umumiy', name: 'total', required: true, disabled: true },
        ]);
    };

    const onProductChange = (id) => {
        setSelectedProductId(id);
    };

    const handleSubmit = async () => {
        if (!orderId) {
            alert('Order ID not set');
            return;
        }

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
            // If you have a loading state, set it to false here
        }
    };

    return (
        <div className='order-product'>
            <div className="header">
                <AddItemBtn name='Maxsulot qoshish' onClick={handleAddProduct} />
            </div>
            <div className="order-product-content">
                <FormData formConfig={formConfig} onSave={handleSave} onProductIdChange={onProductChange} productPrice={price} productAmount={amountProduct} />
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
    );
}

export default OrderProduct;
