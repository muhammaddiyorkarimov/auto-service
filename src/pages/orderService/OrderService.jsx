import './orderService.css'
import SideBar from '../../components/sidebar/SideBar'
import Navbar from '../../components/navbar/Navbar'
import AddItemBtn from '../../components/addItemBtn/AddItemBtn'
import { tableHeaders } from '../../components/details/Details';
import DataTable from '../../components/dataTable/DataTable';

function OrderService() {
    const headers = tableHeaders['orderService'];
    
    return (
        <div className='order-service'>
            <SideBar />
            <main>
                <Navbar title='Buyurtma xizmatlari' name='Muhammaddiyor' adminType='Super Admin' />
                <div className="extra-items">
                    <div className="header-items">
                        <AddItemBtn name="Xizmat qo'shish"/>
                    </div>
                    <section className="details-wrapper">
                        <DataTable
                            // loading={loading}
                            // tableHead={headers}
                            // data={formattedData}
                            // onEdit={handleEdit}
                            // onDelete={handleDelete}
                            // onRowClick={handleRowClick}
                        />
                    </section>
                </div>
            </main>
        </div>
    )
}

export default OrderService