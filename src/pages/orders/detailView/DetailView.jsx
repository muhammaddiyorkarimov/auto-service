import React from 'react';
import './detailView.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
          {loading ? <Loader /> : error ? <p>{error.message}</p> : <>
            <Card>
              <CardContent>
                <Typography variant="h5">Buyurtma Tafsilotlari</Typography>
                <Divider style={{ margin: '20px 0' }} />

                <Typography variant="subtitle1"><strong>Yaratilgan vaqti:</strong> {new Date(data.created_at).toLocaleString()}</Typography>
                <Typography variant="subtitle1"><strong>Umumiy:</strong> {data.total}</Typography>
                <Typography variant="subtitle1"><strong>To'langan:</strong> {data.paid}</Typography>
                <Typography variant="subtitle1"><strong>Qarz:</strong> {data.debt}</Typography>

                <Typography variant="h6" style={{ marginTop: '20px' }}>Mijoz haqida ma'lumot</Typography>
                <Divider style={{ margin: '10px 0' }} />
                <Typography variant="subtitle1"><strong>Ism:</strong> {data.customer?.first_name}</Typography>
                <Typography variant="subtitle1"><strong>Familiya:</strong> {data.customer?.last_name}</Typography>
                <Typography variant="subtitle1"><strong>Telefon raqam:</strong> {data.customer?.phone_number}</Typography>

                <Typography variant="h6" style={{ marginTop: '20px' }}>Maxsulotlar</Typography>
                <Divider style={{ margin: '10px 0' }} />
                <Typography variant="subtitle1"><strong>Buyurtma mahsulotlar soni:</strong> {data.products.length}</Typography>
                <Typography variant="h6" style={{ marginTop: '20px' }}>Xizmatlar</Typography>
                <Divider style={{ margin: '10px 0' }} />
                <Typography variant="subtitle1"><strong>Buyurtma mahsulotlar soni:</strong> {data.services.length}</Typography>

                {/* <Grid container spacing={2} style={{ marginTop: '10px' }}>
                {data?.products.map((product, index) => (
                  <Grid item xs={12} key={index}>
                    <Card>
                      <CardContent>
                        <Typography><strong>Product ID:</strong> {product.id}</Typography>
                        <Typography><strong>Amount:</strong> {product.amount}</Typography>
                        <Typography><strong>Total:</strong> {product.total}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

                <Typography variant="h6" style={{ marginTop: '20px' }}>Xizmatlar</Typography>
                <Divider style={{ margin: '10px 0' }} />
                <Grid container spacing={2} style={{ marginTop: '10px' }}>
                  {data?.services?.map((service, index) => (
                    <Grid item xs={12} key={index}>
                      <Card>
                        <CardContent>
                          <Typography><strong>Xizmat qismi:</strong> {service.part}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid> */}

                {/* <Grid container spacing={2} style={{ marginTop: '20px' }}>
                  <Grid item>
                    <Button variant="contained" color="primary">Edit</Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="secondary">Delete</Button>
                  </Grid>
                </Grid> */}
              </CardContent>
            </Card>
          </>}
        </section>
      </main>
    </div>
  );
}

export default DetailView;
