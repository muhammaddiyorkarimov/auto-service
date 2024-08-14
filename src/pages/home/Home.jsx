import React, { useEffect } from 'react';
import ActiveReports from '../../components/activeReports/ActiveReports';
import PieChartC from '../../components/pieChart/PieChart';
import SideBar from '../../components/sidebar/SideBar';
import Navbar from '../../components/navbar/Navbar';
import useFetch from '../../hooks/useFetch';
import Statistics from '../../services/landing/statistics';
import './home.css';
import TopTableComponent from './TopTableComponent';
import img2 from '../../images/xarajatIcon.png';
import img1 from '../../images/foydaIcon.png'; // Replace with actual image paths
import img3 from '../../images/daromadIcon.png';

function Home() {
  const { data: topProducts, loading: topProductsLoading, error: topProductsError } = useFetch(Statistics.getTopProducts);
  const { data: topCustomers, loading: topCustomersLoading, error: topCustomersError } = useFetch(Statistics.getTopCustomers);
  const { data: topCalculate, loading: topCalculateLoading, error: topCalculateError } = useFetch(Statistics.getTopCalculate);

  const productColumns = ["Name", "Amount", "Total Benefit"];
  const customerColumns = ["Full Name", "Total Paid", "Orders Count"];

  const productData = topProducts ? topProducts.map(product => ({
    name: product.product.name,
    amount: formatNumberWithCommas(product.product.amount),
    total_benefit: formatNumberWithCommas(product.product.total_benefit),
  })) : [];

  const customerData = topCustomers ? topCustomers.map(customer => ({
    full_name: customer.customer_full_name,
    total_paid: customer.total_paid ? formatNumberWithCommas(customer.total_paid) : "N/A",
    orders_count: customer.orders_count,
  })) : [];

  const calculateData = topCalculate ? [
    { title: "Jami Import", value: formatNumberWithCommas(topCalculate.total_import), img: img1 },
    { title: "Jami Export", value: formatNumberWithCommas(topCalculate.total_export), img: img2 },
    { title: "Daromad", value: formatNumberWithCommas(topCalculate.total_benefit), img: img3 },
  ] : [];

  function formatNumberWithCommas(number) {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div className="home">
      <SideBar />
      <main>
        <Navbar title="Asosiy" />
        <div className="extra-items">
          <div className="header">
            <div className="items">
              {calculateData?.map((item, index) => (
                <div className="item" key={index}>
                  <div className="about">
                    <div className="title">{item.title}</div>
                    <div className="description">{item.value}</div>
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
            <PieChartC />
          </div>
          <div className="footer">
            <div className="cards">
              <div className="top-products">
                <div className="title">Top tovarlar</div>
                <TopTableComponent columns={productColumns} data={productData} />
              </div>
              <div className="top-customers">
                <div className="title">Top mijozlar</div>
                <TopTableComponent columns={customerColumns} data={customerData} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
