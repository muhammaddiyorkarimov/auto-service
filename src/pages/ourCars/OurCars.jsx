import React, { useState, useCallback, useEffect } from 'react';
import './ourCars.css';
import SideBar from '../../components/sidebar/SideBar';
import Navbar from '../../components/navbar/Navbar';
import AddItemBtn from '../../components/addItemBtn/AddItemBtn';
import { Close } from '@mui/icons-material';
import SearchInput from '../../helpers/SearchInput';
import DataTable from '../../components/dataTable/DataTable';
import AddItemModal from '../../components/addItemModal/AddItemModal';
import EditItem from '../../components/editItem/EditItem';
import DeleteProduct from '../../components/deleteProduct/DeleteProduct';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Snackbar, Typography } from '@mui/material';
import CustomPagination from '../../helpers/CustomPagination';
import useQueryParams from '../../helpers/useQueryParams';
import { useLocation, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import CarsService from './../../services/landing/carsService';

function OurCars() {
    const navigate = useNavigate();
    const location = useLocation();

    const headers = [
        { label: "Code", key: "code" },
        { label: "Name", key: "name" },
        { label: "Brand", key: "brand" },
        { label: "Color", key: "color" },
        { label: "State Number", key: "state_number" },
    ];

    const [params, setQueryParams] = useQueryParams();
    const [page, setPage] = useState(Number(params.get('page')) || 1);
    const [pageSize] = useState(1);

    const fetchCars = useCallback(() => {
        return CarsService.getCars(page, pageSize);
    }, [page, pageSize]);

    const { data, loading, error } = useFetch(fetchCars);

    const handlePageChange = (event, value) => {
        setPage(value);
        setQueryParams({ page: value });
    };

    useEffect(() => {
        if (params.get('page') !== page.toString()) {
            setQueryParams({ page });
        }
    }, [page, params, setQueryParams]);

    const [carsItem, setCarsItem] = useState([]);
    const [formConfig, setFormConfig] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [rowDetailOpen, setRowDetailOpen] = useState(false);

    const sortedOptions = [
        { value: 'code', label: 'Code' },
        { value: 'name', label: 'Name' },
        { value: 'brand', label: 'Brand' },
        { value: 'color', label: 'Color' },
    ];

    const handleRowClick = (item) => {
        setCurrentItem(item);
        setRowDetailOpen(true);
    };

    // handle add
    const handleAdd = () => {
        setFormConfig([
            { type: 'text', label: 'Code', name: 'code', required: true },
            { type: 'text', label: 'Name', name: 'name', required: true },
            { type: 'text', label: 'Brand', name: 'brand', required: true },
            { type: 'text', label: 'Color', name: 'color', required: true },
            { type: 'text', label: 'State Number', name: 'state_number', required: true },
        ]);
        setAddOpen(true);
    };

    const createCar = async (item) => {
        try {
            const newCar = await CarsService.postCars(item);
            setCarsItem([...carsItem, newCar]);
            setSuccessMsg('Car successfully added!');
            setSnackbarOpen(true);
            setAddOpen(false);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            setErrorMsg(error.message || 'Error adding car!');
            setSnackbarOpen(true);
        }
    };

    // handle edit
    const handleEdit = async (item) => {
        setCurrentItem(item);
        setFormConfig([
            { type: 'text', label: 'Code', name: 'code', value: item.code },
            { type: 'text', label: 'Name', name: 'name', value: item.name },
            { type: 'text', label: 'Brand', name: 'brand', value: item.brand },
            { type: 'text', label: 'Color', name: 'color', value: item.color },
            { type: 'text', label: 'State Number', name: 'state_number', value: item.state_number },
        ]);
        setEditOpen(true);
    };

    const updateCar = async (updatedData) => {
        const formattedData = {
            code: updatedData.code,
            name: updatedData.name,
            brand: updatedData.brand,
            color: updatedData.color,
            state_number: updatedData.state_number,
        };

        try {
            const updatedCar = await CarsService.putCarsById(currentItem.id, formattedData);
            setCarsItem(carsItem.map(o => o.id === currentItem.id ? updatedCar : o));
            setSuccessMsg('Car successfully updated!');
            setSnackbarOpen(true);
            setEditOpen(false);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            setErrorMsg(error.message || 'Error updating car!');
            setSnackbarOpen(true);
        }
    };

    // handle delete
    const handleDelete = (item) => {
        setCurrentItem(item.id);
        setDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await CarsService.deleteCars(currentItem);
            setCarsItem(carsItem.filter(o => o.id !== currentItem));
            setSuccessMsg('Car successfully deleted!');
            setSnackbarOpen(true);
            setDeleteOpen(false);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            setErrorMsg(error.message || 'Error deleting car!');
            setSnackbarOpen(true);
        }
    };

    const formattedData = data?.results?.map((item, index) => ({
        ...item,
        row: (
            <>
                <td>{index + 1}</td>
                <td>{item.code}</td>
                <td>{item.name}</td>
                <td>{item.brand}</td>
                <td>{item.color}</td>
                <td>{item.state_number}</td>
            </>
        )
    }));

    return (
        <div className='customers'>
            <SideBar />
            <main>
                <Navbar title='Our Cars' />
                <div className="extra-items">
                    <div className="header-items">
                        <div>
                            <SearchInput />
                        </div>
                        <div className="header-items-add">
                            <AddItemBtn name="Add Car" onClick={handleAdd} />
                        </div>
                    </div>
                    <section className="details-wrapper">
                        <DataTable
                            error={error}
                            loading={loading}
                            // tableHead={headers}
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
                    onSave={createCar}
                />}
            {editOpen &&
                <EditItem
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    formConfig={formConfig}
                    onSave={updateCar}
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
                            maxWidth: '600px'
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
                        <Typography variant="h6">Car Details</Typography>
                        <IconButton onClick={() => setRowDetailOpen(false)} style={{ color: '#fff' }}>
                            <Close />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography variant="body1" gutterBottom><strong>Code:</strong> {currentItem?.code}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Name:</strong> {currentItem?.name}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Brand:</strong> {currentItem?.brand}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Color:</strong> {currentItem?.color}</Typography>
                        <Typography variant="body1" gutterBottom><strong>State Number:</strong> {currentItem?.state_number}</Typography>
                    </DialogContent>
                    <Divider />
                    <DialogActions>
                        <Button onClick={() => setRowDetailOpen(false)} color="primary">
                            Close
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
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={errorMsg ? 'error' : 'success'}
                    sx={{ width: '100%' }}
                >
                    {errorMsg || successMsg}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default OurCars;
