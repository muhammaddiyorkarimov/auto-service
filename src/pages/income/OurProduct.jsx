import SearchInput from '../../helpers/SearchInput'
import './income.css'
import AddProvider from '../../components/addProvider/AddProvider'
import AddItemBtn from '../../components/addItemBtn/AddItemBtn'
import { useLocation, useNavigate } from 'react-router-dom'
import OrderProducts from '../../services/landing/orderProduct'
import { useCallback, useEffect, useState } from 'react'
import useQueryParams from '../../helpers/useQueryParams'
import useFetch from '../../hooks/useFetch'
import OurProductService from '../../services/landing/ourProduct'
import Provider from '../../services/landing/provider'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Snackbar, Typography } from '@mui/material'
import SideBar from '../../components/sidebar/SideBar'
import Navbar from '../../components/navbar/Navbar'
import { tableHeaders } from '../../components/details/Details'
import DataTable from '../../components/dataTable/DataTable'
import CustomPagination from '../../helpers/CustomPagination'
import AddItemModal from '../../components/addItemModal/AddItemModal'
import EditItem from '../../components/editItem/EditItem'
import DeleteProduct from '../../components/deleteProduct/DeleteProduct'
import Filter from '../../helpers/Filter'
import { Close, Edit } from '@mui/icons-material'

function OurProduct() {
    const headers = tableHeaders['ourProduct'];
    const location = useLocation();
    const navigate = useNavigate();

    const [ourProduct, setOurProduct] = useState([])
    const [formConfig, setFormConfig] = useState([]);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [rowDetailOpen, setRowDetailOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([])
    const [selectedFilter, setSelectedFilter] = useState('')

    const [params, setQueryParams] = useQueryParams();
    const [page, setPage] = useState(Number(params.get('page')) || 1);
    const [pageSize] = useState(10);

    const fetchOrderProduct = useCallback(() => {
        return OurProductService.getProduct();
    }, [searchQuery, selectedFilter, page, pageSize]);    

    const { data, loading, error } = useFetch(fetchOrderProduct)
    console.log(data)
    const { data: providers, loading: providersLoading, error: providersError } = useFetch(Provider.getProvider);

    const handlePageChange = (event, value) => {
        setPage(value);
        setQueryParams({ page: value });
    }

    const sortedOptions = [
        { value: 'name', label: 'Nomi' },
        { value: 'code', label: 'Kod' },
        { value: 'amount', label: 'Miqdori' },
        { value: 'max_discount', label: 'Chegirma' }
    ]

    const handleSearchChange = (value) => {
        setSearchQuery(value);
        setPage(1);
        navigate(`?search=${value}`);
    };

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        navigate(`?search=${searchQuery}&order_by=${filter}`);
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('search') || '';
        const orderBy = params.get('order_by') || 'name';
        setSearchQuery(query);
        setSelectedFilter(orderBy);
    }, [location.search]);

    useEffect(() => {
        if (searchQuery === '') {
            setFilteredProducts(ourProduct);
        } else {
            const filtered = ourProduct.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [searchQuery, ourProduct]);

    useEffect(() => {
        setOurProduct(data);
        setFilteredProducts(data);
    }, [data]);

    useEffect(() => {
        if (selectedFilter && ourProduct.length) {
            const sorted = [...filteredProducts].sort((a, b) => {
                if (a[selectedFilter] < b[selectedFilter]) return -1;
                if (a[selectedFilter] > b[selectedFilter]) return 1;
                return 0;
            });
            setFilteredProducts(sorted);
        }
    }, [selectedFilter, ourProduct]);

    useEffect(() => {
        if (data?.results) {
            const sortedData = [...data.results].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setOurProduct(sortedData);
            setFilteredProducts(sortedData);
        } else {
            setOurProduct([]);
            setFilteredProducts([]);
        }
    }, [data]);
    

    const handleAdd = () => {
        setFormConfig([
            { type: 'text', label: 'Kod', name: 'code' },
            { type: 'text', label: 'Nomi', name: 'name', required: true },
            { type: 'number', label: 'Miqdori', name: 'amount', required: true },
            { type: 'number', label: 'Min miqdor', name: 'min_amount', required: true },
            { type: 'text', label: 'Birlik', name: 'unit' },
            { type: 'number', label: 'Import narxi', name: 'import_price', required: true },
            { type: 'number', label: 'Eksport narxi', name: 'export_price' },
            { type: 'number', label: 'Chegirma', name: 'max_discount', required: true },
            {
                type: 'select', label: 'Ta’minotchi', name: 'provider', required: true, options: providers && providers.map(p => ({ value: p.id, label: p.name }))
            }
        ]);
        setAddOpen(true);
    }

    const createProduct = async (item) => {
        try {
            const newProduct = await OurProductService.postProduct(item);
            setOurProduct([...ourProduct, newProduct]);
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
            { type: 'text', label: 'Kod', name: 'code', value: item.code },
            { type: 'text', label: 'Nomi', name: 'name', value: item.name },
            { type: 'number', label: 'Min miqdor', name: 'min_amount', value: item.min_amount },
            { type: 'number', label: 'Miqdori', name: 'amount', value: item.amount },
            { type: 'text', label: 'Birlik', name: 'unit', value: item.unit },
            { type: 'number', label: 'Import narxi', name: 'import_price', value: item.import_price },
            { type: 'number', label: 'Eksport narxi', name: 'export_price', value: item.export_price },
            { type: 'number', label: 'Chegirma', name: 'max_discount', value: item.max_discount },
            {
                type: 'select', label: 'Ta’minotchi', name: 'provider', value: item.provider.id, options: providers.map(p => ({ value: p.id, label: p.name }))
            }
        ]);
        setEditOpen(true);
    }

    const updateProduct = async (updatedData) => {
        const formattedData = {
            code: updatedData.code,
            name: updatedData.name,
            min_amount: updatedData.min_amount,
            amount: updatedData.amount,
            unit: updatedData.unit,
            import_price: updatedData.import_price,
            export_price: updatedData.export_price,
            max_discount: updatedData.max_discount,
            provider: updatedData.provider
        }
        console.log(formattedData, updatedData)
        try {
            const updatedProduct = await OurProductService.putProductById(currentItem.id, formattedData);
            setOurProduct(ourProduct.map(o => o.id === currentItem.id ? updatedProduct : o));
            setSuccessMsg('Mahsulot muvaffaqiyatli yangilandi!');
            setSnackbarOpen(true);
            setTimeout(() => {
                // window.location.reload();
            }, 1000);
        } catch (error) {
            setErrorMsg(error.message || "Mahsulotni yangilashda xatolik yuz berdi!");
            setSnackbarOpen(true);
        } finally {
            setEditOpen(false);
        }

    }

    const handleDelete = (item) => {
        setCurrentItem(item.id)
        setDeleteOpen(true)
    }

    const handleDeleteConfirm = async (item) => {
        try {
            await OurProductService.deleteProduct(currentItem);
            setOurProduct(ourProduct.filter(o => o.id !== currentItem));
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
                <td style={{ color: item.min_amount < 10 ? 'red' : 'inherit' }}>
                    {item.name}
                </td>
                <td>{item.code}</td>
                <td>{item.amount}</td>
                <td>{item.unit}</td>
                <td>{item.import_price}</td>
                <td>{item.export_price}</td>
                <td>{item.max_discount}%</td>
                <td>{item.export_price * item.max_discount / 100}</td>
                <td>{item.provider ? item.provider.name : '0'}</td>
                <td>{item.total_benefit ? item.total_benefit : '0'}</td>
            </>
        )
    }));

    const handleRowClick = (item) => {
        setCurrentItem(item);
        setRowDetailOpen(true);
    };

    return (
        <div className='income'>
            <SideBar />
            <main>
                <Navbar title='Avto xizmatlar' />
                <div className="extra-items">
                    <div className="header-items">
                        <div>
                            <SearchInput searchValue={searchQuery} onSearchChange={handleSearchChange} />
                            <Filter selectedFilter={selectedFilter} onFilterChange={handleFilterChange} options={sortedOptions} />
                        </div>
                        <div className="header-items-add">
                            <AddProvider />
                            <AddItemBtn name="Maxsulot qo'shish" onClick={handleAdd} />
                        </div>
                    </div>
                    <section className='details-wrapper'>
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
                        <Typography variant="body1"><strong>Mahsulot Nomi:</strong> {currentItem.name}</Typography>
                        <Typography variant="body1"><strong>Kod:</strong> {currentItem.code}</Typography>
                        <Typography variant="body1"><strong>Miqdori:</strong> {currentItem.amount}</Typography>
                        <Typography variant="body1"><strong>Birlik:</strong> {currentItem.unit}</Typography>
                        <Typography variant="body1"><strong>Import Narxi:</strong> {currentItem.import_price}</Typography>
                        <Typography variant="body1"><strong>Eksport Narxi:</strong> {currentItem.export_price}</Typography>
                        <Typography variant="body1"><strong>Chegirma:</strong> {currentItem.max_discount}%</Typography>
                        <Typography variant="body1"><strong>Ta’minotchi:</strong> {currentItem.provider ? currentItem.provider.name : '0'}</Typography>
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

export default OurProduct