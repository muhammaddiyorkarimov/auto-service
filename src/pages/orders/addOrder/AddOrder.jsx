import './addOrder.css';
import SideBar from '../../../components/sidebar/SideBar';
import Navbar from '../../../components/navbar/Navbar';
import { useCallback, useEffect, useState } from 'react';
import AddItemBtn from '../../../components/addItemBtn/AddItemBtn';
import useFetch from '../../../hooks/useFetch';
import CustomersService from '../../../services/landing/customers';
import CarsService from '../../../services/landing/carsService';
import { TextField, Button } from '@mui/material';
import FormData from './FormData';
import OrderProduct from './OrderProduct';
import OrderingService from './OrderService';
import OrdersService from '../../../services/landing/orders';
import OrderProducts from '../../../services/landing/orderProduct';
import OrderServices from './../../../services/landing/orderService';
import { useNavigate } from 'react-router-dom';

function AddOrder() {
    const [formConfig, setFormConfig] = useState([]);
    const [createOpen, setCreateOpen] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [customerCars, setCustomerCars] = useState([]);
    const [allCars, setAllCars] = useState([]);
    const [formData, setFormData] = useState({})
    const [total, setTotal] = useState(0);
    const [paid, setPaid] = useState(0);
    const [debt, setDebt] = useState(0);
    const [totalProduct, setTotalProduct] = useState(0);
    const [totalService, setTotalService] = useState(0);
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [orderFormProducts, setOrderFormProducts] = useState([])
    const [orderFormServices, setOrderFormServices] = useState([])

    const navigate = useNavigate();


    const fetchCarsForCustomer = useCallback(() => {
        if (selectedCustomerId) {
            return CarsService.getCarsForCustomer(selectedCustomerId);
        }
    }, [selectedCustomerId]);

    const { data: customer } = useFetch(CustomersService.getCustomers);
    const { data: customerCar } = useFetch(fetchCarsForCustomer);
    const { data: allCar } = useFetch(CarsService.getCars);

    useEffect(() => {
        if (customer) {
            setCustomers(customer.results);
        }
        if (allCar) {
            setAllCars(allCar.results);
        }
    }, [customer, customerCar, selectedCustomerId, allCar]);
    useEffect(() => {
        if (selectedCustomerId && Array.isArray(customerCar)) {
            const mappedCars = customerCar.map((car) => ({
                value: car.id,
                label: car.name,
            }));
            setCustomerCars(mappedCars);
    
            setFormConfig((prevConfig) =>
                prevConfig.map((configItem) =>
                    configItem.name === 'car'
                        ? { ...configItem, options: mappedCars }
                        : configItem
                )
            );
        } else {
            setCustomerCars([]);
    
            setFormConfig((prevConfig) =>
                prevConfig.map((configItem) =>
                    configItem.name === 'car'
                        ? { ...configItem, options: [] }
                        : configItem
                )
            );
        }
    }, [selectedCustomerId, customerCar]);
    

    console.log(customerCars)


    const handleCreateOpen = () => {
        setCreateOpen(true);
        setFormConfig([
            {
                type: 'select',
                label: 'Mijoz',
                name: 'customer',
                required: true,
                options: customers?.map((p) => ({ value: p.id, label: p.first_name })),
                renderButton: () => (
                    <button className='add-itemBtn' onClick={() => `console`.log('Tugma bosildi')}>+</button>
                ),
            },
            {
                type: 'select',
                label: 'Mashina',
                name: 'car',
                required: true,
                options: customerCars.length > 0 ? customerCars : [],
                renderButton: () => (
                    <button className='add-itemBtn' onClick={() => console.log('Mashina qo\'shish tugmasi bosildi')}>+</button>
                ),
            },
            
            { type: 'number', label: 'Yurgan masofasi', name: 'car_kilometers' },
            { type: 'text', label: 'Tavsif', name: 'description' },
        ]);
    };

    const handleAddProductTotal = (total) => {
        setTotalProduct(total);
    };

    const handleAddServiceTotal = (total) => {
        setTotalService(total);
    };

    useEffect(() => {
        setDebt((totalProduct + totalService) - paid);
        setTotal(totalProduct + totalService)
    }, [totalProduct, totalService, paid]);


    const handleAddToTable = (formData) => {
        setFormData(formData)
    };

    const onCustomerChange = (id) => {
        setSelectedCustomerId(id);
    };

    const currentDate = new Date().toLocaleDateString();

    const handlePaidChange = (e) => {
        const newPaid = e.target.value;
        setPaid(newPaid);
    };



    const handleSubmit = async () => {
        setLoading(true);
        const postData = {
            car: formData.car,
            total: total,
            paid: parseInt(paid),
            debt: debt,
            car_kilometers: formData.car_kilometers || 0,
            customer: formData.customer,
            description: formData.description
        };

        const postOrderProduct = orderFormProducts?.map(product => ({
            order: null,
            amount: product.amount,
            product: product.product,
            discount: product.discount,
            total: product.total,
        }));

        const postOrderService = orderFormServices?.map(service => ({
            order: null,
            part: service.part,
            service: service.service,
            staff: service.staff,
            total: service.total,
        }));

        try {
            const orderResponse = await OrdersService.postOrders(postData);
            const orderId = orderResponse?.id;

            if (!orderId) {
                alert("Order yaratishda xatolik yuz berdi.");
                setLoading(false);
                return;
            }

            const postOrderProductWithId = postOrderProduct?.map(product => ({
                ...product,
                order: orderId
            }));

            for (const productData of postOrderProductWithId) {
                const response = await OrderProducts.postOrders(productData);
                if (!response) {
                    alert("OrderProduct ma'lumotlarini yuborishda xatolik yuz berdi.");
                    setLoading(false);
                    return;
                }
            }

            const postOrderServiceWithId = postOrderService?.map(service => ({
                ...service,
                order: orderId
            }));

            for (const serviceData of postOrderServiceWithId) {
                const response = await OrderServices.postOrders(serviceData);
                if (!response) {
                    alert("OrderProduct ma'lumotlarini yuborishda xatolik yuz berdi.");
                    setLoading(false);
                    return;
                }
            }

            alert("Buyurtma muvaffaqiyatli qo'shildi.");
            navigate(`/orders/${orderId}`); // Navigate qilish
        } catch (error) {
            alert(`Ma'lumotlarni yuborishda xatolik yuz berdi: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className='adding-order'>
            <SideBar />
            <main>
                <Navbar title='Buyurtma yaratish' />
                <div className="extra-items">
                    <div className="create-btn">
                        {!createOpen && <AddItemBtn name='Buyurtma yaratish' onClick={handleCreateOpen} />}
                    </div>
                    {createOpen &&
                        <section className="information">
                            <div className="created-about">
                                <div className="header">
                                    <div className="title">Buyurtma tafsilotlari</div>
                                    <Button onClick={handleSubmit} variant='contained'>{loading ? 'Yuborilmoqda...' : 'Yuborish'}</Button>
                                </div>
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
                                            <td>
                                                <TextField
                                                    type="number"
                                                    id="standard-basic"
                                                    variant="standard"
                                                    value={paid}
                                                    onChange={handlePaidChange}
                                                />
                                            </td>
                                            <td>{debt}</td>
                                            <td>{total}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="created-order">
                                <FormData
                                    formConfig={formConfig}
                                    onSave={handleAddToTable}
                                    onCustomerIdChange={onCustomerChange}
                                />
                            </div>
                            {Object.keys(formData).length !== 0 && <>
                                <div className="created-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Mijoz</th>
                                                <th>Mashina</th>
                                                <th>Yurgan masofasi</th>
                                                <th>Tavsif</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{formData.customerName}</td>
                                                <td>{formData.carName}</td>
                                                <td>{formData.car_kilometers}</td>
                                                <td>{formData.description}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="order-wrapper">
                                    <OrderProduct onTotalChange={handleAddProductTotal} onSave={setOrderFormProducts} />
                                    <OrderingService onTotalChange={handleAddServiceTotal} onSave={setOrderFormServices} />
                                </div>
                            </>}
                        </section>
                    }
                </div>
            </main>
        </div>
    );
}

export default AddOrder;
