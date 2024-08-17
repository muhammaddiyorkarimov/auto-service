import './addOrder.css';
import React, { useCallback, useState, useEffect } from 'react';
import SideBar from '../../components/sidebar/SideBar';
import Navbar from '../../components/navbar/Navbar';
import AddItemBtn from '../../components/addItemBtn/AddItemBtn';
import SelectOrder from './SelectOrder';
import useFetch from '../../hooks/useFetch';
import CustomersService from '../../services/landing/customers';
import Loader from './../../helpers/loader/Loader';
import CarsService from './../../services/landing/carsService';
import OurProduct from '../../services/landing/ourProduct';
import FormComponent from './FormComponent';
import OrderProducts from './../../services/landing/orderProduct';

function AddOrder() {
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formIsOpen, setFormIsOpen] = useState(false);
    const [orderProduct, setOrderProduct] = useState([]);
    const [formConfig, setFormConfig] = useState([]);
    const [savedData, setSavedData] = useState([]); // Mahsulotlarni vaqtincha saqlash uchun

    const toggleForm = () => {
        setFormIsOpen(prev => !prev);
    };

    const fetchCustomerById = useCallback(() => {
        if (selectedCustomerId) {
            return CustomersService.getCustomersById(selectedCustomerId);
        }
        return null;
    }, [selectedCustomerId]);

    const fetchCarsForCustomer = useCallback(() => {
        if (selectedCustomerId) {
            return CarsService.getCarsForCustomer(selectedCustomerId);
        }
        return null;
    }, [selectedCustomerId]);

    const { data: customerAbout, loading: customerLoading, error: customerError } = useFetch(fetchCustomerById);
    const { data: customerCars, loading: carsLoading, error: carsError } = useFetch(fetchCarsForCustomer);
    const { data: orderProducts, loading: orderProductsLoading, error: orderProductsError } = useFetch(OurProduct.getProduct);

    useEffect(() => {
        if (orderProducts) {
            setOrderProduct(orderProducts.results);
        }
    }, [orderProducts]);

    useEffect(() => {
        setLoading(customerLoading || carsLoading);
        setError(customerError || carsError);
    }, [customerLoading, carsLoading, customerError, carsError]);

    const handleSelectCustomer = (customerId) => {
        setSelectedCustomerId(customerId);
    };

    const handleLoadingChange = (isLoading) => {
        setLoading(isLoading);
    };

    const handleErrorChange = (errorMsg) => {
        setError(errorMsg);
    };

    const handleAddProduct = () => {
        toggleForm();
        setFormConfig([
            {
                type: 'select',
                label: 'Maxsulot',
                name: 'products',
                required: true,
                options: orderProduct?.map(p => ({ value: p.id, label: p.name }))
            },
            { type: 'number', label: 'Miqdor', name: 'amount', required: true },
            { type: 'number', label: 'Chegirma', name: 'discount', required: true },
            { type: 'number', label: 'Umumiy', name: 'total', required: true, disabled: true },
        ]);
    };

    const handleSaveProduct = (item) => {
        const newProduct = {
            amount: parseFloat(item.amount),
            discount: parseFloat(item.discount),
            total: parseFloat(item.total),
            order: selectedCustomerId,
            product: item.products,
            productName: orderProduct.find(p => p.id === item.products)?.name || ''
        };

        setSavedData(prevData => [...prevData, newProduct])
    };

    const handleSubmitOrder = async () => {
        try {
            for (const item of savedData) {
                await OrderProducts.postOrders(item); // Har bir mahsulotni serverga yuborish
            }
            console.log("Successfully submitted all products.");
        } catch (error) {
            console.error("Error submitting products:", error);
            handleErrorChange(error.message);
        }
    };

    return (
        <div className='add-order'>
            {(customerLoading || carsLoading) && <Loader />}
            <SideBar />
            <main>
                <Navbar title="Buyurtma qo'shish" />
                <div className="extra-items">
                    <div className="items">
                        <SelectOrder
                            onSelectCustomer={handleSelectCustomer}
                            onLoadingChange={handleLoadingChange}
                            onErrorChange={handleErrorChange}
                        />
                        <AddItemBtn name='Buyurtmachi' />
                    </div>
                    <section className="details">
                        {(loading) && <Loader />}
                        {error && <p>Xatolik: {error?.message}</p>}

                        {selectedCustomerId && customerAbout && !loading && (
                            <div className="customer-about">
                                <div className="title">Mijoz haqida ma'lumot</div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Ism Familiya</th>
                                            <th>Manzil</th>
                                            <th>Telefon raqam</th>
                                            {customerAbout.debt ? <th>Qarzi</th> : ''}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{customerAbout.first_name + ' ' + customerAbout.last_name}</td>
                                            <td>{customerAbout?.address}</td>
                                            <td>{customerAbout?.phone_number}</td>
                                            {customerAbout.debt ? <td>{customerAbout?.debt}</td> : ''}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {selectedCustomerId && customerCars && customerCars.length > 0 && !loading && (
                            <div className="customer-cars customer-about">
                                <div className="title">Mijozning avtomobillari</div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Kod</th>
                                            <th>Nomi</th>
                                            <th>Brend</th>
                                            <th>Rangi</th>
                                            <th>Davlat raqami</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customerCars?.map((car) => (
                                            <tr key={car.code}>
                                                <td>{car.code}</td>
                                                <td>{car.name}</td>
                                                <td>{car.brand}</td>
                                                <td>{car.color}</td>
                                                <td>{car.state_number}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {selectedCustomerId && customerAbout && !loading && (
                            <div className="order-services">
                                <div className="customer-products">
                                    <div className="header">
                                        <AddItemBtn name='Tovar qoshish' onClick={handleAddProduct} />
                                    </div>
                                    <div className={`add-form-container ${formIsOpen ? 'active' : ''}`}>
                                        {formIsOpen &&
                                            <FormComponent
                                                formConfig={formConfig}
                                                onSave={handleSaveProduct} // Formni saqlash tugmasi
                                            />
                                        }
                                    </div>

                                    {/* Jadvalga qo'shilgan mahsulotlar */}
                                    {savedData.length > 0 && (
                                        <div className="saved-products">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Maxsulot Nomi</th>
                                                        <th>Miqdor</th>
                                                        <th>Chegirma</th>
                                                        <th>Umumiy</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {savedData.map((product, index) => (
                                                        <tr key={index}>
                                                            <td>{product.productName}</td>
                                                            <td>{product.amount}</td>
                                                            <td>{product.discount}</td>
                                                            <td>{product.total}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <button onClick={handleSubmitOrder}>Yuborish</button> {/* Yuborish tugmasi */}
                                        </div>
                                    )}
                                </div>
                                <div className="customer-services">
                                    <AddItemBtn name='Xizmat qoshish' />
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

export default AddOrder;
