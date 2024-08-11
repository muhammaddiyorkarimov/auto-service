// import DataTable from '../../components/dataTable/DataTable'
import ActiveReports from '../../components/activeReports/ActiveReports'
import Navbar from '../../components/navbar/Navbar'
import PieChartC from '../../components/pieChart/PieChart'
import SideBar from '../../components/sidebar/SideBar'
import './home.css'
function Home() {
  return (
    <div className="home">
      <SideBar />
      <main>
        <Navbar title="Asosiy" />
        <div className="extra-items">
          <div className="header"></div>
          <div className="main">
            <ActiveReports />
            <PieChartC />
          </div>
          <div className="footer">
            <div className="cards">
              <div className="card">
                
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home