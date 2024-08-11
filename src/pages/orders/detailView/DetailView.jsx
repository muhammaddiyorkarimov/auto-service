import React, { useState, useEffect } from 'react';
import './detailView.css';
import { useParams } from 'react-router-dom';
import { Button, Card, CardContent, Typography, Divider, Grid } from '@mui/material';
import OrdersService from '../../../services/landing/orders';
import SideBar from '../../../components/sidebar/SideBar';
import Navbar from '../../../components/navbar/Navbar';
import Loader from '../../../helpers/loader/Loader';

function DetailView() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className='order-detail-view'>
      <SideBar />
      <main>
        <Navbar title="To'liq ma'lumotni ko'rish" adminType="Super Admin" name="Muhammaddiyor" />
        <section className="details-wrapper">
          {loading ? <Loader /> : error ? <p>{error}</p> : (
            <Card>
              <CardContent className="card-content">
                <Typography variant="h5" className="subtitle">Buyurtma Tafsilotlari</Typography>
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
                    <Typography variant="h6">Maxsulotlar</Typography>
                    <Divider style={{ margin: '10px 0' }} />
                    <Typography variant="subtitle1"><strong>Mahsulotlar soni:</strong> {data.products.length}</Typography>
                    {data.products.map((product, index) => (
                      <Card key={index} className="card-item">
                        <CardContent>
                          <Typography><strong>Nomi:</strong> {product.product?.name}</Typography>
                          <Typography><strong>Miqdor:</strong> {product.amount}</Typography>
                          <Typography><strong>Umumiy:</strong> {product.total}</Typography>
                          <Typography><strong>Chegirma:</strong> {product.discount}</Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Grid>
                  <Grid item xs={12} md={6} className="grid-item">
                    <Typography variant="h6">Xizmatlar</Typography>
                    <Divider style={{ margin: '10px 0' }} />
                    <Typography variant="subtitle1"><strong>Xizmatlar soni:</strong> {data.services.length}</Typography>
                    {data.services.map((service, index) => (
                      <Card key={index} className="card-item">
                        <CardContent>
                          <Typography><strong>Xizmat qismi:</strong> {service.part}</Typography>
                          <Typography><strong>Xizmat nome:</strong> {service.service?.name}</Typography>
                          <Typography><strong>Umumiy:</strong> {service.total}</Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Grid>
                </Grid>

                <div className="button-container">
                  {/* Uncomment the buttons as needed */}
                  {/* <Button variant="contained" color="primary">Edit</Button> */}
                  {/* <Button variant="contained" color="secondary">Delete</Button> */}
                </div>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}

export default DetailView;
