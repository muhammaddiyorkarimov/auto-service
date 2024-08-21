import './Sidebar.css';
// images
import images from '../../images/index';
// hooks
import { Link, NavLink } from 'react-router-dom';
// context
import { useSidebar } from '../../context/SidebarContext'
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../features/slice/authSlice';
import logo from '../../images/logo.png';
import { LuWarehouse } from 'react-icons/lu';
import { CiMoneyBill } from 'react-icons/ci';
import { TiUploadOutline } from 'react-icons/ti';

function SideBar() {
  const { isOpen } = useSidebar()
  const { toggleSidebar } = useSidebar()
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    window.location.href = '/login';
  };

  return (
    <div className={`sidebar ${isOpen ? 'closed-sidebar' : 'open-sidebar'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-wrapper">
            <img width={150} src={logo} alt="logo" />
            <p>автосервис</p>
          </div>
          <i onClick={toggleSidebar} className="fa-solid fa-bars"></i>
        </div>
        <div className="bar-items">
          <ul>
            <li>
              <NavLink to='/' className={({ isActive }) => isActive ? "active main-page" : "main-page"}>
                <img src={images.homeIcon} alt="" />
                <span className='main-page-title'>Главная</span>
              </NavLink>
            </li>
            <li>
              <hr />
              <div className="link-title">
                <LuWarehouse />
                <span>Склад</span>
              </div>
              <div className="li-items">
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/import'>
                    <span>• Приход товара</span>
                  </NavLink>
                </div>
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/import-products'>
                    <span>• Kirim tovarlar</span>
                  </NavLink>
                </div>
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/product'>
                    <span>• Товары</span>
                  </NavLink>
                </div>
              </div>
            </li>
            <li>
              <hr />
              <div className="link-title">
                <CiMoneyBill />
                <span>Продажа</span>
              </div>
              <div className="li-items">
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/orders'>
                    <span>• Заказы</span>
                  </NavLink>
                </div>
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/adding-order'>
                    <span>Add Order</span>
                  </NavLink>
                </div>
              </div>
            </li>
            <li>
              <hr />
              <div className="link-title">
                <TiUploadOutline />
                <span>Прочие</span>
              </div>
              <div className="li-items">
                {user?.role === 'Admin' && (
                  <li>
                    <div className="li-item">
                      <span></span>
                      <NavLink to='/employees'>
                        <span>• Персонал</span>
                      </NavLink>
                    </div>
                  </li>
                )}
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/provider'>
                    <span>• Поставщик</span>
                  </NavLink>
                </div>
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/auto-services'>
                    <span>• Сервисы</span>
                  </NavLink>
                </div>
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/customers'>
                

                  <span>• Клиенты</span>
                  </NavLink>
                </div>
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/cars'>
                    <span>• Автомобили</span>
                  </NavLink>
                </div>
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/expenses'>
                    <span>• Расходы</span>
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
