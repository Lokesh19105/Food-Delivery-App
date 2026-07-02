import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Moon, Sun, MapPin, Search, ChevronDown, Award, Bike } from 'lucide-react';

export default function Navbar({ onSearchChange, searchQuery }) {
  const { cart, activeView, setActiveView, theme, toggleTheme, activeOrder, getTotal } = useCart();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Indiranagar, Bengaluru');

  const locations = [
    'Indiranagar, Bengaluru',
    'Koramangala, Bengaluru',
    'HSR Layout, Bengaluru',
    'Whitefield, Bengaluru',
    'Connaught Place, New Delhi',
    'Juhu, Mumbai',
  ];

  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <>
      <nav className="glass sticky-nav">
        <div className="container nav-container">
          {/* Logo */}
          <div className="nav-left" onClick={() => setActiveView('home')}>
            <span className="logo-icon">🍔</span>
            <span className="logo-text">Yumzy</span>
          </div>

          {/* Location Selector */}
          <div className="nav-location" onClick={() => setShowLocationModal(true)}>
            <MapPin size={18} className="loc-icon" />
            <span className="loc-text">{selectedLocation}</span>
            <ChevronDown size={14} className="loc-arrow" />
          </div>

          {/* Search bar (only visible on Home View) */}
          <div className="nav-center">
            {activeView === 'home' && (
              <div className="search-container">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for restaurants, cuisines, or dishes..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="search-input"
                />
              </div>
            )}
          </div>

          {/* Nav Actions */}
          <div className="nav-right">
            {/* Active Order Shortcut */}
            {activeOrder && (
              <button 
                className="btn-order-tracking" 
                onClick={() => setActiveView('tracking')}
                title="Track Active Order"
              >
                <Bike size={18} className="spin-slow" />
                <span className="hide-mobile">Track Order</span>
                <span className="order-dot"></span>
              </button>
            )}

            {/* Theme Toggle */}
            <button className="btn-theme" onClick={toggleTheme} title="Toggle Dark/Light Mode">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Cart Widget */}
            <button 
              className={`nav-cart ${cartItemsCount > 0 ? 'pulse-cart' : ''}`}
              onClick={() => {
                if (cart.length > 0) {
                  setActiveView('checkout');
                } else {
                  alert('Your cart is empty! Add some delicious dishes first.');
                }
              }}
            >
              <div className="cart-icon-wrapper">
                <ShoppingBag size={20} />
                {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
              </div>
              <span className="cart-total hide-mobile">
                {cartItemsCount > 0 ? `₹${getTotal()}` : 'Cart'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Location Selection Modal */}
      {showLocationModal && (
        <div className="modal-overlay animate-fade-in" onClick={() => setShowLocationModal(false)}>
          <div className="modal-content animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Select Delivery Location</h3>
            <div className="location-list">
              {locations.map((loc) => (
                <div
                  key={loc}
                  className={`location-item ${selectedLocation === loc ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setShowLocationModal(false);
                  }}
                >
                  <MapPin size={18} />
                  <span>{loc}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-secondary w-full" onClick={() => setShowLocationModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Styled Nav CSS */}
      <style>{`
        .sticky-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background-color: var(--bg-glass);
          border-bottom: 1px solid var(--border);
          transition: background-color var(--transition-normal);
        }
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          gap: 16px;
        }
        .nav-left {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .logo-icon {
          font-size: 28px;
          animation: float 3s ease-in-out infinite;
        }
        .logo-text {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 24px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.03em;
        }
        .nav-location {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          background-color: rgba(255, 75, 26, 0.05);
          cursor: pointer;
          transition: all var(--transition-fast);
          max-width: 220px;
        }
        .nav-location:hover {
          background-color: rgba(255, 75, 26, 0.1);
        }
        .loc-icon {
          color: var(--primary);
          flex-shrink: 0;
        }
        .loc-text {
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--text-primary);
        }
        .loc-arrow {
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .nav-center {
          flex: 1;
          max-width: 500px;
          display: flex;
          justify-content: center;
        }
        .search-container {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 16px;
          color: var(--text-muted);
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          border-radius: var(--radius-full);
          border: 1.5px solid var(--border);
          background-color: var(--bg-card);
          color: var(--text-primary);
          outline: none;
          font-family: var(--font-body);
          font-size: 14px;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-sm);
        }
        .search-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(255, 75, 26, 0.15), var(--shadow-md);
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .btn-theme {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-primary);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-full);
          transition: background-color var(--transition-fast);
        }
        .btn-theme:hover {
          background-color: var(--border);
        }
        .btn-order-tracking {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: rgba(34, 197, 94, 0.1);
          color: rgb(34, 197, 94);
          border: none;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          position: relative;
          transition: all var(--transition-fast);
        }
        .btn-order-tracking:hover {
          background-color: rgba(34, 197, 94, 0.15);
          transform: translateY(-1px);
        }
        .order-dot {
          width: 8px;
          height: 8px;
          background-color: rgb(34, 197, 94);
          border-radius: 50%;
          position: absolute;
          top: -2px;
          right: -2px;
          box-shadow: 0 0 0 3px var(--bg-card);
          animation: pulseGlow 1.5s infinite;
        }
        .nav-cart {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: var(--primary);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(255, 75, 26, 0.2);
          transition: all var(--transition-fast);
        }
        .nav-cart:hover {
          background-color: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 75, 26, 0.3);
        }
        .cart-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .cart-badge {
          background-color: var(--secondary);
          color: white;
          font-size: 10px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: -8px;
          right: -8px;
          font-weight: 800;
          border: 1.5px solid var(--primary);
        }
        .spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Modal styling */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(4px);
        }
        .modal-content {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          width: 100%;
          max-width: 400px;
          box-shadow: var(--shadow-lg);
        }
        .modal-title {
          font-size: 18px;
          margin-bottom: 16px;
        }
        .location-list {
          display: flex;
          flex-col;
          gap: 8px;
          margin-bottom: 20px;
        }
        .location-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--border);
          cursor: pointer;
          transition: all var(--transition-fast);
          font-weight: 500;
        }
        .location-item:hover {
          background-color: rgba(255, 75, 26, 0.03);
          border-color: var(--primary);
          color: var(--primary);
        }
        .location-item.active {
          background-color: rgba(255, 75, 26, 0.08);
          border-color: var(--primary);
          color: var(--primary);
        }
        .pulse-cart {
          animation: pulseGlow 2s infinite;
        }

        @media (max-width: 768px) {
          .hide-mobile {
            display: none;
          }
          .nav-location {
            max-width: 120px;
          }
        }
      `}</style>
    </>
  );
}
