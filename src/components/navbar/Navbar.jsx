// icons
import { CiUser } from 'react-icons/ci'
// css
import './navbar.css'
import { useSidebar } from '../../context/SidebarContext'

function Navbar({ title, name, adminType }) {

  const { toggleSidebar } = useSidebar()
  
  return (
    <div className='navbar'>
      <div className="navbar-item">
        <i onClick={toggleSidebar} className="fa-solid fa-bars"></i>
        <div className="title">{title}</div>
      </div>
      <div className="navbar-in-user">
        <div className="user-image">
          <CiUser />
        </div>
        {/* <div className="user-info">
          <p>User</p>
          <span>Super Admin</span>
        </div> */}
      </div>
    </div>
  )
}

export default Navbar