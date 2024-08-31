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
  const { user } = useSelector((state) => state.auth);

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
                <svg className='svg-img' width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 0H1.99C0.88 0 0.00999999 0.9 0.00999999 2L0 16C0 17.1 0.88 18 1.99 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM16 10C16 11.1046 15.1046 12 14 12V12C12.8954 12 12.0411 12.9875 11.357 13.8548C10.8065 14.5527 9.95333 15 9 15C8.04667 15 7.19348 14.5527 6.64297 13.8548C5.95889 12.9875 5.09957 12 3.995 12V12C2.89043 12 1.99 11.1046 1.99 10V4C1.99 2.89543 2.88543 2 3.99 2H14C15.1046 2 16 2.89543 16 4V10ZM6 7C5.63097 7.36903 5.89233 8 6.41421 8V8C6.73773 8 7 8.26227 7 8.58579V9.5C7 10.3284 7.67157 11 8.5 11H9.5C10.3284 11 11 10.3284 11 9.5V8.58579C11 8.26227 11.2623 8 11.5858 8V8C12.1077 8 12.369 7.36902 12 7L10.1716 5.17157C9.52453 4.52453 8.47547 4.52453 7.82843 5.17157L6 7Z" fill="black" />
                </svg>
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
                    <span>• Открытие чека</span>
                  </NavLink>
                </div>
              </div>
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
                  <NavLink to='/import-products'>
                    <span>• Открытие чека</span>
                  </NavLink>
                </div>
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/import'>
                    <span>• Приход товара</span>
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
    </div>
  );
}

export default SideBar;
