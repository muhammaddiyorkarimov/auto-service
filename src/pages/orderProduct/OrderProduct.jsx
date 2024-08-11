import { useCallback, useEffect, useState } from 'react'
import AddItemBtn from '../../components/addItemBtn/AddItemBtn'
import DataTable from '../../components/dataTable/DataTable'
import { tableHeaders } from '../../components/details/Details'
import Navbar from '../../components/navbar/Navbar'
import SideBar from '../../components/sidebar/SideBar'
import './orderProduct.css'
import useQueryParams from '../../helpers/useQueryParams'
import OrderProducts from '../../services/landing/orderProduct'
import useFetch from '../../hooks/useFetch'
import CustomPagination from '../../helpers/CustomPagination'

function OrderProduct() {
    const headers = tableHeaders['orderProduct']

    const [orderProduct, setOrderProduct] = useState([])
    const [formConfig, setFormConfig] = useState([])
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

    const fetchOrderProduct = useCallback(() => {
        return OrderProducts.getOrders(page, pageSize);
    }, [page, pageSize]);

    const { data, loading, error } = useFetch(fetchOrderProduct)

    const handlePageChange = (event, value) => {
        setPage(value);
        setQueryParams({ page: value });
    }

    useEffect(() => {
        if (params.get('page') !== page.toString()) {
            setQueryParams({ page });
        }
    }, [page, params, setQueryParams]);

    // const handleRowClick = (item) => {
    //     navigate(`/orders/${item.id}`);
    // };

    const formattedData = data?.results?.map((item, index) => ({
        ...item,
        row: (
            <>
                <td>{index + 1}</td>
                <td>{item.paid}</td>
            </>
        )
    }))

    return (
        <div className='order-product'>
            <SideBar />
            <main>
                <Navbar title='Buyurtma maxsulotlar' />
                <div className="extra-items">
                    <div className="header-items">
                        <AddItemBtn name="Maxsulot qo'shish" />
                    </div>
                    <section className="details-wrapper">
                        <DataTable
                            // loading={loading}
                            tableHead={headers}
                        // data={formattedData}
                        // onEdit={handleEdit}
                        // onDelete={handleDelete}
                        // onRowClick={handleRowClick}
                        />
                    </section>
                    <CustomPagination
                        count={Math.ceil(data?.count / pageSize)}
                        page={page}
                        onChange={handlePageChange}
                    />
                </div>
            </main>
        </div>
    )
}

export default OrderProduct