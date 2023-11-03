import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import './DarkMode.css';

const StockChart = () => {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const tickers = ["AAPL", "MSFT", "TSLA", "AMZN", "META"];
        const promises = tickers.map((ticker) =>
          axios.get(`http://localhost:4000/stock/${ticker}`)
        );

        const responses = await Promise.all(promises);

        const stockData = responses.map((response) => ({
          name: response.data.chart.result[0].meta.symbol,
          timestamp: response.data.chart.result[0].timestamp,
          closePrices: response.data.chart.result[0].indicators.quote[0].close,
        }));

        setStockData(stockData);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStockData();
  }, []);

  const chartOptions = {
    chart: {
      type: "line",
      stacked: false,
      height: 350,
    },
    xaxis: {
      categories: stockData.length > 0 ? stockData[0].timestamp.map((timestamp) => new Date(timestamp * 1000).toLocaleTimeString()) : [],
    },
    yaxis: {
      title: {
        text: "Stock Price",
      },
    },
  };

  const chartSeries = stockData.map((stock) => {
    if (stock.closePrices) {
      return {
        name: stock.name,
        data: stock.closePrices,
      };
    } else {
      return {
        name: stock.name,
        data: [], // or any default data you want
      };
    }
  });

  return (
    <div className="App">
      {stockData.map((stock, index) => (
        <div key={stock.name}>
          <h3>{stock.name}</h3>
          <Chart
            options={chartOptions}
            series={[chartSeries[index]]}
            type={chartOptions.chart.type}
            height={chartOptions.chart.height}
          />
        </div>
      ))}
    </div>
  );
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <header className={`header ${isDarkMode ? 'dark-mode' : ''}`}>
        <h1>Stock Market Tracker</h1>
        <button onClick={toggleDarkMode}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>
      <main className={`main ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className={`stock-chart ${isDarkMode ? 'dark-mode' : ''}`}>
          <StockChart/>
        </div>
      </main>
      <footer className={`footer ${isDarkMode ? 'dark-mode' : ''}`}>
        <p>&copy; 2023 Stock Market Tracker</p>
      </footer>
    </div>
  );
}

export default App;
