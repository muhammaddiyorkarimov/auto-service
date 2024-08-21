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
import { Autocomplete, Button, FormControl, TextField } from '@mui/material';

function AddOrder() {
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [selectedCarId, setSelectedCarId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formIsOpen, setFormIsOpen] = useState(false);
    const [orderProduct, setOrderProduct] = useState([]);
    const [formConfig, setFormConfig] = useState([]);
    const [savedData, setSavedData] = useState([]);
    const [orderItems, setOrderItems] = useState([]);

    const toggleForm = () => {
        setFormIsOpen(prev => !prev);
    };

    const currentDate = new Date().toLocaleDateString();

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

    const handleAddOrder = () => {
        setFormConfig([
            { type: 'number', label: 'To\'langan', name: 'paid', required: true },
            { type: 'number', label: 'Qarz', name: 'debt', required: true },
            { type: 'number', label: 'Yurgan masofasi', name: 'car_kilometers', required: true },
            { type: 'number', label: 'Umumiy', name: 'total', required: true, disabled: true },
        ]);
    }



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

    const handleDeleteItem = (id) => {
        setOrderProduct(orderProduct?.filter(item => item.id !== id))
    }

    const handleCheckboxChange = (carId) => {
        setSelectedCarId(carId);
    };



    return (
        <div className='add-order'>
            {(customerLoading || carsLoading) && <Loader />}
            <SideBar />
            <main>
                <Navbar title="Buyurtma qo'shish" />
                <div className="extra-items">
                    <section className="details">
                        {(loading) && <Loader />}
                        {error && <p>Xatolik: {error?.message}</p>}
                        <div className="created-about">
                            <div className="title">Buyurtma tafsilotlari</div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Yaratilgan sana</th>
                                        <th>To'langan summa</th>
                                        <th>Qarz</th>
                                        <th>Umumiy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{currentDate}</td>
                                        <td>200 000</td>
                                        <td>100 000</td>
                                        <td>300 000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="by-order">
                            <div className='header'>
                                <div className="title">Buyurtmachi</div>
                                <div className="items">
                                    <SelectOrder
                                        onSelectCustomer={handleSelectCustomer}
                                        onLoadingChange={handleLoadingChange}
                                        onErrorChange={handleErrorChange}
                                    />
                                    <AddItemBtn name='Buyurtmachi' />
                                </div>
                            </div>
                            {selectedCustomerId && customerAbout && !loading && (
                                <div className="customer-about">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th colSpan={3}>Mijoz haqida ma'lumot</th>
                                            </tr>
                                            <tr>
                                                <th>Ism Familiya</th>
                                                <th>Telefon raqam</th>
                                                <th>Qarzi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{customerAbout.first_name + ' ' + customerAbout.last_name}</td>
                                                <td>{customerAbout?.phone_number}</td>
                                                {customerAbout.debt ? <td>{customerAbout?.debt}</td> : ''}
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th colSpan={5}>Mijozning avtomobillari</th>
                                            </tr>
                                            <tr>
                                                <th>Artikul</th>
                                                <th>Name</th>
                                                <th>Brand</th>
                                                <th>Davlat raqami</th>
                                                <th>Xizmat</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {customerCars?.length > 0 ? customerCars?.map((car) => (
                                                <tr key={car.id}>
                                                    {console.log(car)}
                                                    <td>{car.code}</td>
                                                    <td>{car.name}</td>
                                                    <td>{car.brand}</td>
                                                    <td>{car.state_number}</td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            onChange={() => handleCheckboxChange(car.id)}
                                                        />
                                                    </td>
                                                </tr>
                                            )) : <tr>
                                                <td colSpan={5}>Tanlangan mijozning mashinasi mavjud emas</td>
                                            </tr>}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

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
                                                onSave={handleSaveProduct}
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
                                                        <th>Holat</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {savedData.map((product, index) => (
                                                        <>
                                                            <tr key={index}>
                                                                {console.log(savedData)}
                                                                <td>{product.productName}</td>
                                                                <td>{product.amount}</td>
                                                                <td>{product.discount}</td>
                                                                <td>{product.total}</td>
                                                                <td style={{ textAlign: 'center' }} >
                                                                    <Button variant='contained'
                                                                        color='error'
                                                                        size='small' onClick={() => handleDeleteItem(product.id)}>O'chirish</Button>
                                                                </td>
                                                            </tr>
                                                        </>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <Button variant='outlined'>Yuborish</Button>
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
