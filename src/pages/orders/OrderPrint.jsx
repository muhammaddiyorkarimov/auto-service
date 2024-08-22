import './detailView/detailView.css';
import OrdersService from '../../services/landing/orders';
import { Button, Dialog, DialogActions, DialogContent, Divider, Grid, Slide, Typography, Card, CardContent } from '@mui/material';
import { useEffect, useState, useRef } from 'react';

function OrderPrint({ open, handleClose, id }) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const contentRef = useRef();

    const Transition = Slide;

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

        if (id) {
            fetchData();
        }
    }, [id]);

    const handlePrint = () => {
        const printWindow = window.open('', 'width=800,height=600');
        const printDocument = printWindow.document;

        const printContent = contentRef.current.cloneNode(true);
        printDocument.body.appendChild(printContent);

        printDocument.head.innerHTML = `
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 10px;
                }
                   .grid-container {
                    display: flex;
                    align-items: start;
                    gap: 50px;
                }

                .card-item {
                    border-bottom: 1px solid #ddd;
                }   
            </style>
        `;

        printWindow.print();

        printWindow.onafterprint = () => {
            printWindow.close();
            handleClose(); // Close the modal
        };
    };
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogContent ref={contentRef}>  {/* Reference the content */}
                <Typography variant="h5" className="subtitle">Buyurtma Tafsilotlari</Typography>
                <Divider style={{ margin: '20px 0' }} />

                {loading ? (
                    <Typography variant="subtitle1">Yuklanmoqda...</Typography>
                ) : error ? (
                    <Typography variant="subtitle1" color="error">{error}</Typography>
                ) : (
                    <>
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
                                <Typography variant="subtitle1"><strong>Mahsulotlar soni:</strong> {data.products?.length}</Typography>
                                {data?.products?.map((product, index) => (
                                    <Card key={index} className="card-item">
                                        <CardContent>
                                            <Typography><strong>Nomi:</strong> {product.name}</Typography>
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
                                <Typography variant="subtitle1"><strong>Xizmatlar soni:</strong> {data.services?.length}</Typography>
                                {data?.services?.map((service, index) => (
                                    <Card key={index} className="card-item">
                                        <CardContent>
                                            <Typography><strong>Xizmat qismi:</strong> {service.part}</Typography>
                                            <Typography><strong>Xizmat nomi:</strong> {service.service?.name}</Typography>
                                            <Typography><strong>Umumiy:</strong> {service.total}</Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Grid>
                        </Grid>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handlePrint}>Chop etish</Button>  {/* Print button */}
                <Button onClick={handleClose}>Bekor qilish</Button>
            </DialogActions>
        </Dialog>
    );
}

export default OrderPrint;
