import React, { useState, useEffect } from 'react';
import './detailView.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, CardContent, Typography, Divider, Grid, Snackbar, Alert } from '@mui/material';
import OrdersService from '../../../services/landing/orders';
import SideBar from '../../../components/sidebar/SideBar';
import Navbar from '../../../components/navbar/Navbar';
import Loader from '../../../helpers/loader/Loader';
import AddItemBtn from '../../../components/addItemBtn/AddItemBtn';
import useFetch from '../../../hooks/useFetch';
import OurProduct from '../../../services/landing/ourProduct';
import AddItemModal from '../../../components/addItemModal/AddItemModal';
import OrderProducts from '../../../services/landing/orderProduct';
import EditItem from '../../../components/editItem/EditItem';
import DeleteProduct from '../../../components/deleteProduct/DeleteProduct';
import OrderService from '../../../services/landing/orderService';
import AutoServices from './../../../services/landing/autoService';
import OrderPrint from '../OrderPrint';

function DetailView() {
  const navigate = useNavigate()
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
console.log(data)
  const [openModal, setOpenModal] = useState(false)
  const [formConfig, setFormConfig] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [serviceItem, setServiceItem] = useState([])
  const [productItem, setProductItem] = useState([])
  const [isService, setIsService] = useState(false);

  const { data: orderService } = useFetch(AutoServices.getAutoService)
  const { data: ourProduct } = useFetch(OurProduct.getProduct)

  useEffect(() => {
    if (data) {

    }
    if (orderService) {
      setServiceItem(orderService)
    }
    if (ourProduct) {
      setProductItem(ourProduct.results)
    }
  }, [orderService, ourProduct, data])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await OrdersService.getOrdersById(id);
        setData(result);
      } catch (err) {
        setError(err.message || "Ma'lumotni olishda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddProduct = () => {
    setFormConfig([
      { type: 'number', label: "Miqdor", name: 'amount', required: true },
      { type: 'number', label: 'Chegirma', name: 'discount', required: true },
      { type: 'select', label: 'Maxsulot', name: 'product', options: productItem?.map(c => ({ value: c.id, label: c.name })), required: true },
      { type: 'number', label: 'Umumiy', name: 'total', required: true },
    ])
    setAddOpen(true);
    setIsService(false);
  }

  const createProduct = async (item) => {
    try {
      const selectedProduct = productItem.find(p => p.id === item.product);

      if (item.amount > selectedProduct?.amount) {
        setErrorMsg("Miqdor mahsulotning mavjud miqdoridan oshib ketishi mumkin emas!");
        setSnackbarOpen(true);
        return;
      }

      const newItem = {
        ...item,
        order: data?.id
      };

      const newProduct = await OrderProducts.postOrders(newItem);
      setProductItem([...productItem, newProduct]);
      setSuccessMsg("Mahsulot muvaffaqiyatli qo'shildi");
      setSnackbarOpen(true);
      setTimeout(() => {
        window.location.reload()
      }, 500)
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
      { type: 'number', label: "Miqdor", name: 'amount', value: item.amount },
      { type: 'number', label: 'Chegirma', name: 'discount', value: item.discount },
      { type: 'select', label: 'Maxsulot', name: 'product', options: productItem?.map(c => ({ value: c.id, label: c.name })), value: item.product },
      { type: 'number', label: 'Umumiy', name: 'total', value: item.total },
    ])
    setEditOpen(true);
    setIsService(false);
  }

  const updateProduct = async (updatedData) => {
    const formattedData = {
      total: updatedData.total,
      amount: updatedData.amount,
      discount: updatedData.discount,
      product: updatedData.product.id ? updatedData.product.id : updatedData.product
    };

    try {
      const updatedOrder = await OrderProducts.putOrdersById(currentItem.id, formattedData);
      // setOrdersC(ordersC.map(o => o.id === currentItem.id ? updatedOrder : o));
      setSuccessMsg('Mahsulot muvaffaqiyatli yangilandi!');
      setSnackbarOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      setErrorMsg(error.message || "Mahsulotni yangilashda xatolik yuz berdi!");
      setSnackbarOpen(true);
    } finally {
      setEditOpen(false);
    }
  };

  const handleDelete = (item) => {
    setCurrentItem(item.id)
    setDeleteOpen(true);
    setIsService(false);
  }

  const handleDeleteConfirm = async () => {
    try {
      await OrderProducts.deleteOrders(currentItem);
      setSuccessMsg('Mahsulot muvaffaqiyatli o\'chirildi!');
      setSnackbarOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      setErrorMsg(error.message || 'Mahsulotni o\'chirishda xatolik yuz berdi!');
      setSnackbarOpen(true);
    } finally {
      setDeleteOpen(false);
    }
  };

  // for service
  const handleAddService = () => {
    setFormConfig([
      { type: 'number', label: "Part", name: 'part', required: true },
      { type: 'select', label: 'Xizmat', name: 'service', options: serviceItem?.map(c => ({ value: c.id, label: c.name })), required: true },
      { type: 'number', label: 'Umumiy', name: 'total', required: true },
    ])
    setAddOpen(true);
    setIsService(true);
  }

  const createService = async (item) => {
    try {
      const newItem = {
        ...item,
        order: data?.id
      };
      const newService = await OrderService.postOrders(newItem);
      setServiceItem([...serviceItem, newService]);
      setSuccessMsg("Xizmat muvaffaqiyatli qo'shildi");
      setSnackbarOpen(true);
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      setErrorMsg(error.message || "Xizmat qo'shishda xatolik yuz berdi!");
      setSnackbarOpen(true);
    } finally {
      setAddOpen(false);
    }
  };

  const handleEditService = (item) => {
    setCurrentItem(item);
    setFormConfig([
      { type: 'number', label: "Part", name: 'part', value: item.part },
      { type: 'select', label: 'Xizmat', name: 'service', options: serviceItem?.map(c => ({ value: c.id, label: c.name })), value: item.service },
      { type: 'number', label: 'Umumiy', name: 'total', value: item.total },
    ])
    setEditOpen(true);
    setIsService(true);
  }

  const updateService = async (updatedData) => {
    const formattedData = {
      total: updatedData.total,
      part: updatedData.part,
      product: updatedData.service.id ? updatedData.service.id : updatedData.service
    };

    try {
      const updatedOrder = await OrderService.putOrdersById(currentItem.id, formattedData);
      // setOrdersC(ordersC.map(o => o.id === currentItem.id ? updatedOrder : o));
      setSuccessMsg('Mahsulot muvaffaqiyatli yangilandi!');
      setSnackbarOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      setErrorMsg(error.message || "Mahsulotni yangilashda xatolik yuz berdi!");
      setSnackbarOpen(true);
    } finally {
      setEditOpen(false);
    }
  };

  const handleDeleteService = (item) => {
    setCurrentItem(item.id)
    setDeleteOpen(true);
    setIsService(true);
  }

  const handleDeleteServiceConfirm = async () => {
    try {
      await OrderService.deleteOrders(currentItem);
      setSuccessMsg('Mahsulot muvaffaqiyatli o\'chirildi!');
      setSnackbarOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      setErrorMsg(error.message || 'Mahsulotni o\'chirishda xatolik yuz berdi!');
      setSnackbarOpen(true);
    } finally {
      setDeleteOpen(false);
    }
  };

  const handlePrint = () => {
    setOpenModal(true);
  };


  return (
    <div className='order-detail-view'>
      <SideBar />
      <main>
        <Navbar title="To'liq ma'lumotni ko'rish" />
        <section className="details-wrapper">
          {loading ? <Loader /> : error ? <p>{error}</p> : (
            <Card>
              <CardContent className="card-content">
                <div className="header-content">
                  <Typography variant="h5" className="subtitle">Buyurtma Tafsilotlari</Typography>
                  <Button variant="outlined" onClick={handlePrint}><i className="fa-solid fa-print" style={{paddingRight: '10px'}}></i>Chop etish</Button>
                </div>
                <Divider style={{ margin: '20px 0' }} />

                <Typography variant="subtitle1"><strong>Yaratilgan vaqti:</strong> {new Date(data.created_at).toLocaleString()}</Typography>
                <Typography variant="subtitle1"><strong>Umumiy:</strong> {data.total}</Typography>
                <Typography variant="subtitle1"><strong>To'langan:</strong> {data.paid}</Typography>
                <Typography variant="subtitle1"><strong>Qarz:</strong> {data.debt}</Typography>

                <Typography variant="h6" className="typography-section">Mijoz haqida ma'lumot</Typography>
                <Divider style={{ margin: '10px 0' }} />
                <Typography variant="subtitle1"><strong>Ism:</strong> {data.customer?.first_name}</Typography>
                <Typography variant="subtitle1"><strong>Familiya:</strong> {data.customer?.last_name}</Typography>
                <Typography variant="subtitle1"><strong>Telefon raqam:</strong> {data.customer?.phone_number}</Typography>

                <Grid container spacing={2} className="grid-container typography-section">
                  <Grid item xs={12} md={6} className="grid-item">
                    <div className="grid-item-title">
                      <Typography variant="h6">Maxsulotlar</Typography>
                      <AddItemBtn name="Maxsulot qo'shish" onClick={handleAddProduct} />
                    </div>
                    <Divider style={{ margin: '10px 0' }} />
                    <Typography variant="subtitle1"><strong>Mahsulotlar soni:</strong> {data.products.length}</Typography>
                    {data?.products?.map((product, index) => (
                      <Card key={index} className="card-item">
                        <CardContent onClick={() => navigate('/product')}>
                          <Typography><strong>Nomi:</strong> {product.product?.name}</Typography>
                          <Typography><strong>Miqdor:</strong> {product.amount}</Typography>
                          <Typography><strong>Umumiy:</strong> {product.total}</Typography>
                          <Typography><strong>Chegirma:</strong> {product.discount}</Typography>
                        </CardContent>
                        <div className="actions">
                          <i onClick={() => handleEdit(product)} className="fa-regular fa-pen-to-square" style={{ color: 'orange', fontSize: '18px' }}></i>
                          <i onClick={() => handleDelete(product)} className="fa-regular fa-trash-can" style={{ color: 'red', fontSize: '18px' }}></i>
                        </div>
                      </Card>
                    ))}
                  </Grid>
                  <Grid item xs={12} md={6} className="grid-item">
                    <div className="grid-item-title">
                      <Typography variant="h6">Xizmatlar</Typography>
                      <AddItemBtn name="Xizmat qo'shish" onClick={handleAddService} />
                    </div>
                    <Divider style={{ margin: '10px 0' }} />
                    <Typography variant="subtitle1"><strong>Xizmatlar soni:</strong> {data.services.length}</Typography>
                    {data?.services?.map((service, index) => (
                      <Card key={index} className="card-item">
                        <CardContent onClick={() => navigate('/auto-services')}>
                          <Typography><strong>Xizmat qismi:</strong> {service.part}</Typography>
                          <Typography><strong>Xizmat nome:</strong> {service.service?.name}</Typography>
                          <Typography><strong>Umumiy:</strong> {service.total}</Typography>
                        </CardContent>
                        <div className="actions">
                          <i onClick={() => handleEditService(service)} className="fa-regular fa-pen-to-square" style={{ color: 'orange', fontSize: '18px' }}></i>
                          <i onClick={() => handleDeleteService(service)} className="fa-regular fa-trash-can" style={{ color: 'red', fontSize: '18px' }}></i>
                        </div>
                      </Card>
                    ))}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      {addOpen && (
        <AddItemModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          formConfig={formConfig}
          onSave={isService ? createService : createProduct}
        />
      )}

      {editOpen &&
        <EditItem
          name="Maxsulotni tahrirlash"
          open={editOpen}
          onClose={() => setEditOpen(false)}
          formConfig={formConfig}
          onSave={isService ? updateService : updateProduct}
          initialData={currentItem}
        />}

      {deleteOpen &&
        <DeleteProduct
          name="Ushbu maxsulotni"
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={isService ? handleDeleteServiceConfirm : handleDeleteConfirm}
        />}

        {openModal && <OrderPrint id={id} open={openModal} handleClose={() => setOpenModal(false)}/>}

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

export default DetailView;
