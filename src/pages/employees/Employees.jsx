import AddItemBtn from '../../components/addItemBtn/AddItemBtn'
import { tableHeaders } from '../../components/details/Details'
import Navbar from '../../components/navbar/Navbar'
import SideBar from '../../components/sidebar/SideBar'
import './employees.css'

function Employees() {
    const headers = tableHeaders['employees']
    return (
        <div className='employees'>
            <SideBar />
            <main>
                <Navbar title='Xodimlar' />
                <div className="extra-items">
                    <div className="header-items">
                        
                        <div className="header-items-add">
                            <AddItemBtn name="Xodim qo'shish" />
                        </div>
                    </div>
                    <section className="details-wrapper"></section>
                </div>
            </main>
        </div>

    )
}

export default Employees