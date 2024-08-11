import { useCallback, useEffect, useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import SideBar from '../../components/sidebar/SideBar';
import useFetch from '../../hooks/useFetch';
import AddProvider from './../../components/addProvider/AddProvider';
import './providerC.css';
import DataTable from '../../components/dataTable/DataTable';
import { tableHeaders } from '../../components/details/Details';
import DeleteProduct from '../../components/deleteProduct/DeleteProduct';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Snackbar, Typography } from '@mui/material';
import AddItemModal from '../../components/addItemModal/AddItemModal';
import Provider from './../../services/landing/provider';
import EditItem from '../../components/editItem/EditItem';
import { Close, Edit } from '@mui/icons-material';
import SearchInput from './../../helpers/SearchInput';
import Filter from './../../helpers/Filter';
import { useNavigate } from 'react-router-dom';
import useQueryParams from '../../helpers/useQueryParams';
import CustomPagination from '../../helpers/CustomPagination';

function ProviderC() {
    const headers = tableHeaders['provider'];
    const navigate = useNavigate();

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
    const [selectedFilter, setSelectedFilter] = useState(params.get('debt') || '');

    const fetchOrders = useCallback((query) => {
        return Provider.getProvider(query);
    }, []);

    const { data, loading, error } = useFetch(fetchOrders, { page, page_size: pageSize, search: searchQuery, debt: selectedFilter });

    useEffect(() => {
        if (params.get('page') !== page.toString()) {
            setQueryParams({ page });
        }
        if (params.get('search') !== searchQuery) {
            setQueryParams({ search: searchQuery });
        }
        if (params.get('debt') !== selectedFilter) {
            setQueryParams({ debt: selectedFilter });
        }
    }, [page, searchQuery, selectedFilter, params, setQueryParams]);

    const handlePageChange = (event, value) => {
        setPage(value);
        setQueryParams({ page: value });
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
        setPage(1);
    };

    const handleFilterChange = (value) => {
        setSelectedFilter(value);
        setQueryParams({ debt: value });
        setPage(1);
    };

    const sortedOptions = [
        { value: '', label: 'Barchasi' },
        { value: 'true', label: 'Qarzdor' },
        { value: 'false', label: 'Qarz emas' },
    ]

    // Handle deleting a product
    const handleDelete = (item) => {
        setCurrentItem(item.id);
        setDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await Provider.deleteProvider(currentItem);
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
            { type: 'text', label: 'Ism', name: 'name', required: true },
            { type: 'number', label: 'Telefon raqam', name: 'phone_number', required: true },
            { type: 'number', label: 'Qarz', name: 'debt', required: true },
        ]);
        setAddOpen(true);
    };

    const createProduct = async (item) => {
        try {
            const newProduct = await Provider.postProvider(item);
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
            { type: 'text', label: 'Ism', name: 'name', value: item.name },
            { type: 'number', label: 'Telefon raqam', name: 'phone_number', value: item.phone_number },
            { type: 'number', label: 'Qarz', name: 'debt', required: true, value: item.debt },
        ]);
        setEditOpen(true);
    };

    const updateProduct = async (formData) => {
        try {
            const updatedData = {
                name: formData.name,
                phone_number: formData.phone_number,
                debt: formData.debt,
            };

            await Provider.putProviderById(currentItem.id, updatedData);

            const updatedItem = await Provider.getProviderById(currentItem.id);

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


    const formattedData = data?.map((item, index) => {
        return (
            {
                ...item,
                row: (
                    <>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.phone_number}</td>
                        <td>{item.debt}</td>
                    </>
                ),
            }
        );
    });

    const handleRowClick = (item) => {
        setCurrentItem(item);
        setRowDetailOpen(true);
    };


    return (
        <div className='brand'>
            <SideBar />
            <main>
                <Navbar title="Ta'minlovchi" />
                <div className="extra-items">
                    <div className="header-items">
                        <div>
                            <SearchInput
                                searchValue={searchQuery}
                                onSearchChange={handleSearchChange}
                            />
                            <Filter
                                selectedFilter={selectedFilter}
                                onFilterChange={handleFilterChange}
                                options={sortedOptions}
                            />
                        </div>
                        <div className="header-items-add">
                            <AddProvider />
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
                        count={data?.length ? Math.ceil(data?.length / pageSize) : 0}
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
                        <Typography variant="h6">Mahsulot Tafsilotlari</Typography>
                        <IconButton onClick={() => setRowDetailOpen(false)} style={{ color: '#fff' }}>
                            <Close />
                        </IconButton>
                    </DialogTitle>
                    <Divider />
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Typography variant="body1"><strong>Ismi:</strong> {currentItem.name}</Typography>
                        <Typography variant="body1"><strong>Telefon raqami:</strong> {currentItem.phone_number}</Typography>
                        <Typography variant="body1"><strong>Qarzi:</strong> {currentItem.debt}</Typography>
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
    );
}

export default ProviderC;