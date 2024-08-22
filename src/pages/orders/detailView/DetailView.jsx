import React, { useState, useEffect } from 'react';
import './detailView.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, CardContent, Typography, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import OrdersService from '../../../services/landing/orders';
import SideBar from '../../../components/sidebar/SideBar';
import Navbar from '../../../components/navbar/Navbar';
import Loader from '../../../helpers/loader/Loader';

function DetailView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);

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

  const handlePrint = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handlePrintAction = () => {
    // Chop etish funksiyasini bu yerda qo'llang
    window.print();
    setOpenModal(false);
  };

  const today = new Date().toLocaleDateString()

  return (
    <div className='order-detail-view'>
      <style>
        {`
    @media print {
      .MuiDialogActions-root {
        display: none;
      }
      .print-info {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 100px;
      }
      .print-info div {
        margin-bottom: 10px;
      }
      .line {
        width: 200px;
        height: 1px;
        background-color: black;
      }
    }
  `}
      </style>
      <SideBar />
      <main>
        <Navbar title="To'liq ma'lumotni ko'rish" />
        <section className="details-wrapper">
          {loading ? <Loader /> : error ? <p>{error}</p> : (
            <Card>
              <CardContent className="card-content">
                <div className="header-content">
                  <Typography variant="h5" className="subtitle">Buyurtma Tafsilotlari</Typography>
                  <Button variant="outlined" onClick={handlePrint}><i className="fa-solid fa-print" style={{ paddingRight: '10px' }}></i>Chop etish</Button>
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

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" className="typography-section">Maxsulotlar</Typography>
                    <Divider style={{ margin: '10px 0' }} />
                    <TableContainer component={Paper} style={{ borderRadius: 0 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Nomi</TableCell>
                            <TableCell>Miqdor</TableCell>
                            <TableCell>Umumiy</TableCell>
                            <TableCell>Chegirma</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data?.products?.map((product, index) => (
                            <TableRow key={index} onClick={() => navigate('/product')}>
                              <TableCell>{product.product?.name}</TableCell>
                              <TableCell>{product.amount}</TableCell>
                              <TableCell>{product.total}</TableCell>
                              <TableCell>{product.discount}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" className="typography-section">Xizmatlar</Typography>
                    <Divider style={{ margin: '10px 0' }} />
                    <TableContainer component={Paper} style={{ borderRadius: 0 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Xodim</TableCell>
                            <TableCell>Xizmat qismi</TableCell>
                            <TableCell>Xizmat nomi</TableCell>
                            <TableCell>Umumiy</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data?.services?.map((service, index) => (
                            <TableRow key={index} onClick={() => navigate('/auto-services')}>
                              <TableCell>{service.staff}</TableCell>
                              <TableCell>{service.part}</TableCell>
                              <TableCell>{service.service?.name}</TableCell>
                              <TableCell>{service.total}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      {/* Modal for print preview */}
      <Dialog open={openModal} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Buyurtma tafsilotlari</DialogTitle>
        <DialogContent dividers>
          <CardContent>
            <Typography variant="subtitle1"><strong>Yaratilgan vaqti:</strong> {new Date(data.created_at).toLocaleString()}</Typography>
            <Typography variant="subtitle1"><strong>Umumiy:</strong> {data.total}</Typography>
            <Typography variant="subtitle1"><strong>To'langan:</strong> {data.paid}</Typography>
            <Typography variant="subtitle1"><strong>Qarz:</strong> {data.debt}</Typography>

            <Typography variant="h6" className="typography-section">Mijoz haqida ma'lumot</Typography>
            <Divider style={{ margin: '10px 0' }} />
            <Typography variant="subtitle1"><strong>Ism:</strong> {data.customer?.first_name}</Typography>
            <Typography variant="subtitle1"><strong>Familiya:</strong> {data.customer?.last_name}</Typography>
            <Typography variant="subtitle1"><strong>Telefon raqam:</strong> {data.customer?.phone_number}</Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" className="typography-section">Maxsulotlar</Typography>
                <Divider style={{ margin: '10px 0' }} />
                <TableContainer component={Paper} style={{ borderRadius: 0 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nomi</TableCell>
                        <TableCell>Miqdor</TableCell>
                        <TableCell>Umumiy</TableCell>
                        <TableCell>Chegirma</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.products?.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{product.product?.name}</TableCell>
                          <TableCell>{product.amount}</TableCell>
                          <TableCell>{product.total}</TableCell>
                          <TableCell>{product.discount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" className="typography-section">Xizmatlar</Typography>
                <Divider style={{ margin: '10px 0' }} />
                <TableContainer component={Paper} style={{ borderRadius: 0 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Xizmat qismi</TableCell>
                        <TableCell>Xizmat nome</TableCell>
                        <TableCell>Umumiy</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.services?.map((service, index) => (
                        <TableRow key={index}>
                          <TableCell>{service.part}</TableCell>
                          <TableCell>{service.service?.name}</TableCell>
                          <TableCell>{service.total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </CardContent>
          <div className="print-info" style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', marginTop: '100px' }}>
            <div>{today}</div>
            <div className='line'></div>
            <div className='line'></div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Bekor qilish</Button>
          <Button onClick={handlePrintAction} color="primary">Chop etish</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DetailView;
