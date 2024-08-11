import './orders.css';
import { useEffect, useState, useCallback } from 'react';
import SideBar from './../../components/sidebar/SideBar';
import Navbar from '../../components/navbar/Navbar';
import DataTable from '../../components/dataTable/DataTable';
import { tableHeaders } from '../../components/details/Details';
import useFetch from '../../hooks/useFetch';
import OrdersSerivce from './../../services/landing/orders';
import AddItemBtn from '../../components/addItemBtn/AddItemBtn';
import CustomerService from './../../services/landing/customers';
import AddItemModal from '../../components/addItemModal/AddItemModal';
import { Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteProduct from '../../components/deleteProduct/DeleteProduct';
import EditItem from '../../components/editItem/EditItem';
import useQueryParams from './../../helpers/useQueryParams';
import CustomPagination from '../../helpers/CustomPagination';

function Orders() {
    const navigate = useNavigate();
    const headers = tableHeaders['orders'];

    const [orders, setOrders] = useState([]);
    const [formConfig, setFormConfig] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const [params, setQueryParams] = useQueryParams();
    const [page, setPage] = useState(Number(params.get('page')) || 1);
    const [pageSize] = useState(10);

    const fetchOrders = useCallback(() => {
        return OrdersSerivce.getOrders(page, pageSize);
    }, [page, pageSize]);

    const { data, loading, error } = useFetch(fetchOrders);
    const { data: customersData, loading: customersLoading, error: customersError } = useFetch(CustomerService.getCustomers);

    const handlePageChange = (event, value) => {
        setPage(value);
        setQueryParams({ page: value });
    };

    useEffect(() => {
        if (params.get('page') !== page.toString()) {
            setQueryParams({ page });
        }
    }, [page, params, setQueryParams]);

    const handleRowClick = (item) => {
        navigate(`/orders/${item.id}`);
    };

    const handleAdd = () => {
        setFormConfig([
            { type: 'number', label: "To'langan", name: 'paid', required: true },
            { type: 'number', label: 'Qarz', name: 'debt', required: true },
            { type: 'select', label: 'Xaridor', name: 'customer', options: customersData?.results?.map(c => ({ value: c.id, label: (c.first_name + ' ' + c.last_name) })), required: true },
            { type: 'number', label: 'Umumiy', name: 'total', required: true },
        ]);
        setAddOpen(true);
    };

    const createProduct = async (item) => {
        try {
            const newOrder = await OrdersSerivce.postOrders(item);
            setOrders([...orders, newOrder]);
            setSuccessMsg("Muvaffaqiyatli qo'shildi");
            setSnackbarOpen(true);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            setErrorMsg(error.message || "Mahsulotni qo'shishda xatolik yuz berdi!");
            setSnackbarOpen(true);
        } finally {
            setAddOpen(false);
        }
    };

    const handleEdit = (item) => {
        setCurrentItem(item);
        setFormConfig([
            { type: 'number', label: "To'langan", name: 'paid', value: item.paid },
            { type: 'number', label: 'Qarz', name: 'debt', value: item.debt },
            { type: 'select', label: 'Xaridor', name: 'customer', value: item.customer.id, options: customersData?.map(c => ({ value: c.id, label: (c.first_name + ' ' + c.last_name) })) },
            { type: 'number', label: 'Umumiy', name: 'total', value: item.total },
        ]);
        setEditOpen(true);
    };

    const updateProduct = async (updatedData) => {
        const formattedData = {
            total: updatedData.total,
            paid: updatedData.paid,
            debt: updatedData.debt,
            customer: updatedData.customer.id
        };

        try {
            const updatedOrder = await OrdersSerivce.putOrdersById(currentItem.id, formattedData);
            setOrders(orders.map(o => o.id === currentItem.id ? updatedOrder : o));
            setSuccessMsg('Mahsulot muvaffaqiyatli yangilandi!');
            setSnackbarOpen(true);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.log(error);
            setErrorMsg(error.message || "Mahsulotni yangilashda xatolik yuz berdi!");
            setSnackbarOpen(true);
        } finally {
            setEditOpen(false);
        }
    };

    const handleDelete = (item) => {
        setCurrentItem(item.id);
        setDeleteOpen(true);
    };

    const handleDeleteConfirm = async (item) => {
        try {
            await OrdersSerivce.deleteOrders(currentItem);
            setOrders(orders.filter(o => o.id !== currentItem));
            setSuccessMsg('Mahsulot muvaffaqiyatli o\'chirildi!');
            setSnackbarOpen(true);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            setErrorMsg(error.message || 'Mahsulotni o\'chirishda xatolik yuz berdi!');
            setSnackbarOpen(true);
        } finally {
            setDeleteOpen(false);
        }
    };

    const formattedData = data?.results?.map((item, index) => ({
        ...item,
        row: (
            <>
                <td>{index + 1}</td>
                <td>{item.paid}</td>
                <td>{item.debt}</td>
                <td>{item.customer ? item.customer.first_name + ' ' + item.customer.last_name : '0'}</td>
                <td>{item.total}</td>
            </>
        )
    }));


    return (
        <div className="orders">
            <SideBar />
            <main>
                <Navbar title="Buyurtmalar" name="Muhammaddiyor" adminType="Super admin" />
                <div className="extra-items">
                    <div className="header-items">
                        <AddItemBtn name="Buyurtma qo'shish" onClick={handleAdd} />
                    </div>
                    <section className="details-wrapper">
                        <DataTable
                        error={error}
                            loading={loading}
                            tableHead={headers}
                            data={formattedData}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onRowClick={handleRowClick}
                        />
                    </section>
                    <CustomPagination
                        count={Math.ceil(data?.count / pageSize)}
                        page={page}
                        onChange={handlePageChange}
                    />
                </div>
            </main>

            {addOpen &&
                <AddItemModal
                    open={addOpen}
                    onClose={() => setAddOpen(false)}
                    formConfig={formConfig}
                    onSave={createProduct}
                />}
            {editOpen &&
                <EditItem
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    formConfig={formConfig}
                    onSave={updateProduct}
                    initialData={currentItem}
                />}
            {deleteOpen &&
                <DeleteProduct
                    open={deleteOpen}
                    onClose={() => setDeleteOpen(false)}
                    onConfirm={handleDeleteConfirm}
                />}

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
        </div>
    );
}

export default Orders;
