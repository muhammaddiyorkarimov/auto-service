import { useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import SideBar from '../../components/sidebar/SideBar';
import useFetch from '../../hooks/useFetch';
import ImportProduct from '../../services/landing/importProduct';
import './brand.css';
import DataTable from '../../components/dataTable/DataTable';
import { tableHeaders } from '../../components/details/Details';
import DeleteProduct from '../../components/deleteProduct/DeleteProduct';
import { Alert, Snackbar } from '@mui/material';
import AddItemBtn from '../../components/addItemBtn/AddItemBtn';
import AddItemModal from '../../components/addItemModal/AddItemModal';
import OurProduct from '../../services/landing/ourProduct';
import Provider from './../../services/landing/provider';
import EditItem from '../../components/editItem/EditItem';

function Brand() {
    const { data, loading, error } = useFetch(ImportProduct.getImportProduct);
    const { data: ourProduct, loading: ourProductLoading, error: ourProductError } = useFetch(OurProduct.getProduct);
    const { data: provider, loading: providerLoading, error: providerError } = useFetch(Provider.getProvider);

    const headers = tableHeaders['importProduct'];
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [product, setProduct] = useState([]);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [productName, setProductName] = useState('');
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [formConfig, setFormConfig] = useState([]);
    const [editFormConfig, setEditFormConfig] = useState([]);

    // Handle deleting a product
    const handleDelete = (item) => {
        setCurrentProduct(item.id);
        setDeleteOpen(true);
        setProductName(item.product.name);
    };

    const handleDeleteConfirm = async () => {
        try {
            await ImportProduct.deleteImportProduct(currentProduct);
            setProduct(product.filter((c) => c.id !== currentProduct));
            setSuccessMsg('Mahsulot muvaffaqiyatli o\'chirildi!');
            setSnackbarOpen(true);
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
            { type: 'number', label: 'Miqdor', name: 'amount', required: true },
            { type: 'number', label: 'Kelish summasi', name: 'import_price', required: true },
            { type: 'number', label: 'Qarz', name: 'debt' },
            { type: 'select', label: 'Maxsulot', name: 'product', options: ourProduct && ourProduct.map(p => ({ value: p.id, label: p.name })), required: true },
            { type: 'select', label: 'Yetkazib beruvchi', name: 'provider', options: provider && provider.map(p => ({ value: p.id, label: p.name })), required: true },
            { type: 'number', label: 'Umumiy', name: 'total', required: true },
        ]);
        setAddOpen(true);
    };

    const createProduct = async (item) => {
        try {
            const newProduct = await ImportProduct.postImportProduct(item);
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
    // Handle editing a product
    const handleEdit = (item) => {
        setCurrentProduct(item);
        setEditFormConfig([
            { type: 'number', label: 'Miqdor', name: 'amount', value: item.amount, required: true },
            { type: 'number', label: 'Kelish summasi', name: 'import_price', value: item.import_price, required: true },
            { type: 'number', label: 'Qarz', name: 'debt', value: item.debt },
            { type: 'select', label: 'Maxsulot', name: 'product', options: ourProduct && ourProduct.map(p => ({ value: p.id, label: p.name })), value: item.product.id, required: true },
            { type: 'select', label: 'Yetkazib beruvchi', name: 'provider', options: provider && provider.map(p => ({ value: p.id, label: p.name })), value: item.provider.id, required: true },
            { type: 'number', label: 'Umumiy', name: 'total', value: item.total, required: true },
        ]);
        setEditOpen(true);
    };

    const updateProduct = async (formData) => {
        try {
            const updatedData = {
                amount: formData.amount,
                import_price: formData.import_price,
                total: formData.total,
                debt: formData.debt,
                product: formData.product,
                provider: formData.provider
            };

            await ImportProduct.putImportProduct(currentProduct.id, updatedData);

            const updatedItem = await ImportProduct.getImportProductById(currentProduct.id);

            setProduct(product.map((p) => (p.id === currentProduct.id ? updatedItem : p)));
            setSuccessMsg("Mahsulot muvaffaqiyatli yangilandi!");
            setSnackbarOpen(true);
        } catch (error) {
            setErrorMsg(error.message || "Mahsulotni yangilashda xatolik yuz berdi!");
            setSnackbarOpen(true);
        } finally {
            setEditOpen(false);
        }
    };




    const formattedData = data && data.map((item, index) => {
        return (
            {
                ...item,
                row: (
                    <>
                        <td>{index + 1}</td>
                        <td>{item.amount}</td>
                        <td>{item.import_price}</td>
                        <td>{item.debt}</td>
                        <td>{item.product ? item.product.name : ''}</td>
                        <td>{item.provider ? item.provider.name : ''}</td>
                        <td>{item.total}</td>
                    </>
                ),
            }
        );
    });

    return (
        <div className='brand'>
            <SideBar />
            <main>
                <Navbar title='Kirim Tovarlar' name='Muhammaddiyor' type='Super admin' />
                <div className="extra-items">
                    <div className="header-items">
                        <AddItemBtn name="Maxsulot qo'shish" onClick={handleAdd} />
                    </div>
                    <section className="details-wrapper">
                        <DataTable
                            loading={loading}
                            error={error}
                            tableHead={headers}
                            data={formattedData}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    </section>
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
                    initialData={currentProduct}
                />
            }

            {/* Delete Confirmation Dialog */}
            {deleteOpen &&
                <DeleteProduct
                    open={deleteOpen}
                    onClose={() => setDeleteOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    itemName={productName}
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
        </div>
    );
}

export default Brand;
