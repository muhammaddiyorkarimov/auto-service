import { Autocomplete, TextField } from '@mui/material';
import useFetch from '../../hooks/useFetch';
import CustomersService from '../../services/landing/customers';
import { useEffect, useState } from 'react';

function SelectOrder({ onSelectCustomer, onLoadingChange, onErrorChange }) {
    const [customerData, setCustomerData] = useState([]);
    const { data, loading, error } = useFetch(CustomersService.getCustomers);

    useEffect(() => {
        if (onLoadingChange) {
            onLoadingChange(loading);
        }
    }, [loading, onLoadingChange]);

    useEffect(() => {
        if (onErrorChange) {
            onErrorChange(error);
        }
    }, [error, onErrorChange]);

    useEffect(() => {
        if (data) {
            const formattedData = data.results?.map(customer => ({
                label: `${customer.first_name} ${customer.last_name}`,
                value: customer.id
            }));
            setCustomerData(formattedData);
        }
    }, [data]);

    return (
        <div className='select-order'>
            <Autocomplete
                sx={{minWidth: '200px'}}
                size='small'
                options={customerData}
                getOptionLabel={(option) => option.label}
                onChange={(event, newValue) => {
                    onSelectCustomer(newValue ? newValue.value : null);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Mijozni tanlang"
                    />
                )}
            />
        </div>
    );
}

export default SelectOrder;
