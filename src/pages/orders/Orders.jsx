import './orders.css'
import SideBar from './../../components/sidebar/SideBar';
import Navbar from '../../components/navbar/Navbar';
import DataTable from '../../components/dataTable/DataTable';
import { tableHeaders } from '../../components/details/Details';
import useFetch from '../../hooks/useFetch';
import OrdersSerivce from './../../services/landing/orders';
import { useState } from 'react';
import AddItemBtn from '../../components/addItemBtn/AddItemBtn';
import CustomerService from './../../services/landing/customers';
import AddItemModal from '../../components/addItemModal/AddItemModal';
import { Alert, Snackbar } from '@mui/material';
import DetailsModal from '../../components/detailView/DetailView';

function Orders() {
    // table head
    const headers = tableHeaders['orders']
    // data
    const { data, loading, error } = useFetch(OrdersSerivce.getOrders)
    const { data: customersData, loading: customersLoading, error: customersError } = useFetch(CustomerService.getCustomers)
    console.log(customersData)
    // for saved
    const [orders, setOrders] = useState([])
    const [formConfig, setFormConfig] = useState([])
    const [currentItem, setCurrentItem] = useState(null);
    // open
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false)
    const [addOpen, setAddOpen] = useState(false)
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    // message
    const [orderName, setOrderName] = useState('')
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // detail view  
    const handleRowClick = (item) => {
        setSelectedItem(item);
        setDetailsOpen(true);
    };

    // handle add
    const handleAdd = () => {
        setFormConfig([
            // { type: 'number', label: 'Export Narxi', name: 'export_price', required: true },
            { type: 'number', label: "To'langan", name: 'paid', required: true },
            { type: 'number', label: 'Qarz', name: 'debt', required: true },
            { type: 'select', label: 'Xaridor', name: 'customer', options: customersData?.map(c => ({ value: c.id, label: (c.first_name + ' ' + c.last_name) })), required: true },
            { type: 'number', label: 'Umumiy', name: 'total', required: true },
        ])
        setAddOpen(true)
    }

    const createProduct = async (item) => {
        try {
            const newOrder = await OrdersSerivce.postOrders(item)
            setOrders([...orders, newOrder])
            setSuccessMsg('Muvaffaqiyatli qo\'shildi')
            setSnackbarOpen(true)
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        } catch (error) {
            setErrorMsg(error.message || "Mahsulotni qo'shishda xatolik yuz berdi!")
            setSnackbarOpen(true)
        } finally {
            setAddOpen(false)
        }
    }

    const handleEdit = async (item) => {
        setFormConfig([
            // { type: 'number', label: 'Export Narxi', name: 'export_price' },
            { type: 'number', label: "To'langan", name: 'paid' },
            { type: 'number', label: 'Qarz', name: 'debt' },
            { type: 'text', label: 'Xaridor', name: 'customer' },
            { type: 'number', label: 'Umumiy', name: 'total' },
        ])
        setEditOpen(true)
    }

    const formattedData = data && data.map((item, index) => ({
        ...item,
        row: (
            <>
                <td>{index + 1}</td>
                {/* <td>{item.export_price}</td> */}
                <td>{item.paid}%</td>
                <td>{item.debt}</td>
                <td>{item.customer ? item.customer.first_name + ' ' + item.customer.last_name : '0'}</td>
                <td>{item.total}</td>
            </>
        )
    }))

    return (
        <div className="orders">
            <SideBar />
            <main>
                <Navbar title="Buyurtmalar" name="Muhammaddiyor" adminType="Super admin" />
                <div className="extra-items">
                    <div className="header-items">
                        <div className="header-items-add">
                            <AddItemBtn name="Buyurtma qo'shish" onClick={handleAdd} />
                        </div>
                    </div>
                    <section className="details-wrapper">
                        <DataTable
                            loading={loading}
                            tableHead={headers}
                            data={formattedData}
                            onEdit={handleEdit}
                            onRowClick={handleRowClick}
                        />
                    </section>
                </div>
            </main>

            {/* add item */}
            {addOpen &&
                <AddItemModal
                    open={addOpen}
                    onClose={() => setAddOpen(false)}
                    formConfig={formConfig}
                    onSave={createProduct}
                />}
            {/* edit item */}
            {/* delete item */}

            {/* snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={successMsg ? "success" : "error"} sx={{ width: '100%' }}>
                    {successMsg || errorMsg}
                </Alert>
            </Snackbar>

            {/* details open */}
            {detailsOpen &&
                <DetailsModal
                    open={detailsOpen}
                    onClose={() => setDetailsOpen(false)}
                    data={selectedItem}
                    onEdit={handleEdit}
                    // onDelete={handleDelete}
                />}
        </div>
    )
}

export default Orders