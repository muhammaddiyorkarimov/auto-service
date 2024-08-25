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

  console.log(data)

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

  console.log(data)

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
        .oreder-details-wrapper table {
    margin-top: 20px;
    width: 100%;
    border-collapse: collapse;
}

.oreder-details-wrapper table, th, td {
    border: 1px solid black;
    padding: 5px;
}

.oreder-details-wrapper table thead th {
    text-align: left;
    vertical-align: top;
}

.oreder-details-wrapper table thead th[rowspan="2"] {
    width: 20%;
}

.oreder-details-wrapper table thead td {
    text-align: left;
}

.oreder-details-wrapper table thead td {
    width: 30%;
}

.oreder-details-wrapper table tbody th, 
.oreder-details-wrapper table tbody td {
    text-align: left;
}

.oreder-details-wrapper table th p,
.oreder-details-wrapper table td p {
    font-weight: 400;
    margin: 0;
}

    }
  `}
      </style>
      <SideBar />
      <main>
        <Navbar title="To'liq ma'lumotni ko'rish" />
        <section className="oreder-details-wrapper">
          {loading ? <Loader /> : error ? <p>{error}</p> : (
            <Card>
              <CardContent className="card-content">
                <div className="header-content">
                  <Typography variant="h5" className="subtitle">Buyurtma Tafsilotlari</Typography>
                  <Button variant="outlined" onClick={handlePrint}><i className="fa-solid fa-print" style={{ paddingRight: '10px' }}></i>Chop etish</Button>
                </div>
                <Divider style={{ margin: '20px 0' }} />

                <Typography variant="subtitle1"><strong>Yaratilgan vaqti:</strong> {new Date(data.created_at).toLocaleString()}</Typography>
                <Typography variant="subtitle1"><strong>Umumiy:</strong> {data.paid + data.debt}</Typography>
                <Typography variant="subtitle1"><strong>To'langan:</strong> {data.paid}</Typography>
                <Typography variant="subtitle1"><strong>Qarz:</strong> {data.debt}</Typography>

                <Typography variant="h6" className="typography-section">Mijoz haqida ma'lumot</Typography>
                <Divider style={{ margin: '10px 0' }} />
                <Typography variant="subtitle1"><strong>Ism:</strong> {data.customer?.first_name}</Typography>
                <Typography variant="subtitle1"><strong>Familiya:</strong> {data.customer?.last_name}</Typography>
                <Typography variant="subtitle1"><strong>Telefon raqam:</strong> {data.customer?.phone_number}</Typography>
                <Typography variant="subtitle1"><strong>Izoh:</strong> {data.description}</Typography>

                <table className="oreder-details-wrapper">
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid black' }} rowspan="2">Model: <p>{data?.car?.name + ' ' + data?.car?.brand}</p></th>
                      <th style={{ border: '1px solid black' }} rowspan="2">Vin code: <p>{data?.car?.code}</p></th>
                    </tr>
                    <tr>
                      <th style={{ border: '1px solid black' }}>Davlat raqami: <p>{data?.car?.state_number}</p></th>
                      <th style={{ border: '1px solid black' }}>Yurgan kilometri: <p>{data?.car_kilometers} km</p></th>
                    </tr>
                  </thead>
                </table>
                <table>
                  {data?.products?.length > 0 &&
                    <>
                      <tr>
                        <th style={{ border: '1px solid black' }} colspan="4">Maxsulotlar</th>
                      </tr>
                      <tr>
                        <th style={{ border: '1px solid black' }}>Nomi</th>
                        <th style={{ border: '1px solid black' }}>Miqdor</th>
                        <th style={{ border: '1px solid black' }}>Umumiy</th>
                        <th style={{ border: '1px solid black' }}>Chegirma</th>
                      </tr>
                      {data?.products?.map((product, index) => (
                        <tr key={index}>
                          <td style={{ border: '1px solid black' }}>{product.product?.name}</td>
                          <td style={{ border: '1px solid black' }}>{product.amount}</td>
                          <td style={{ border: '1px solid black' }}>{product.total}</td>
                          <td style={{ border: '1px solid black' }}>{product.discount}</td>
                        </tr>
                      ))}
                    </>
                  }
                </table>
                <table>
                  <tr>
                    <th colspan="4">Xizmatlar</th>
                  </tr>
                  <tr>
                    <th style={{ border: '1px solid black' }}>Xodim</th>
                    <th style={{ border: '1px solid black' }}>Xizmat qismi</th>
                    <th style={{ border: '1px solid black' }}>Xizmat nomi</th>
                    <th style={{ border: '1px solid black' }}>Umumiy</th>
                  </tr>
                  {data?.services?.map((service, index) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid black' }}>{service.staff.first_name + ' ' + service.staff.last_name}</td>
                      <td style={{ border: '1px solid black' }}>{service.part}</td>
                      <td style={{ border: '1px solid black' }}>{service.service?.name}</td>
                      <td style={{ border: '1px solid black' }}>{service.total}</td>
                    </tr>
                  ))}
                </table>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      <Dialog open={openModal} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Buyurtma tafsilotlari</DialogTitle>
        <DialogContent className='oreder-details-wrapper' dividers>
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
            <Typography variant="subtitle1"><strong>Izoh:</strong> {data.description}</Typography>
            <table className="oreder-details-wrapper">
              <thead>
                <tr>
                  <th style={{ border: '1px solid black' }} rowspan="2">Model: <p>{data?.car?.name + ' ' + data?.car?.brand}</p></th>
                  <th style={{ border: '1px solid black' }} rowspan="2">Vin code: <p>{data?.car?.code}</p></th>
                </tr>
                <tr>
                  <th style={{ border: '1px solid black' }}>Davlat raqami: <p>{data?.car?.state_number}</p></th>
                  <th style={{ border: '1px solid black' }}>Yurgan kilometri: <p>{data?.car_kilometers} km</p></th>
                </tr>
              </thead>
            </table>
            {data?.products?.length > 0 && <table>
              <tr>
                <th style={{ border: '1px solid black' }} colspan="4">Maxsulotlar</th>
              </tr>
              <tr>
                <th style={{ border: '1px solid black' }}>Nomi</th>
                <th style={{ border: '1px solid black' }}>Miqdor</th>
                <th style={{ border: '1px solid black' }}>Umumiy</th>
                <th style={{ border: '1px solid black' }}>Chegirma</th>
              </tr>
              {data?.products?.map((product, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black' }}>{product.product?.name}</td>
                  <td style={{ border: '1px solid black' }}>{product.amount}</td>
                  <td style={{ border: '1px solid black' }}>{product.total}</td>
                  <td style={{ border: '1px solid black' }}>{product.discount}</td>
                </tr>
              ))}
            </table>}
            <table>
              <tr>
                <th style={{ border: '1px solid black' }} colspan="4">Xizmatlar</th>
              </tr>
              <tr>
                <th style={{ border: '1px solid black' }}>Xodim</th>
                <th style={{ border: '1px solid black' }}>Xizmat qismi</th>
                <th style={{ border: '1px solid black' }}>Xizmat nomi</th>
                <th style={{ border: '1px solid black' }}>Umumiy</th>
              </tr>
              {data?.services?.map((service, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black' }}>{service.staff.first_name + ' ' + service.staff.last_name}</td>
                  <td style={{ border: '1px solid black' }}>{service.part}</td>
                  <td style={{ border: '1px solid black' }}>{service.service?.name}</td>
                  <td style={{ border: '1px solid black' }}>{service.total}</td>
                </tr>
              ))}
            </table>
          </CardContent>
          <div className="print-info">
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
