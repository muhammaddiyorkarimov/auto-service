import React, { useEffect, useState } from 'react';
import './income.css';
import SideBar from './../../components/sidebar/SideBar';
import Navbar from '../../components/navbar/Navbar';
import DataTable from '../../components/dataTable/DataTable';
import useFetch from '../../hooks/useFetch';
import Loader from '../../helpers/loader/Loader';
import { tableHeaders } from './../../components/details/Details';
import DeleteProduct from '../../components/deleteProduct/DeleteProduct';
import AddItemBtn from './../../components/addItemBtn/AddItemBtn';
import AddItemModal from '../../components/addItemModal/AddItemModal';
import EditItem from '../../components/editItem/EditItem';
import OurProduct from '../../services/landing/ourProduct';
import Provider from './../../services/landing/provider';
import CustomPagination from './../../helpers/CustomPagination';
import { Alert, Snackbar } from '@mui/material';
import SearchInput from '../../helpers/SearchInput';
import { useLocation, useNavigate } from 'react-router-dom';
import NotAvailable from '../../helpers/notAvailable/NotAvailale';
import Filter from '../../helpers/Filter';
import AddProvider from '../../components/addProvider/AddProvider';

function Income() {
  const headers = tableHeaders['ourProduct'];

  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedFilter, setSelectedFilter] = useState('')

  const sortedOptions = [
    { value: 'name', label: 'Nomi' },
    { value: 'code', label: 'Kod' },
    { value: 'amount', label: 'Miqdori' },
    { value: 'max_discount', label: 'Chegirma' }
  ]

  const { data, loading, error } = useFetch(OurProduct.getProduct, searchQuery);

  const { data: providers, loading: providersLoading, error: providersError } = useFetch(Provider.getProvider);
  const [income, setIncome] = useState(data || []);
  const [formConfig, setFormConfig] = useState([]);
  const [dialog, setDialog] = useState({ type: '', open: false, item: null });
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentIncome, setCurrentIncome] = useState(null);
  const [currentData, setCurrentData] = useState([]);
  const [productName, setProductName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const query = params.get('search') || ''
    const orderBy = params.get('order_by') || 'name'
    setSearchQuery(query);
    setSelectedFilter(orderBy)
  }, [location.search])

  // for search input
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setPage(1);
    navigate(`?search=${value}`);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    navigate(`?search=${searchQuery}&order_by=${filter}`);
  }

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredProducts(income)
    } else {
      const filtered = income.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, income]);

  useEffect(() => {
    setIncome(data);
    setFilteredProducts(data);
  }, [data]);

  useEffect(() => {
    if (selectedFilter && income.length) {
      const sorted = [...filteredProducts].sort((a, b) => {
        if (a[selectedFilter] < b[selectedFilter]) return -1;
        if (a[selectedFilter] > b[selectedFilter]) return 1;
        return 0;
      });
      setFilteredProducts(sorted);
    }
  }, [selectedFilter, income]);

  useEffect(() => {
    if (data) {
      const sortedData = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setIncome(sortedData);
      setFilteredProducts(sortedData);
    } else {
      setIncome([]);
      setFilteredProducts([]);
    }
  }, [data]);


  // handle save and edit
  const handleSave = async (formData, file) => {

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {

        if (key === 'provider') {
          data.append(key, formData[key]);

        } else {
          data.append(key, formData[key]);
        }
      });
      if (file) {
        data.append('file', file);
      }

      if (dialog.type === 'edit') {

        await OurProduct.putProductById(dialog.item.id, data);

        const updatedItem = await OurProduct.getProductById(dialog.item.id);

        setIncome(income.map(c => (c.id === updatedItem.id ? updatedItem : c)));
      } else {
        const newItem = await OurProduct.postProduct(data);
        setIncome([...income, newItem]);
      }

      // window.location.reload(); // Sahifani yangilash
    } catch (error) {
      setErrorMsg(error.response?.data?.provider?.[0] || error.message || 'Xatolik yuz berdi');
      setSnackbarOpen(true);
    } finally {
      setDialog({ type: '', open: false, item: null });
      setAddOpen(false);
      setEditOpen(false);
    }
  };

  const unitOptions = [
    {id: 1, name: 'Dona'},
    {id: 2, name: 'Komplekt'},
    {id: 3, name: 'Litr'},
]


  const handleAdd = () => {
    setFormConfig([
      { type: 'text', label: 'Kod', name: 'code' },
      { type: 'text', label: 'Nomi', name: 'name' },
      { type: 'number', label: 'Miqdori', name: 'amount' },
      { type: 'select', label: 'Birlik', name: 'unit', required: true, options: unitOptions.map(p => ({value: p.id, label: p.name}))},
      { type: 'number', label: 'Import narxi', name: 'import_price' },
      { type: 'number', label: 'Eksport narxi', name: 'export_price' },
      { type: 'number', label: 'Chegirma', name: 'max_discount' },
      {
        type: 'select', label: 'Ta’minotchi', name: 'provider', options: providers && providers.map(p => ({ value: p.id, label: p.name }))
      }
    ]);
    setAddOpen(true);
  };

  const handleEdit = (item) => {
    setFormConfig([
      { type: 'text', label: 'Kod', name: 'code', value: item.code },
      { type: 'text', label: 'Nomi', name: 'name', value: item.name },
      { type: 'number', label: 'Miqdori', name: 'amount', value: item.amount },
      { type: 'select', label: 'Birlik', name: 'unit', required: true, options: unitOptions.map(p => ({value: p.id, label: p.name})), value: item.unit},
      { type: 'number', label: 'Import narxi', name: 'import_price', value: item.import_price },
      { type: 'number', label: 'Eksport narxi', name: 'export_price', value: item.export_price },
      { type: 'number', label: 'Chegirma', name: 'max_discount', value: item.max_discount },
      {
        type: 'select', label: 'Ta’minotchi', name: 'provider', value: item.provider.id, options: providers.map(p => ({ value: p.id, label: p.name }))
      }
    ]);
    setDialog({ type: 'edit', open: true, item: item });
    setEditOpen(true);
    setCurrentData(item)
  };


  // handle delete
  const handleDelete = (item) => {
    setCurrentIncome(item.id);
    setProductName(item.name);
    setDeleteOpen(true);
  };
  const handleConfirmDelete = async () => {
    try {
      await OurProduct.deleteProduct(currentIncome);
      setIncome(income.filter(c => c.id !== currentIncome));
    } catch (error) {
      setErrorMsg(error.message || 'Xatolik yuz berdi');
      setSnackbarOpen(true);
    } finally {
      setDeleteOpen(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedIncome = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const formattedData = paginatedIncome.map((item, index) => ({
    ...item,
    row: (
      <>
        <td>{(page - 1) * itemsPerPage + index + 1}</td>
        <td>{item.product?.name}</td>
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

  return (
    <div className='income'>
      <SideBar />
      <main>
        <Navbar title="Tovarlar"/>
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
            />
          </section>
          <CustomPagination
            count={Math.ceil(filteredProducts.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
          />
        </div>
      </main>

      {/* Add Item Modal */}
      {addOpen && (
        <AddItemModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSave={handleSave}
          formConfig={formConfig.filter(field => field.name !== 'image')}
        />
      )}

      {/* Edit Item Modal */}
      {editOpen && (
        <EditItem
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSave={handleSave}
          formConfig={formConfig.filter(field => field.name !== 'image')}
          initialData={currentData}
        />
      )}

      {/* Delete Item Dialog */}
      {deleteOpen && (
        <DeleteProduct
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleConfirmDelete} // Updated prop name
          itemName={productName}
        />
      )}

      {/* Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Income;
