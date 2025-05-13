import React from 'react';
import './CryptoList.css';

const CryptoList = ({ cryptoData, onSelectCrypto, selectedCrypto }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

  const formatPercentage = (percentage) => {
    return percentage.toFixed(2) + '%';
  };

  return (
    <div className="crypto-list">
      <h2>Cryptocurrencies</h2>
      <div className="list-header">
        <div className="list-cell rank">Rank</div>
        <div className="list-cell name">Name</div>
        <div className="list-cell price">Price</div>
        <div className="list-cell change">24h %</div>
      </div>
      <div className="list-body">
        {cryptoData.length === 0 ? (
          <div className="no-results">No cryptocurrencies found</div>
        ) : (
          cryptoData.map((crypto) => (
            <div 
              key={crypto.id} 
              className={`list-row ${selectedCrypto && selectedCrypto.id === crypto.id ? 'selected' : ''}`}
              onClick={() => onSelectCrypto(crypto)}
            >
              <div className="list-cell rank">{crypto.market_cap_rank}</div>
              <div className="list-cell name">
                <img src={crypto.image} alt={crypto.name} className="crypto-icon" />
                <div className="crypto-name-container">
                  <span className="crypto-name">{crypto.name}</span>
                  <span className="crypto-symbol">{crypto.symbol.toUpperCase()}</span>
                </div>
              </div>
              <div className="list-cell price">{formatPrice(crypto.current_price)}</div>
              <div className={`list-cell change ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                {formatPercentage(crypto.price_change_percentage_24h)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CryptoList; 