import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './CryptoChart.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CryptoChart = ({ cryptoId }) => {
  const [chartData, setChartData] = useState(null);
  const [timeframe, setTimeframe] = useState('7');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cryptoDetails, setCryptoDetails] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch historical market data
        const historicalDataResponse = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart`,
          {
            params: {
              vs_currency: 'usd',
              days: timeframe,
            },
          }
        );

        // Fetch crypto details
        const detailsResponse = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${cryptoId}`
        );

        setCryptoDetails(detailsResponse.data);

        const prices = historicalDataResponse.data.prices;
        
        const labels = prices.map((price) => {
          const date = new Date(price[0]);
          return timeframe === '1' 
            ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : date.toLocaleDateString();
        });

        const priceData = prices.map((price) => price[1]);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Price (USD)',
              data: priceData,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 4,
              tension: 0.1,
              fill: true,
            },
          ],
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Failed to load chart data. Please try again later.');
        setLoading(false);
      }
    };

    if (cryptoId) {
      fetchChartData();
    }
  }, [cryptoId, timeframe]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          callback: (value) => {
            return '$' + value.toLocaleString();
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  const timeframeOptions = [
    { value: '1', label: '24h' },
    { value: '7', label: '7d' },
    { value: '30', label: '30d' },
    { value: '90', label: '90d' },
    { value: '365', label: '1y' },
  ];

  if (!cryptoId) {
    return (
      <div className="chart-placeholder">
        <p>Select a cryptocurrency to view its price chart</p>
      </div>
    );
  }

  if (loading) {
    return <div className="chart-loading">Loading chart data...</div>;
  }

  if (error) {
    return <div className="chart-error">{error}</div>;
  }

  return (
    <div className="crypto-chart">
      {cryptoDetails && (
        <div className="crypto-details">
          <div className="crypto-header">
            <img src={cryptoDetails.image.small} alt={cryptoDetails.name} />
            <h2>{cryptoDetails.name} Price Chart</h2>
          </div>
          <div className="crypto-price">
            <span className="current-price">
              ${cryptoDetails.market_data.current_price.usd.toLocaleString()}
            </span>
            <span 
              className={`price-change ${cryptoDetails.market_data.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}
            >
              {cryptoDetails.market_data.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        </div>
      )}

      <div className="timeframe-selector">
        {timeframeOptions.map((option) => (
          <button
            key={option.value}
            className={`timeframe-button ${timeframe === option.value ? 'active' : ''}`}
            onClick={() => setTimeframe(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="chart-container">
        {chartData && <Line data={chartData} options={chartOptions} />}
      </div>

      {cryptoDetails && (
        <div className="market-info">
          <div className="info-item">
            <span className="info-label">Market Cap</span>
            <span className="info-value">${cryptoDetails.market_data.market_cap.usd.toLocaleString()}</span>
          </div>
          <div className="info-item">
            <span className="info-label">24h Volume</span>
            <span className="info-value">${cryptoDetails.market_data.total_volume.usd.toLocaleString()}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Circulating Supply</span>
            <span className="info-value">{cryptoDetails.market_data.circulating_supply.toLocaleString()} {cryptoDetails.symbol.toUpperCase()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoChart; 