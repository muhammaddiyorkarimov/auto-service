import './Sidebar.css';
// images
import images from '../../images/index';
// hooks
import { Link, NavLink } from 'react-router-dom';
// context
import { useSidebar } from '../../context/SidebarContext'
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../features/slice/authSlice';

function SideBar() {
  const { isOpen } = useSidebar()
  const { toggleSidebar } = useSidebar()
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  console.log(user)

  const handleLogout = () => {
    dispatch(logoutUser());
    window.location.href = '/login';
  };

  return (
    <div className={`sidebar ${isOpen ? 'closed-sidebar' : 'open-sidebar'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <h1>Fassco</h1>
          <i onClick={toggleSidebar} className="fa-solid fa-bars"></i>
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
                {/* <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/order-products'>
                    <span>Maxsulotlar</span>
                  </NavLink>
                </div> */}
              </div>
            </li>
            <li>
              <div className="link-title"><span></span>Xarajat<span></span></div>
              <div className="li-items">
                {user?.role === 'Admin' && (
                  <li>
                    <div className="li-item">
                      <span></span>
                      <NavLink to='/employees'>
                        <span>Xodimlar</span>
                      </NavLink>
                    </div>
                  </li>
                )}
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
        <img src={images.logoutIcon} alt="Logout" onClick={handleLogout} />
      </div>
    </div>
  );
}

export default SideBar;
