import './Sidebar.css';
// images
import images from '../../images/index';
// hooks
import { Link, NavLink } from 'react-router-dom';
// context
import { useSidebar } from '../../context/SidebarContext'

function SideBar() {
  const { isOpen } = useSidebar()

  return (
    <div className={`sidebar ${isOpen ? 'closed-sidebar' : 'open-sidebar'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <h1>Fassco Service</h1>
        </div>
        <div className="bar-items">
          <ul>
            <li>
              <NavLink to='/' className={({ isActive }) => isActive ? "active" : ""}>
                <img src={images.homeIcon} alt="" />
                <span>Asosiy</span>
              </NavLink>
            </li>
            <li>
              <div className="link-title"><span></span>Ombor<span></span></div>
              <div className="li-items">
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/product'>
                    <span>Tovarlar</span>
                  </NavLink>
                </div>
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/import-products'>
                    <span>Kirim Tovarlar</span>
                  </NavLink>
                </div>
              </div>
            </li>
            <li>
              <div className="link-title"><span></span>Sotuv<span></span></div>
              <div className="li-items">
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/orders'>
                    <span>Buyurtmalar</span>
                  </NavLink>
                </div>
                {/* <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/order-services'>
                    <span>Xizmatlar</span>
                  </NavLink>
                </div> */}
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/order-products'>
                    <span>Maxsulotlar</span>
                  </NavLink>
                </div>
              </div>
            </li>
            <li>
              <div className="link-title"><span></span>Xarajat<span></span></div>
              <div className="li-items">
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/provider'>
                    <span>Ta'minlovchi</span>
                  </NavLink>
                </div>
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/auto-services'>
                    <span>Xizmatlar</span>
                  </NavLink>
                </div>
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/customers'>
                    <span>Mijozlar</span>
                  </NavLink>
                </div>
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/cars'>
                    <span>Avtomobillar</span>
                  </NavLink>
                </div>
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/employees'>
                    <span>Xodimlar</span>
                  </NavLink>
                </div>
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/expenses'>
                    <span>Xarajatlar</span>
                  </NavLink>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="sidebar-footer">
        <img src={images.logoutIcon} alt="" />
      </div>
    </div>
  );
}

export default SideBar;
