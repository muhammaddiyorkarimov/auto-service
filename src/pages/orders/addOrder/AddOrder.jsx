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
import AddCustomerModal from './AddCustomerModal';
import AddCustomerCarModal from './AddCustomerCarModal';
import Loader from '../../../helpers/loader/Loader';

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
    const [loading, setLoading] = useState(true);
    const [orderId, setOrderId] = useState(null);
    const [orderFormProducts, setOrderFormProducts] = useState([])
    const [orderFormServices, setOrderFormServices] = useState([])
    const [openCustomerModal, setOpenCustomerModal] = useState(false);
    const [openCarsModal, setOpenCarsModal] = useState(false);

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


    const handleOpenCustomer = () => {
        setOpenCustomerModal(true)
    }

    const handleOpenCustomerCar = () => {
        setOpenCarsModal(true)
    }

    useEffect(() => {
        if (customers && customerCars) {
            setLoading(false);
        }
    }, [customer, allCar]);


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
                    <button className='add-itemBtn' onClick={handleOpenCustomer}>+</button>
                ),
            },
            {
                type: 'select',
                label: 'Mashina',
                name: 'car',
                required: true,
                options: customerCars.length > 0 ? customerCars : [],
                renderButton: () => (
                    <button className='add-itemBtn' onClick={handleOpenCustomerCar}>+</button>
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
        let inputValue = e.target.value;

        // Remove existing spaces from the input value
        const plainNumber = inputValue.replace(/\s/g, '');

        // Check if it's a valid number
        if (/^\d*$/.test(plainNumber)) {
            const formattedValue = formatNumberWithCommas(plainNumber);

            // Convert plainNumber to number type before saving to state
            setPaid(Number(plainNumber)); // now storing as number type

            // Set the formatted value in the input (for display purposes)
            e.target.value = formattedValue;
        }
    };


    const handleAddCustomerSuccess = (newCustomer) => {
        const newOption = { value: newCustomer.id, label: newCustomer.first_name };

        // Yangi mijozni ro'yxatga qo'shish
        setCustomers(prevOptions => [...prevOptions, newOption]);

        // Tanlangan mijozni ID sini o'rnatish
        setSelectedCustomerId(newCustomer.id);

        // Formani qayta render qilish va yangi tanlangan mijozni inputga joylash
        setFormConfig(prevConfig =>
            prevConfig.map(configItem =>
                configItem.name === 'customer'
                    ? { ...configItem, options: [...customers, newOption], value: newCustomer.id }
                    : configItem
            )
        );
    };
    const handleAddCarsSuccess = (newCar) => {
        const newOption = { value: newCar.id, label: newCar.name };
        setCustomerCars(prevOptions => {
            const updatedCars = [newOption, ...prevOptions];

            setFormConfig(prevConfig =>
                prevConfig.map(configItem =>
                    configItem.name === 'car'
                        ? { ...configItem, options: updatedCars, value: newCar.id }
                        : configItem
                )
            );

            return updatedCars;
        });
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

    function formatNumberWithCommas(number) {
        return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    return (
        <div className='adding-order'>
            <SideBar />
            <main>
                <Navbar title='Buyurtma yaratish' />
                <div className="extra-items">
                    {loading ? <Loader /> : <>
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
                                                        type="text"
                                                        id="standard-basic"
                                                        variant="standard"
                                                        value={formatNumberWithCommas(paid)}
                                                        onChange={handlePaidChange}
                                                    />
                                                </td>
                                                <td>{formatNumberWithCommas(debt)}</td>
                                                <td>{formatNumberWithCommas(total)}</td>
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
                    </>}
                </div>
            </main>

            {openCustomerModal &&
                <AddCustomerModal
                    onSuccess={handleAddCustomerSuccess}
                    open={openCustomerModal}
                    onClose={() => setOpenCustomerModal(false)}
                />}
            {openCarsModal &&
                <AddCustomerCarModal
                    open={openCarsModal}
                    onClose={() => setOpenCarsModal(false)}
                    selectedCustomerId={selectedCustomerId}
                    onSuccess={handleAddCarsSuccess}
                />
            }
        </div>
    );
}

export default AddOrder;
