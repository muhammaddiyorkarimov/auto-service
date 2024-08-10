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
                  <NavLink to='/income'>
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
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/'>
                    <span>Servislar</span>
                  </NavLink>
                </div>
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/'>
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
                  <NavLink to='/'>
                    <span>Xizmatlar</span>
                  </NavLink>
                </div>
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/'>
                    <span>Mijozlar</span>
                  </NavLink>
                </div>
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/'>
                    <span>Avtomobillar</span>
                  </NavLink>
                </div>
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/'>
                    <span>Xodimlar</span>
                  </NavLink>
                </div>
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/'>
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
