import { useCallback, useEffect, useState } from 'react'
import AddItemBtn from '../../components/addItemBtn/AddItemBtn'
import DataTable from '../../components/dataTable/DataTable'
import { tableHeaders } from '../../components/details/Details'
import Navbar from '../../components/navbar/Navbar'
import SideBar from '../../components/sidebar/SideBar'
import CustomPagination from '../../helpers/CustomPagination'
import SearchInput from '../../helpers/SearchInput'
import useQueryParams from '../../helpers/useQueryParams'
import './expenses.css'
import ExpensesService from './../../services/landing/expensesSerive';
import ExpensesTypeService from './../../services/landing/expensesTypeSerive';
import useFetch from '../../hooks/useFetch'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Snackbar, Typography } from '@mui/material'
import { Close, Edit } from '@mui/icons-material'
import ExpensesType from '../../components/expensesType/ExpensesType'
import AddItemModal from '../../components/addItemModal/AddItemModal'
import EditItem from '../../components/editItem/EditItem'
import DeleteProduct from '../../components/deleteProduct/DeleteProduct'

function Expenses() {

    const headers = tableHeaders['expenses']

    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [product, setProduct] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [formConfig, setFormConfig] = useState([]);
    const [editFormConfig, setEditFormConfig] = useState([]);
    const [rowDetailOpen, setRowDetailOpen] = useState(false);

    const [params, setQueryParams] = useQueryParams();
    const [page, setPage] = useState(Number(params.get('page')) || 1);
    const [pageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState(params.get('search') || '');

    const fetchOrders = useCallback((query) => {
        return ExpensesService.getExpensesService(query);
    }, []);

    const { data, loading, error } = useFetch(fetchOrders, { page, page_size: pageSize, search: searchQuery });
    const { data: expensesType } = useFetch(ExpensesTypeService.getExpensesTypeService)

    useEffect(() => {
        if (params.get('page') !== page.toString()) {
            setQueryParams({ page });
        }
        if (params.get('search') !== searchQuery) {
            setQueryParams({ search: searchQuery });
        }
    }, [page, searchQuery, params, setQueryParams]);

    const handlePageChange = (event, value) => {
        setPage(value);
        setQueryParams({ page: value });
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
        setPage(1);
    };

    // Handle deleting a product
    const handleDelete = (item) => {
        setCurrentItem(item.id);
        setDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await ExpensesService.deleteExpensesService(currentItem);
            setProduct(product.filter((c) => c.id !== currentItem));
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

    // Handle adding a product
    const handleAdd = () => {
        setFormConfig([
            { type: 'select', label: 'Xarajat turi', name: 'name', options: expensesType?.results?.map(p => ({ value: p.id, label: p.name })), required: true },
            { type: 'number', label: 'Narxi', name: 'price', required: true },
            { type: 'text', label: 'Tavsif', name: 'description', required: true },
        ]);
        setAddOpen(true);
    };

    const createProduct = async (item) => {
        console.log(item)
        try {
            const newProduct = await ExpensesService.postExpensesService(item);
            setProduct([...product, newProduct]);
            setSuccessMsg("Mahsulot muvaffaqiyatli qo'shildi!");
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

    // Handle editing a product
    const handleEdit = (item) => {
        setCurrentItem(item);
        setEditFormConfig([
            { type: 'select', label: 'Xarajat turi', name: 'name', value: item.name, options: expensesType?.results?.map(p => ({ value: p.id, label: p.name })), required: true },
            { type: 'number', label: 'Narxi', name: 'price', value: item.price, required: true },
            { type: 'text', label: 'Tavsif', name: 'description', value: item.description, required: true },
        ]);
        setEditOpen(true);
    };

    const updateProduct = async (formData) => {
        try {
            const updatedData = {
                name: formData.name,
                price: formData.price,
                description: formData.description,
            };

            await ExpensesService.putExpensesService(currentItem.id, updatedData);

            const updatedItem = await ExpensesService.getExpensesServiceById(currentItem.id);

            setProduct(product.map((p) => (p.id === currentItem.id ? updatedItem : p)));
            setSuccessMsg("Mahsulot muvaffaqiyatli yangilandi!");
            setSnackbarOpen(true);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            setErrorMsg(error.message || "Mahsulotni yangilashda xatolik yuz berdi!");
            setSnackbarOpen(true);
        } finally {
            setEditOpen(false);
        }
    };

    const formattedData = data?.results?.map((item, index) => {
        return {
            ...item,
            row: (
                <>
                    <td>{index + 1}</td>
                    <td>{item.type?.name}</td>
                    <td>{item.price}</td>
                    <td>
                        {item.description?.length > 30
                            ? `${item.description?.slice(0, 30)}...`
                            : item.description}
                    </td>
                </>
            ),
        };
    });


    const handleRowClick = (item) => {
        console.log(item)
        setCurrentItem(item);
        setRowDetailOpen(true);
    };

    return (
        <div className='expenses'>
            <SideBar />
            <main>
                <Navbar title='Xarajat' />
                <div className="extra-items">
                    <div className="header-items">
                        <div>
                            <SearchInput
                                searchValue={searchQuery}
                                onSearchChange={handleSearchChange}
                            />
                        </div>
                        <div className="header-items-add">
                            <ExpensesType />
                            <AddItemBtn name="Xarajat qo'shish" onClick={handleAdd} />
                        </div>
                    </div>
                    <section className="details-wrapper">
                        <DataTable
                            loading={loading}
                            error={error}
                            tableHead={headers}
                            data={formattedData}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            onRowClick={handleRowClick}
                        />
                    </section>
                    <CustomPagination
                        count={data?.count ? Math.ceil(data.count / pageSize) : 0}
                        page={page}
                        onChange={handlePageChange}
                    />
                </div>
            </main>

            {/* Add Item Modal */}
            {addOpen &&
                <AddItemModal
                    open={addOpen}
                    onClose={() => setAddOpen(false)}
                    formConfig={formConfig}
                    onSave={createProduct}
                />
            }

            {/* Edit Item Modal */}
            {editOpen &&
                <EditItem
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    formConfig={editFormConfig}
                    onSave={updateProduct}
                    initialData={currentItem}
                />
            }

            {/* Delete Confirmation Dialog */}
            {deleteOpen &&
                <DeleteProduct
                    open={deleteOpen}
                    onClose={() => setDeleteOpen(false)}
                    onConfirm={handleDeleteConfirm}
                />
            }

            {/* Snackbar for Success/Error Messages */}
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

            {rowDetailOpen && currentItem && (
                <Dialog
                    open={rowDetailOpen}
                    onClose={() => setRowDetailOpen(false)}
                    PaperProps={{
                        style: {
                            minWidth: '400px',
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
                        <Typography variant="h6">Xarajat Tafsilotlari</Typography>
                        <IconButton onClick={() => setRowDetailOpen(false)} style={{ color: '#fff' }}>
                            <Close />
                        </IconButton>
                    </DialogTitle>
                    <Divider />
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Typography variant="body1"><strong>Xarajat turi:</strong> {currentItem?.type?.name}</Typography>
                        <Typography variant="body1"><strong>Narxi:</strong> {currentItem.price}</Typography>
                        <Typography variant="body1"><strong>Tavsif:</strong> {currentItem.description}</Typography>
                        <Typography variant="body1"><strong>Yaratilgan Sana:</strong> {new Date(currentItem.created_at).toLocaleDateString()}</Typography>
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
        </div>

    )
}

export default Expenses