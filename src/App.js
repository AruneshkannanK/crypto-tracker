import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import CryptoList from './components/CryptoList';
import CryptoChart from './components/CryptoChart';
import SearchBar from './components/SearchBar';

function App() {
  const [cryptoData, setCryptoData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: 50,
              page: 1,
              sparkline: false,
            },
          }
        );
        setCryptoData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch cryptocurrency data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = cryptoData.filter((crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleCryptoSelect = (crypto) => {
    setSelectedCrypto(crypto);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Crypto Tracker</h1>
        <SearchBar onSearch={handleSearch} />
      </header>
      <main className="App-main">
        <div className="container">
          <div className="row">
            <div className="col">
              <CryptoList 
                cryptoData={filteredData} 
                onSelectCrypto={handleCryptoSelect}
                selectedCrypto={selectedCrypto}
              />
            </div>
            <div className="col">
              {selectedCrypto && <CryptoChart cryptoId={selectedCrypto.id} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
