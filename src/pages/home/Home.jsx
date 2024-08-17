import React from 'react';
import ActiveReports from '../../components/activeReports/ActiveReports';
import PieChartC from '../../components/pieChart/PieChart';
import SideBar from '../../components/sidebar/SideBar';
import Navbar from '../../components/navbar/Navbar';
import useFetch from '../../hooks/useFetch';
import Statistics from '../../services/landing/statistics';
import './home.css';
import TopTableComponent from './TopTableComponent';
import img2 from '../../images/xarajatIcon.png';
import img1 from '../../images/foydaIcon.png';
import img3 from '../../images/daromadIcon.png';
import { BiLoader } from 'react-icons/bi';

function Home() {
  const { data: topProducts, loading: topProductsLoading, error: topProductsError } = useFetch(Statistics.getTopProducts);
  const { data: topCalculate, loading: topCalculateLoading, error: topCalculateError } = useFetch(Statistics.getTopCalculate);

  const productColumns = ["Name", "Amount", "Total Benefit"];

  const productData = topProducts ? topProducts.map(product => ({
    name: product.product.name,
    amount: formatNumberWithCommas(product.product.amount),
    total_benefit: formatNumberWithCommas(product.product.total_benefit),
  })) : [];

  const calculateData = topCalculate ? [
    { title: "Jami Import", value: formatNumberWithCommas(topCalculate.total_import), img: img1 },
    { title: "Jami Export", value: formatNumberWithCommas(topCalculate.total_export), img: img2 },
    { title: "Daromad", value: formatNumberWithCommas(topCalculate.total_benefit), img: img3 },
  ] : [];

  function formatNumberWithCommas(number) {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const descriptionColors = ["#c70000", "green", "blue"];

  return (
    <div className="home">
      <SideBar />
      <main>
        <Navbar title="Asosiy" />
        <div className="extra-items">
          <div className="header">
            <div className="items">
              {topCalculateError ? <p>{error}</p> : calculateData?.map((item, index) => (
                <div className="item" key={index}>
                  <div className="about">
                    {topCalculateLoading ? <BiLoader /> : <>
                      <div className="title">{item.title}</div>
                      <div className="description" style={{ color: descriptionColors[index] }}>
                        UZS {item.value}
                      </div>
                    </>}
                  </div>
                  <div className="img">
                    <img src={item.img} alt={item.title} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="main">
            <ActiveReports />
          </div>
          <div className="footer">
            <div className="cards">
              <div className="top-products">
                <div className="title">Top tovarlar</div>
                <TopTableComponent loading={topProductsLoading} error={topProductsError} columns={productColumns} data={productData} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
