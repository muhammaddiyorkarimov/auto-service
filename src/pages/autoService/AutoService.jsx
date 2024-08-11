import './autoService.css'
import AddItemBtn from '../../components/addItemBtn/AddItemBtn'
import DataTable from '../../components/dataTable/DataTable'
import Navbar from '../../components/navbar/Navbar'
import SideBar from '../../components/sidebar/SideBar'
import useFetch from '../../hooks/useFetch'
import { tableHeaders } from '../../components/details/Details'
import AutoServices from './../../services/landing/autoService';
import { useEffect, useState } from 'react'
import EditItem from '../../components/editItem/EditItem'
import DeleteProduct from '../../components/deleteProduct/DeleteProduct'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Snackbar, Typography } from '@mui/material'
import AddItemModal from '../../components/addItemModal/AddItemModal'
import { Close, DeleteForever, Edit, EditAttributes, EditNotifications } from '@mui/icons-material'
import Filter from '../../helpers/Filter'
import { useLocation, useNavigate } from 'react-router-dom'

function AutoService() {
    const location = useLocation()
    const navigate = useNavigate()

    const params = new URLSearchParams(location.search);
    const orderBy = params.get('order_by') || 'name';

    const headers = tableHeaders['autoService']
    const { data, loading, error } = useFetch(AutoServices.getAutoService, `order_by=${orderBy}`)


    const [autoServiceItem, setAutoServiceItem] = useState([]);
    const [formConfig, setFormConfig] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [rowDetailOpen, setRowDetailOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('')

    const sortedOptions = [
        { value: 'name', label: 'Nomi' },
        { value: 'price', label: 'Narxi' },
        { value: 'created_at', label: 'Yaratilgan sana' },
        { value: '-created_at', label: '- Yaratilgan sana' }
    ];

    useEffect(() => {
        setSelectedFilter(orderBy);
    }, [orderBy]);

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        navigate(`?&order_by=${filter}`);
    };

    const handleRowClick = (item) => {
        setCurrentItem(item);
        setRowDetailOpen(true);
    };

    // handle add
    const handleAdd = () => {
        setFormConfig([
            { type: 'text', label: "Xizmat turi", name: 'name', required: true },
            { type: 'number', label: 'Narx', name: 'price', required: true },
        ]);
        setAddOpen(true);
    };

    const createProduct = async (item) => {
        try {
            const newService = await AutoServices.postAutoService(item);
            setAutoServiceItem([...autoServiceItem, newService]);
            setSuccessMsg("Muvaffaqiyatli qo'shildi");
            setSnackbarOpen(true);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            setErrorMsg(error.message || "Mahsulotni qo'shishda xatolik yuz berdi!");
            setSnackbarOpen(true);
        } finally {
            setAddOpen(false);
        }
    };

    // handle edit
    const handleEdit = async (item) => {
        setCurrentItem(item);
        setFormConfig([
            { type: 'text', label: "Xixmat turi", name: 'name', value: item.name },
            { type: 'number', label: 'Narx', name: 'price', value: item.price },
        ]);
        setEditOpen(true);
    };

    const updateProduct = async (updatedData) => {
        const formattedData = {
            name: updatedData.name,
            price: updatedData.price,
        };

        try {
            const updatedOrder = await AutoServices.putAutoServiceById(currentItem.id, formattedData);
            setAutoServiceItem(autoServiceItem.map(o => o.id === currentItem.id ? updatedOrder : o));
            setSuccessMsg('Mahsulot muvaffaqiyatli yangilandi!');
            setSnackbarOpen(true);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            setErrorMsg(error.message || "Mahsulotni yangilashda xatolik yuz berdi!");
            setSnackbarOpen(true);
        } finally {
            setEditOpen(false);
        }
    };

    // handle delete
    const handleDelete = (item) => {
        setCurrentItem(item.id);
        setDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await AutoServices.deleteAutoService(currentItem);
            setAutoServiceItem(autoServiceItem.filter(o => o.id !== currentItem));
            setSuccessMsg('Mahsulot muvaffaqiyatli o\'chirildi!');
            setSnackbarOpen(true);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            setErrorMsg(error.message || 'Mahsulotni o\'chirishda xatolik yuz berdi!');
            setSnackbarOpen(true);
        } finally {
            setDeleteOpen(false);
        }
    };

    const formattedData = data?.map((item, index) => ({
        ...item,
        row: (
            <>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.price}</td>
            </>
        )
    }));

    return (
        <div className='auto-service'>
            <SideBar />
            <main>
                <Navbar title='Avto xizmatlar' />
                <div className="extra-items">
                    <div className="header-items">
                        <div>
                            <Filter
                                selectedFilter={selectedFilter}
                                onFilterChange={handleFilterChange}
                                options={sortedOptions}
                            />
                        </div>
                        <div className="header-items-add">
                            <AddItemBtn name="Xizmat qo'shish" onClick={handleAdd} />
                        </div>
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

            {rowDetailOpen && (
                <Dialog
                    open={rowDetailOpen}
                    onClose={() => setRowDetailOpen(false)}
                    PaperProps={{
                        style: {
                            borderRadius: 15,
                            padding: '20px',
                            backgroundColor: '#f5f5f5',
                            boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
                        }
                    }}
                >
                    <DialogTitle sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#1e88e5',
                        color: '#fff',
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15
                    }}>
                        <Typography variant="h6">Xizmat Tafsilotlari</Typography>
                        <IconButton onClick={() => setRowDetailOpen(false)} style={{ color: '#fff' }}>
                            <Close />
                        </IconButton>
                    </DialogTitle>
                    <Divider />
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Typography variant="body1"><strong>Xizmat turi:</strong> {currentItem.name}</Typography>
                        <Typography variant="body1"><strong>Narx:</strong> {currentItem.price}</Typography>
                        <Typography variant="body1"><strong>Yaratilgan sana:</strong> {new Date(currentItem.created_at).toLocaleDateString()}</Typography>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'space-between', padding: '0 20px 20px 20px' }}>
                        <IconButton onClick={() => handleEdit(currentItem)}>
                            <Edit style={{ color: 'orange', fontSize: '28px' }} />
                        </IconButton>
                        <Button onClick={() => setRowDetailOpen(false)} sx={{ color: '#1e88e5', fontWeight: 'bold' }}>
                            Yopish
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

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
    )
}

export default AutoService