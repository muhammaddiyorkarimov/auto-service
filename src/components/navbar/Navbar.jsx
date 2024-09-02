// icons
import { CiUser } from 'react-icons/ci';
import { FaSignOutAlt } from 'react-icons/fa';
// css
import './navbar.css';
import { useSidebar } from '../../context/SidebarContext';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { logoutUser } from '../../features/slice/authSlice';

function Navbar({ title }) {
  const { toggleSidebar } = useSidebar();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('first_name', user.first_name);
      localStorage.setItem('last_name', user.last_name);
      localStorage.setItem('position', user.position);
    }
  }, [user]);

  const firstName = localStorage.getItem('first_name') || '';
  const lastName = localStorage.getItem('last_name') || '';
  const position = localStorage.getItem('position') || '';

  const handleLogout = () => {
    dispatch(logoutUser());
    window.location.href = '/login';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.navbar-in-user')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='navbar'>
      <div className="navbar-item">
        <i onClick={toggleSidebar} className="fa-solid fa-bars"></i>
        <div className="title">{title}</div>
      </div>
      <div className="navbar-in-user" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <div className="user-image">
          <CiUser />
        </div>
        <div className="user-info">
          <p>{`${firstName} ${lastName}`}</p>
          <span>{position}</span>
        </div>
        {isDropdownOpen && (
          <>
            <div className="overlay"></div>
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={handleLogout}>
                <FaSignOutAlt className="dropdown-icon" />
                Выход
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
