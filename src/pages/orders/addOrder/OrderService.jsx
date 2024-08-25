import React, { useCallback, useEffect, useState } from 'react';
import AddItemBtn from '../../../components/addItemBtn/AddItemBtn';
import useFetch from '../../../hooks/useFetch';
import FormData from './FormData';
import AutoServices from './../../../services/landing/autoService';
import EmployeesService from './../../../services/landing/employees';

function OrderingService({onTotalChange, onSave }) {
    const [formConfig, setFormConfig] = useState([]);
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState([]);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [price, setPrice] = useState(0);

    const fetchService = useCallback(() => {
        if (selectedServiceId) {
            return AutoServices.getAutoServiceById(selectedServiceId);
        }
    }, [selectedServiceId]);

    const { data: service } = useFetch(AutoServices.getAutoService);
    const { data: serviceById } = useFetch(fetchService);
    const { data: staffData} = useFetch(EmployeesService.getEmployees) 

    useEffect(() => {
        if (service) {
            setServices(service);
        }
    }, [service]);

    useEffect(() => {
        if (serviceById) {
            setPrice(serviceById.price);
        }
    }, [serviceById]);

    useEffect(() => {
        const totalSum = formData.reduce((acc, product) => acc + product.total, 0);
        onTotalChange(totalSum);
    }, [formData, onTotalChange]);

    const handleAddService = () => {
        setFormConfig([
            { type: 'select', label: 'Xodim', name: 'staff', options: staffData?.map(p => ({
                value: p.id,
                label: p.last_name ? `${p.first_name} ${p.last_name}` : `Ismsiz`
              }))
              , required: true },
            { type: 'select', label: 'Xizmat', name: 'service', options: services?.map(p => ({ value: p.id, label: p.name })), required: true },
            { type: 'number', label: 'Part', name: 'part', required: true },
            { type: 'number', label: 'Umumiy', name: 'total', required: true, disabled: true },
        ]);
    };

    const handleSave = (data) => {
        setFormData(prevData => {
            const updatedData = [...prevData, { ...data }];
            onSave(updatedData)
            return updatedData;
        });
        setFormConfig([]);
        setSelectedServiceId(null);
        setPrice(0);
    };

    const onServiceChange = (id) => {
        setSelectedServiceId(id);
    };

    return (
        <div className='order-service'>
            <div className="header">
                <AddItemBtn name='Xizmat qoshish' onClick={handleAddService} />
            </div>
            <div className="order-product-content">
                <FormData
                    formConfig={formConfig}
                    onSave={handleSave}
                    onServiceIdChange={onServiceChange}
                    price={price}
                />

                <table>
                    <thead>
                        <tr>
                            <th>Xizmat</th>
                            <th>Xodim</th>
                            <th>part</th>
                            <th>Umumiy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.serviceName}</td>
                                <td>{item.staffName}</td>
                                <td>{item.part}</td>
                                <td>{item.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OrderingService;
