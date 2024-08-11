import './App.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Login from './pages/login/Login';
import WareHousePage from './pages/warehouse/WareHousePage';
import Home from './pages/home/Home';
import PrivateRoute from './routes/PrivateRoute';
import { SidebarProvider } from './context/SidebarContext';
import Orders from './pages/orders/Orders';
import Brand from './pages/brand/Brand';
import DetailView from './pages/orders/detailView/DetailView';
import OrderService from './pages/orderService/OrderService';
import OrderProduct from './pages/orderProduct/OrderProduct';
import AutoService from './pages/autoService/AutoService';
import Customers from './pages/customers/Customers';
import OurProduct from './pages/income/OurProduct';
import OurCars from './pages/ourCars/OurCars';

function App() {
    const routes = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/product" element={<OurProduct />} />
                    <Route path="/import-products" element={<Brand />} />
                    <Route path="/warehouse" element={<WareHousePage />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:id" element={<DetailView />} />
                    <Route path="/order-services" element={<OrderService />} />
                    <Route path="/order-products" element={<OrderProduct />} />
                    <Route path="/auto-services" element={<AutoService />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/cars" element={<OurCars />} />
                </Route>
            </>
        )
    );

    return (
        <div className="App">
            <SidebarProvider>
                <RouterProvider router={routes} />
            </SidebarProvider>
        </div>
    );
}

export default App;
