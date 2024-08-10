import './App.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Login from './pages/login/Login';
import WareHousePage from './pages/warehouse/WareHousePage';
import Home from './pages/home/Home';
import PrivateRoute from './routes/PrivateRoute';
import Income from './pages/income/Income';
import { SidebarProvider } from './context/SidebarContext';
import Orders from './pages/orders/Orders';
import Brand from './pages/brand/Brand';

function App() {
    const routes = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/income" element={<Income />} />
                    <Route path="/import-products" element={<Brand />} />
                    <Route path="/warehouse" element={<WareHousePage />} />
                    <Route path="/orders" element={<Orders />} />
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
