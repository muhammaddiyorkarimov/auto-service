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
import { FaUsers } from 'react-icons/fa';

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
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.25029 0.191517C8.50203 0.0655716 8.77964 0 9.06113 0C9.34261 0 9.62023 0.0655716 9.87197 0.191517L17.1209 3.81597C17.7339 4.12249 18.1223 4.75004 18.1223 5.43662V17.2233C18.1223 17.4293 18.0404 17.6269 17.8948 17.7725C17.7491 17.9182 17.5516 18 17.3456 18C17.1396 18 16.9421 17.9182 16.7964 17.7725C16.6507 17.6269 16.5689 17.4293 16.5689 17.2233V5.43662C16.569 5.38849 16.5557 5.34129 16.5304 5.30031C16.5052 5.25934 16.469 5.22621 16.426 5.20465L9.17711 1.5802C9.14111 1.56216 9.1014 1.55277 9.06113 1.55277C9.02086 1.55277 8.98115 1.56216 8.94515 1.5802L1.69624 5.20465C1.65322 5.22621 1.61705 5.25934 1.59181 5.30031C1.56656 5.34129 1.55324 5.38849 1.55334 5.43662V17.2233C1.55334 17.4293 1.47151 17.6269 1.32586 17.7725C1.1802 17.9182 0.982653 18 0.776668 18C0.570683 18 0.373134 17.9182 0.227481 17.7725C0.0818272 17.6269 0 17.4293 0 17.2233V5.43662C0 4.75004 0.388334 4.12249 1.00138 3.81597L8.25029 0.191517ZM3.10667 8.93887C3.10667 7.93852 3.91855 7.12665 4.9189 7.12665H13.2034C14.2037 7.12665 15.0156 7.93852 15.0156 8.93887V16.1878C15.0156 16.6684 14.8247 17.1294 14.4848 17.4692C14.1449 17.8091 13.684 18 13.2034 18H4.9189C4.43827 18 3.97732 17.8091 3.63746 17.4692C3.2976 17.1294 3.10667 16.6684 3.10667 16.1878V8.93887ZM4.9189 8.67998C4.85024 8.67998 4.78439 8.70726 4.73584 8.75581C4.68728 8.80436 4.66001 8.87021 4.66001 8.93887V8.93887C4.66001 9.65377 5.23955 10.2333 5.95446 10.2333H12.1678C12.8827 10.2333 13.4622 9.65377 13.4622 8.93887V8.93887C13.4622 8.87021 13.435 8.80436 13.3864 8.75581C13.3379 8.70726 13.272 8.67998 13.2034 8.67998H4.9189ZM13.4622 12.5633C13.4622 12.1344 13.1145 11.7867 12.6856 11.7867H5.43668C5.00774 11.7867 4.66001 12.1344 4.66001 12.5633V12.5633C4.66001 12.9923 5.00774 13.34 5.43668 13.34H12.6856C13.1145 13.34 13.4622 12.9923 13.4622 12.5633V12.5633ZM13.4622 16.1878C13.4622 15.4729 12.8827 14.8933 12.1678 14.8933H5.95445C5.23955 14.8933 4.66001 15.4729 4.66001 16.1878V16.1878C4.66001 16.3307 4.77599 16.4467 4.9189 16.4467H13.2034C13.272 16.4467 13.3379 16.4194 13.3864 16.3708C13.435 16.3223 13.4622 16.2564 13.4622 16.1878V16.1878Z" fill="black" />
                </svg>
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
                <i class="fa-solid fa-money-bill-transfer"></i>
                <span>Расходы</span>
              </div>
              <div className="li-items">
                <div className={({ isActive }) => isActive ? "active li-item" : "li-item"}>
                  <span></span>
                  <NavLink to='/expenses'>
                    <span>• Расходы</span>
                  </NavLink>
                </div>
              </div>
            </li>
            <li>
              <hr />
              <div className="link-title">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 2C0 0.89543 0.89543 0 2 0H16C17.1046 0 18 0.89543 18 2V16C18 17.1046 17.1046 18 16 18H2C0.89543 18 0 17.1046 0 16V2ZM3.8 1.8C2.69543 1.8 1.8 2.69543 1.8 3.8V7.2009C1.8 7.69746 2.20254 8.1 2.6991 8.1H3.5973C3.5978 8.1 3.5982 8.0996 3.5982 8.0991V8.0991C3.5982 8.0986 3.5986 8.0982 3.5991 8.0982H5.4009C5.4014 8.0982 5.4018 8.0986 5.4018 8.0991V8.0991C5.4018 8.0996 5.4022 8.1 5.4027 8.1H14.2C15.3046 8.1 16.2 7.20457 16.2 6.1V3.8C16.2 2.69543 15.3046 1.8 14.2 1.8H3.8ZM16.2 11.9C16.2 10.7954 15.3046 9.9 14.2 9.9H5.4027C5.4022 9.9 5.4018 9.9004 5.4018 9.9009V9.9009C5.4018 9.9014 5.4014 9.9018 5.4009 9.9018H3.5991C3.5986 9.9018 3.5982 9.9014 3.5982 9.9009V9.9009C3.5982 9.9004 3.5978 9.9 3.5973 9.9H2.6991C2.20254 9.9 1.8 10.3025 1.8 10.7991V14.2C1.8 15.3046 2.69543 16.2 3.8 16.2H14.2C15.3046 16.2 16.2 15.3046 16.2 14.2V11.9ZM3.5982 4.9518C3.5982 4.45375 4.00195 4.05 4.5 4.05V4.05C4.99805 4.05 5.4018 4.45375 5.4018 4.9518V4.9518C5.4018 5.44985 4.99805 5.8536 4.5 5.8536V5.8536C4.00195 5.8536 3.5982 5.44985 3.5982 4.9518V4.9518ZM3.5982 13.0518C3.5982 12.5537 4.00195 12.15 4.5 12.15V12.15C4.99805 12.15 5.4018 12.5537 5.4018 13.0518V13.0518C5.4018 13.5498 4.99805 13.9536 4.5 13.9536V13.9536C4.00195 13.9536 3.5982 13.5498 3.5982 13.0518V13.0518Z" fill="black" />
                </svg>
                <span>Прочие</span>
              </div>
              <div className="li-items">
                {/* {user?.role === 'Admin' && (

                )} */}
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
              </div>
            </li>
            <li>
              <hr />
              <div className="link-title">
                <FaUsers />
                <span>Пользователи</span>
              </div>
              <div className="li-items">
                <li>
                  <div className="li-item">
                    <span></span>
                    <NavLink to='/employees'>
                      <span>• Сотрудники</span>
                    </NavLink>
                  </div>
                </li>
                <li>
                  <div className="li-item">
                    <span></span>
                    <NavLink to='/managers'>
                      <span>• Менеджер</span>
                    </NavLink>
                  </div>
                </li>
                <li>
                  <div className="li-item">
                    <span></span>
                    <NavLink to='/workers'>
                      <span>• Работники</span>
                    </NavLink>
                  </div>
                </li>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
