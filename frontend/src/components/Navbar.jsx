import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Moon, Sun, MapPin, Search, ChevronDown, Bike, LogOut, User as UserIcon, X, CheckCircle2 } from 'lucide-react';

export default function Navbar({ onSearchChange, searchQuery }) {
  const { 
    cart, 
    activeView, 
    setActiveView, 
    theme, 
    toggleTheme, 
    activeOrder, 
    getTotal,
    locations,
    selectedState,
    setSelectedState,
    selectedDistrict,
    setSelectedDistrict,
    selectedVillage,
    setSelectedVillage,
    currentUser,
    handleLogout
  } = useCart();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [stateSearch, setStateSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [areaSearch, setAreaSearch] = useState('');
  const [step, setStep] = useState(1); // 1=state, 2=district, 3=area
  const modalRef = useRef(null);
  const stateInputRef = useRef(null);

  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  // States list - sorted alphabetically
  const states = useMemo(() => {
    return locations.filter(loc => loc.level === 'STATE').sort((a, b) => a.name.localeCompare(b.name));
  }, [locations]);

  // Districts list based on selected State
  const districts = useMemo(() => {
    if (!selectedState) return [];
    return locations.filter(loc => loc.level === 'DISTRICT' && loc.parentId === selectedState.id).sort((a, b) => a.name.localeCompare(b.name));
  }, [locations, selectedState]);

  // Areas list based on selected District
  const areas = useMemo(() => {
    if (!selectedDistrict) return [];
    return locations.filter(loc => loc.level === 'VILLAGE' && loc.parentId === selectedDistrict.id).sort((a, b) => a.name.localeCompare(b.name));
  }, [locations, selectedDistrict]);

  // Filtered lists based on search
  const filteredStates = useMemo(() => {
    if (!stateSearch.trim()) return states;
    return states.filter(s => s.name.toLowerCase().includes(stateSearch.toLowerCase()));
  }, [states, stateSearch]);

  const filteredDistricts = useMemo(() => {
    if (!districtSearch.trim()) return districts;
    return districts.filter(d => d.name.toLowerCase().includes(districtSearch.toLowerCase()));
  }, [districts, districtSearch]);

  const filteredAreas = useMemo(() => {
    if (!areaSearch.trim()) return areas;
    return areas.filter(a => a.name.toLowerCase().includes(areaSearch.toLowerCase()));
  }, [areas, areaSearch]);

  const locationDisplayText = useMemo(() => {
    if (selectedVillage) return `${selectedVillage.name}`;
    if (selectedDistrict) return `${selectedDistrict.name}`;
    if (selectedState) return selectedState.name;
    return 'Select Location';
  }, [selectedState, selectedDistrict, selectedVillage]);

  const locationSubText = useMemo(() => {
    if (selectedVillage && selectedState) return `${selectedDistrict?.name}, ${selectedState.name}`;
    if (selectedDistrict && selectedState) return selectedState.name;
    return null;
  }, [selectedState, selectedDistrict, selectedVillage]);

  // Close modal on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowLocationModal(false);
      }
    }
    if (showLocationModal) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => stateInputRef.current?.focus(), 100);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLocationModal]);

  const openLocationPicker = () => {
    setShowLocationModal(true);
    // Reset to current step
    if (!selectedState) setStep(1);
    else if (!selectedDistrict) setStep(2);
    else setStep(3);
  };

  const handleSelectState = (stateObj) => {
    setSelectedState(stateObj);
    setSelectedDistrict(null);
    setSelectedVillage(null);
    setDistrictSearch('');
    setAreaSearch('');
    setStep(2);
  };

  const handleSelectDistrict = (distObj) => {
    setSelectedDistrict(distObj);
    setSelectedVillage(null);
    setAreaSearch('');
    setStep(3);
  };

  const handleSelectArea = (areaObj) => {
    setSelectedVillage(areaObj);
    setShowLocationModal(false);
    setStateSearch('');
    setDistrictSearch('');
    setAreaSearch('');
  };

  const clearLocation = () => {
    setSelectedState(null);
    setSelectedDistrict(null);
    setSelectedVillage(null);
    setStateSearch('');
    setDistrictSearch('');
    setAreaSearch('');
    setStep(1);
  };

  const confirmWithDistrict = () => {
    setShowLocationModal(false);
    setStateSearch('');
    setDistrictSearch('');
    setAreaSearch('');
  };

  return (
    <>
      <nav className="sticky-nav glass">
        <div className="container nav-container">
          {/* Logo */}
          <div className="nav-left" onClick={() => setActiveView('home')}>
            <span className="logo-icon">🧞‍♂️</span>
            <div className="logo-text-group">
              <span className="logo-text">FoodGenie AI</span>
              <span className="logo-tagline">Powered by AI</span>
            </div>
          </div>

          {/* Location Picker */}
          <button className="nav-location" onClick={openLocationPicker} id="location-picker-btn">
            <MapPin size={16} className="loc-icon" />
            <div className="loc-info">
              <span className="loc-main">{locationDisplayText}</span>
              {locationSubText && <span className="loc-sub">{locationSubText}</span>}
            </div>
            <ChevronDown size={13} className={`loc-arrow ${showLocationModal ? 'rotated' : ''}`} />
          </button>

          {/* Search bar (only visible on Home View) */}
          <div className="nav-center">
            {activeView === 'home' && (
              <div className="search-container">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search restaurants, dishes..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button className="search-clear" onClick={() => onSearchChange('')}>
                    <X size={14} />
                  </button>
                )}
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
                <Bike size={16} className="spin-slow" />
                <span className="hide-mobile">Track Order</span>
                <span className="order-dot"></span>
              </button>
            )}

            {/* Profile / Dashboard */}
            {currentUser ? (
              <div className="user-profile-menu">
                <button 
                  className="btn-user"
                  onClick={() => {
                    if (currentUser.role === 'RESTAURANT') setActiveView('dashboard-res');
                    else if (currentUser.role === 'ADMIN') setActiveView('dashboard-admin');
                  }}
                >
                  <div className="user-avatar">{currentUser.username?.charAt(0).toUpperCase()}</div>
                  <span className="hide-mobile user-name">{currentUser.username}</span>
                </button>
                <button className="btn-logout" onClick={handleLogout} title="Logout">
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button className="btn btn-primary btn-login-nav" onClick={() => setActiveView('auth')}>
                Sign In
              </button>
            )}

            {/* Theme Toggle */}
            <button className="btn-icon btn-theme" onClick={toggleTheme} title="Toggle Mode">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Cart Widget */}
            <button 
              className={`nav-cart ${cartItemsCount > 0 ? 'has-items' : ''}`}
              onClick={() => {
                if (cart.length > 0) setActiveView('checkout');
                else alert('Your cart is empty! Browse restaurants to add items.');
              }}
            >
              <div className="cart-icon-wrapper">
                <ShoppingBag size={18} />
                {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
              </div>
              <span className="cart-total hide-mobile">
                {cartItemsCount > 0 ? `₹${getTotal()}` : 'Cart'}
              </span>
            </button>
          </div>
        </div>

        {/* Location Modal */}
        {showLocationModal && (
          <div className="loc-modal-overlay">
            <div className="loc-modal card" ref={modalRef}>
              <div className="loc-modal-head">
                <div className="loc-modal-title">
                  <MapPin size={18} className="loc-modal-icon" />
                  <h3>Choose Delivery Location</h3>
                </div>
                <button className="loc-close-btn" onClick={() => setShowLocationModal(false)}>
                  <X size={18} />
                </button>
              </div>

              {/* Breadcrumb progress */}
              <div className="loc-breadcrumb">
                <button 
                  className={`loc-crumb ${step === 1 ? 'active' : selectedState ? 'done' : ''}`}
                  onClick={() => setStep(1)}
                >
                  {selectedState && step > 1 ? <CheckCircle2 size={12} /> : <span className="crumb-num">1</span>}
                  <span>{selectedState ? selectedState.name : 'State'}</span>
                </button>
                <div className="crumb-divider" />
                <button 
                  className={`loc-crumb ${step === 2 ? 'active' : selectedDistrict ? 'done' : ''}`}
                  onClick={() => selectedState && setStep(2)}
                  disabled={!selectedState}
                >
                  {selectedDistrict && step > 2 ? <CheckCircle2 size={12} /> : <span className="crumb-num">2</span>}
                  <span>{selectedDistrict ? selectedDistrict.name : 'District'}</span>
                </button>
                <div className="crumb-divider" />
                <button 
                  className={`loc-crumb ${step === 3 ? 'active' : selectedVillage ? 'done' : ''}`}
                  onClick={() => selectedDistrict && setStep(3)}
                  disabled={!selectedDistrict}
                >
                  {selectedVillage ? <CheckCircle2 size={12} /> : <span className="crumb-num">3</span>}
                  <span>{selectedVillage ? selectedVillage.name : 'Area'}</span>
                </button>
              </div>

              {/* Step 1: State */}
              {step === 1 && (
                <div className="loc-step">
                  <div className="loc-search-box">
                    <Search size={15} />
                    <input
                      ref={stateInputRef}
                      type="text"
                      placeholder="Search state or UT..."
                      value={stateSearch}
                      onChange={e => setStateSearch(e.target.value)}
                      className="loc-search-input"
                    />
                    {stateSearch && <button onClick={() => setStateSearch('')}><X size={13} /></button>}
                  </div>
                  <div className="loc-list">
                    {filteredStates.length === 0 ? (
                      <div className="loc-empty">No states found for "{stateSearch}"</div>
                    ) : filteredStates.map(s => (
                      <button 
                        key={s.id} 
                        className={`loc-item ${selectedState?.id === s.id ? 'selected' : ''}`}
                        onClick={() => handleSelectState(s)}
                      >
                        <MapPin size={13} className="loc-item-icon" />
                        <span>{s.name}</span>
                        {selectedState?.id === s.id && <CheckCircle2 size={14} className="loc-check" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: District */}
              {step === 2 && (
                <div className="loc-step">
                  <div className="loc-search-box">
                    <Search size={15} />
                    <input
                      autoFocus
                      type="text"
                      placeholder={`Search district in ${selectedState?.name}...`}
                      value={districtSearch}
                      onChange={e => setDistrictSearch(e.target.value)}
                      className="loc-search-input"
                    />
                    {districtSearch && <button onClick={() => setDistrictSearch('')}><X size={13} /></button>}
                  </div>
                  <div className="loc-list">
                    {filteredDistricts.length === 0 ? (
                      <div className="loc-empty">No districts found for "{districtSearch}"</div>
                    ) : filteredDistricts.map(d => (
                      <button 
                        key={d.id} 
                        className={`loc-item ${selectedDistrict?.id === d.id ? 'selected' : ''}`}
                        onClick={() => handleSelectDistrict(d)}
                      >
                        <MapPin size={13} className="loc-item-icon" />
                        <span>{d.name}</span>
                        {selectedDistrict?.id === d.id && <CheckCircle2 size={14} className="loc-check" />}
                      </button>
                    ))}
                  </div>
                  <div className="loc-step-footer">
                    <button className="loc-skip-btn" onClick={confirmWithDistrict}>
                      Use {selectedDistrict?.name || 'District'} without specifying area
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Area/Locality */}
              {step === 3 && (
                <div className="loc-step">
                  <div className="loc-search-box">
                    <Search size={15} />
                    <input
                      autoFocus
                      type="text"
                      placeholder={`Search area in ${selectedDistrict?.name}...`}
                      value={areaSearch}
                      onChange={e => setAreaSearch(e.target.value)}
                      className="loc-search-input"
                    />
                    {areaSearch && <button onClick={() => setAreaSearch('')}><X size={13} /></button>}
                  </div>
                  <div className="loc-list">
                    {filteredAreas.length === 0 && areaSearch && (
                      <div className="loc-empty">No areas found for "{areaSearch}"</div>
                    )}
                    {filteredAreas.length === 0 && !areaSearch && (
                      <div className="loc-empty-tip">Type to search areas in {selectedDistrict?.name}</div>
                    )}
                    {filteredAreas.map(a => (
                      <button 
                        key={a.id} 
                        className={`loc-item ${selectedVillage?.id === a.id ? 'selected' : ''}`}
                        onClick={() => handleSelectArea(a)}
                      >
                        <MapPin size={13} className="loc-item-icon" />
                        <span>{a.name}</span>
                        {selectedVillage?.id === a.id && <CheckCircle2 size={14} className="loc-check" />}
                      </button>
                    ))}
                  </div>
                  <div className="loc-step-footer">
                    <button className="loc-skip-btn" onClick={confirmWithDistrict}>
                      Deliver to {selectedDistrict?.name}
                    </button>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="loc-modal-footer">
                <button className="loc-clear-btn" onClick={clearLocation}>
                  <X size={13} /> Clear Location
                </button>
                {(selectedState || selectedDistrict || selectedVillage) && (
                  <div className="loc-selected-summary">
                    <MapPin size={12} />
                    <span>
                      {[selectedVillage?.name, selectedDistrict?.name, selectedState?.name].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        /* ===== NAVBAR CORE ===== */
        .sticky-nav {
          position: sticky;
          top: 0;
          z-index: 500;
          background: var(--bg-glass);
          backdrop-filter: blur(20px) saturate(200%);
          -webkit-backdrop-filter: blur(20px) saturate(200%);
          border-bottom: 1px solid var(--border);
          transition: background var(--transition-normal);
        }
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 68px;
          gap: 12px;
        }

        /* Logo */
        .nav-left {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          flex-shrink: 0;
        }
        .logo-icon {
          font-size: 30px;
          line-height: 1;
          filter: drop-shadow(0 2px 8px rgba(255,75,26,0.3));
        }
        .logo-text-group {
          display: flex;
          flex-direction: column;
        }
        .logo-text {
          font-family: var(--font-heading);
          font-weight: 850;
          font-size: 20px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .logo-tagline {
          font-size: 9px;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
        }

        /* Location Picker */
        .nav-location {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          background: rgba(255,75,26,0.06);
          border: 1.5px solid transparent;
          cursor: pointer;
          transition: all var(--transition-fast);
          max-width: 220px;
          flex-shrink: 0;
        }
        .nav-location:hover {
          background: rgba(255,75,26,0.12);
          border-color: rgba(255,75,26,0.2);
          transform: translateY(-1px);
        }
        .loc-icon { color: var(--primary); flex-shrink: 0; }
        .loc-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
          text-align: left;
        }
        .loc-main {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.2;
        }
        .loc-sub {
          font-size: 10px;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 500;
        }
        .loc-arrow {
          color: var(--text-muted);
          flex-shrink: 0;
          transition: transform var(--transition-fast);
        }
        .loc-arrow.rotated { transform: rotate(180deg); }

        /* Search */
        .nav-center {
          flex: 1;
          max-width: 400px;
          display: flex;
        }
        .search-container {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          padding: 11px 40px 11px 40px;
          border-radius: var(--radius-full);
          border: 1.5px solid var(--border);
          background: var(--bg-card);
          color: var(--text-primary);
          outline: none;
          font-family: var(--font-body);
          font-size: 13px;
          transition: all var(--transition-fast);
        }
        .search-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(255,75,26,0.12);
        }
        .search-input::placeholder { color: var(--text-muted); }
        .search-clear {
          position: absolute;
          right: 12px;
          background: var(--border);
          border: none;
          color: var(--text-muted);
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .search-clear:hover { background: var(--primary); color: white; }

        /* Nav Right */
        .nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .user-profile-menu {
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--border);
          border-radius: var(--radius-md);
          padding: 3px;
        }
        .btn-user {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px 10px 5px 5px;
          border-radius: var(--radius-sm);
          transition: background var(--transition-fast);
        }
        .btn-user:hover { background: var(--bg-card); }
        .user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          font-weight: 800;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .user-name {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .btn-logout {
          background: none;
          border: none;
          color: #ef4444;
          padding: 6px 8px;
          cursor: pointer;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          transition: background var(--transition-fast);
        }
        .btn-logout:hover { background: rgba(239,68,68,0.1); }
        .btn-login-nav {
          padding: 8px 16px;
          font-size: 13px;
          border-radius: var(--radius-full);
        }
        .btn-theme {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          background: var(--bg-card);
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }
        .btn-theme:hover { border-color: var(--primary); color: var(--primary); background: rgba(255,75,26,0.05); }
        .btn-order-tracking {
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(34,197,94,0.1);
          color: #16a34a;
          border: 1.5px solid rgba(34,197,94,0.3);
          padding: 7px 14px;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
          position: relative;
          transition: all var(--transition-fast);
        }
        .btn-order-tracking:hover { background: rgba(34,197,94,0.2); }
        .order-dot {
          width: 7px;
          height: 7px;
          background: #22c55e;
          border-radius: 50%;
          position: absolute;
          top: -2px;
          right: -2px;
          border: 2px solid var(--bg-card);
          animation: pulseGlow 1.5s infinite;
        }
        .nav-cart {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--primary);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all var(--transition-fast);
          position: relative;
        }
        .nav-cart:hover { background: var(--primary-hover); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(255,75,26,0.25); }
        .nav-cart.has-items { animation: none; }
        .cart-icon-wrapper { position: relative; }
        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: white;
          color: var(--primary);
          font-size: 10px;
          font-weight: 900;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ===== LOCATION MODAL ===== */
        .loc-modal-overlay {
          position: fixed;
          top: 68px;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 400;
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          padding: 12px 24px;
          pointer-events: none;
        }
        .loc-modal {
          pointer-events: all;
          width: 420px;
          max-height: 540px;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-lg), 0 0 0 1px var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--bg-card);
          animation: fadeInUp 0.2s ease forwards;
        }
        .loc-modal-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px 14px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .loc-modal-title {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--primary);
        }
        .loc-modal-icon { flex-shrink: 0; }
        .loc-modal-title h3 {
          font-size: 15px;
          font-weight: 800;
          color: var(--text-primary);
        }
        .loc-close-btn {
          border: none;
          background: var(--border);
          color: var(--text-muted);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .loc-close-btn:hover { background: #ef4444; color: white; }

        /* Breadcrumb Steps */
        .loc-breadcrumb {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          gap: 0;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .loc-crumb {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border-radius: var(--radius-md);
          border: none;
          background: none;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
          overflow: hidden;
          max-width: 110px;
          text-overflow: ellipsis;
        }
        .loc-crumb span:last-child {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .loc-crumb.active {
          background: rgba(255,75,26,0.1);
          color: var(--primary);
        }
        .loc-crumb.done {
          color: #16a34a;
        }
        .loc-crumb:disabled { opacity: 0.4; cursor: not-allowed; }
        .crumb-num {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--border);
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .loc-crumb.active .crumb-num { background: var(--primary); color: white; }
        .crumb-divider {
          flex: 1;
          height: 1px;
          background: var(--border);
          min-width: 8px;
        }

        /* Step Content */
        .loc-step {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
        }
        .loc-search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
          background: var(--bg-app);
          color: var(--text-muted);
        }
        .loc-search-input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-size: 13px;
          color: var(--text-primary);
          font-family: var(--font-body);
        }
        .loc-search-input::placeholder { color: var(--text-muted); }
        .loc-search-box button {
          border: none;
          background: none;
          cursor: pointer;
          color: var(--text-muted);
          display: flex;
          align-items: center;
        }
        .loc-list {
          overflow-y: auto;
          flex: 1;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .loc-list::-webkit-scrollbar { width: 4px; }
        .loc-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
        .loc-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          border: none;
          background: none;
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          transition: all var(--transition-fast);
        }
        .loc-item:hover { background: rgba(255,75,26,0.07); }
        .loc-item.selected { background: rgba(255,75,26,0.12); color: var(--primary); font-weight: 700; }
        .loc-item-icon { color: var(--text-muted); flex-shrink: 0; }
        .loc-item.selected .loc-item-icon { color: var(--primary); }
        .loc-item span { flex: 1; }
        .loc-check { color: var(--primary); flex-shrink: 0; }
        .loc-empty, .loc-empty-tip {
          padding: 24px;
          text-align: center;
          color: var(--text-muted);
          font-size: 13px;
        }
        .loc-step-footer {
          padding: 10px 16px;
          border-top: 1px solid var(--border);
          flex-shrink: 0;
        }
        .loc-skip-btn {
          background: none;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
          width: 100%;
          transition: all var(--transition-fast);
        }
        .loc-skip-btn:hover { border-color: var(--primary); color: var(--primary); background: rgba(255,75,26,0.05); }
        .loc-modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-top: 1px solid var(--border);
          background: var(--bg-app);
          flex-shrink: 0;
        }
        .loc-clear-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          font-size: 12px;
          color: var(--text-muted);
          cursor: pointer;
          font-weight: 600;
          transition: color var(--transition-fast);
        }
        .loc-clear-btn:hover { color: #ef4444; }
        .loc-selected-summary {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: var(--primary);
          font-weight: 600;
          max-width: 240px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .nav-container { height: 62px; gap: 8px; }
          .logo-tagline { display: none; }
          .nav-location { max-width: 130px; padding: 7px 10px; }
          .loc-modal { width: calc(100vw - 32px); }
          .loc-modal-overlay { padding: 8px 16px; }
          .nav-cart { padding: 7px 12px; }
          .logo-text { font-size: 17px; }
        }

        @media (max-width: 480px) {
          .nav-location { display: none; }
        }
      `}</style>
    </>
  );
}
