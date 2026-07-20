import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { Star, Clock, ArrowLeft, Search, Plus, Minus, Sparkles, MapPin, ChevronRight, Info } from 'lucide-react';

export default function RestaurantView() {
  const { 
    selectedRestaurant, 
    setActiveView, 
    cart, 
    addToCart, 
    removeFromCart 
  } = useCart();

  const [menuItems, setMenuItems] = useState([]);
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [reviewSummary, setReviewSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [showAiSummary, setShowAiSummary] = useState(true);
  const mainRef = useRef(null);

  // Fetch Menu from API
  useEffect(() => {
    if (!selectedRestaurant) return;
    fetch(`http://localhost:8080/api/foods?restaurantId=${selectedRestaurant.id}`)
      .then(res => res.json())
      .then(data => setMenuItems(data))
      .catch(() => setMenuItems(selectedRestaurant.menu || []));

    setLoadingSummary(true);
    fetch(`http://localhost:8080/api/ai/review-summary/${selectedRestaurant.id}`)
      .then(res => res.json())
      .then(data => { setReviewSummary(data.summary); setLoadingSummary(false); })
      .catch(() => {
        setTimeout(() => {
          setReviewSummary(getLocalReviewSummary(selectedRestaurant.id));
          setLoadingSummary(false);
        }, 600);
      });
  }, [selectedRestaurant]);

  const getLocalReviewSummary = (id) => {
    switch (id) {
      case 1: return "Highly praised for exceptional taste and premium spice levels. Delivery is prompt and hot. A few reviews mention slight delays during weekend peak hours.";
      case 2: return "Customers love the authentic wood-fired aroma and thin-crust texture. Dessert lava cake is a must-order. Some advise eating quickly as cheese can harden in winters.";
      default: return "General consensus highlights delicious preparations and reliable packaging. Average ratings suggest satisfying experiences across the menu.";
    }
  };

  // Category map
  const getCategoryName = (catId) => {
    const map = { 1:'Biryani', 2:'Pizza', 3:'Burgers', 4:'Chinese', 5:'Desserts', 6:'Healthy' };
    return map[catId] || 'Starters';
  };

  // Categories from items — use item.category field if available (mock data uses that)
  const categories = useMemo(() => {
    const list = new Set(['All']);
    menuItems.forEach(item => {
      const cat = item.category || getCategoryName(item.categoryId);
      if (cat) list.add(cat);
    });
    return Array.from(list);
  }, [menuItems]);

  const getItemCategory = (item) => item.category || getCategoryName(item.categoryId);

  // Filter menu
  const filteredMenu = useMemo(() => {
    let result = menuItems;
    if (menuSearchQuery.trim()) {
      const q = menuSearchQuery.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }
    if (vegFilter) result = result.filter(item => item.isVeg);
    if (activeCategory !== 'All') result = result.filter(item => getItemCategory(item) === activeCategory);
    return result;
  }, [menuItems, menuSearchQuery, vegFilter, activeCategory]);

  // Group filtered menu by category
  const groupedMenu = useMemo(() => {
    if (activeCategory !== 'All') {
      return { [activeCategory]: filteredMenu };
    }
    const groups = {};
    filteredMenu.forEach(item => {
      const cat = getItemCategory(item);
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [filteredMenu, activeCategory]);

  const cartQuantities = useMemo(() => {
    const qtys = {};
    cart.forEach(ci => { qtys[ci.id] = ci.quantity; });
    return qtys;
  }, [cart]);

  const cartTotal = cart.reduce((sum, ci) => sum + ci.price * ci.quantity, 0);
  const cartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);

  if (!selectedRestaurant) {
    return (
      <div className="rv-error">
        <p>No restaurant selected.</p>
        <button className="btn btn-primary" onClick={() => setActiveView('home')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="rv-root animate-fade-in">

      {/* Restaurant Hero Banner */}
      <div className="rv-banner" style={{ backgroundImage: `url(${selectedRestaurant.image})` }}>
        <div className="rv-banner-overlay" />
        <div className="container rv-banner-inner">
          <button className="rv-back-btn" onClick={() => setActiveView('home')}>
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Restaurant Info Card */}
      <div className="container rv-info-wrap">
        <div className="rv-info-card">
          <div className="rv-info-left">
            <h1 className="rv-restaurant-name">{selectedRestaurant.name}</h1>
            <p className="rv-cuisines">
              {(Array.isArray(selectedRestaurant.cuisines) ? selectedRestaurant.cuisines : (selectedRestaurant.cuisines || '').split(', ')).join(' · ')}
            </p>
            <div className="rv-meta-row">
              <span className="rv-meta-pill rv-rating-pill">
                <Star size={12} fill="white" />
                <span>{selectedRestaurant.rating}</span>
                <span className="rv-rating-count">({selectedRestaurant.reviewsCount})</span>
              </span>
              <span className="rv-meta-pill rv-time-pill">
                <Clock size={12} />
                <span>{selectedRestaurant.deliveryTime}</span>
              </span>
              <span className="rv-meta-pill rv-cost-pill">
                <span>₹{selectedRestaurant.costForTwo} for two</span>
              </span>
              <span className="rv-meta-pill rv-dist-pill">
                <MapPin size={12} />
                <span>{selectedRestaurant.distance}</span>
              </span>
            </div>
          </div>
          {selectedRestaurant.offer && (
            <div className="rv-offer-badge">
              <span className="rv-offer-emoji">🎉</span>
              <span>{selectedRestaurant.offer}</span>
            </div>
          )}
        </div>
      </div>

      {/* AI Summary Banner */}
      {showAiSummary && (
        <div className="container">
          <div className="rv-ai-banner">
            <div className="rv-ai-banner-left">
              <div className="rv-ai-icon"><Sparkles size={15} /></div>
              <div className="rv-ai-content">
                <div className="rv-ai-label">AI Review Summary</div>
                {loadingSummary ? (
                  <div className="rv-ai-loading">
                    <span className="rv-dot" /><span className="rv-dot" /><span className="rv-dot" />
                    <span>Analyzing reviews…</span>
                  </div>
                ) : (
                  <p className="rv-ai-text">{reviewSummary}</p>
                )}
              </div>
            </div>
            <button className="rv-ai-close" onClick={() => setShowAiSummary(false)}>✕</button>
          </div>
        </div>
      )}

      {/* Main Layout: Sidebar + Menu */}
      <div className="container rv-layout">

        {/* LEFT SIDEBAR — Category Navigation */}
        <aside className="rv-sidebar">
          <div className="rv-sidebar-inner">
            <h3 className="rv-sidebar-title">Menu</h3>
            <div className="rv-cat-list">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`rv-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  <span className="rv-cat-name">{cat}</span>
                  {activeCategory === cat && <span className="rv-cat-indicator" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT PANEL — Search + Menu Items */}
        <main className="rv-menu-panel" ref={mainRef}>
          {/* Sticky top bar */}
          <div className="rv-menu-topbar">
            <div className="rv-search-wrap">
              <Search size={14} className="rv-search-icon" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={menuSearchQuery}
                onChange={e => setMenuSearchQuery(e.target.value)}
                className="rv-search-input"
              />
              {menuSearchQuery && (
                <button className="rv-search-clear" onClick={() => setMenuSearchQuery('')}>✕</button>
              )}
            </div>
            <button
              className={`rv-veg-toggle ${vegFilter ? 'active' : ''}`}
              onClick={() => setVegFilter(!vegFilter)}
            >
              <span className="badge-veg" />
              <span>Veg Only</span>
            </button>
          </div>

          {/* Menu Items */}
          {Object.keys(groupedMenu).length === 0 ? (
            <div className="rv-empty">
              <span className="rv-empty-icon">🍲</span>
              <h4>No dishes match your search</h4>
              <p>Try clearing your search or filters.</p>
            </div>
          ) : (
            Object.entries(groupedMenu).map(([category, items]) => (
              <div key={category} className="rv-category-group">
                {activeCategory === 'All' && (
                  <h4 className="rv-category-heading">
                    {category}
                    <span className="rv-category-count">{items.length}</span>
                  </h4>
                )}
                <div className="rv-items-list">
                  {items.map(dish => {
                    const qty = cartQuantities[dish.id] || 0;
                    return (
                      <div key={dish.id} className="rv-item-card">
                        {/* Left: Text Info */}
                        <div className="rv-item-info">
                          <div className="rv-item-badges">
                            <span className={dish.isVeg ? 'badge-veg' : 'badge-nonveg'} />
                            {dish.rating && (
                              <span className="rv-item-rating">
                                <Star size={10} fill="#f59e0b" stroke="#f59e0b" />
                                <span>{dish.rating}</span>
                              </span>
                            )}
                          </div>
                          <h4 className="rv-item-name">{dish.name}</h4>
                          <p className="rv-item-price">₹{dish.price}</p>
                          <p className="rv-item-desc">{dish.description}</p>
                        </div>

                        {/* Right: Image + Add Button */}
                        <div className="rv-item-visual">
                          <div className="rv-item-img-wrap">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="rv-item-img"
                              loading="lazy"
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                          </div>
                          {qty > 0 ? (
                            <div className="rv-qty-ctrl">
                              <button
                                className="rv-qty-btn rv-qty-minus"
                                onClick={() => removeFromCart(dish.id)}
                                aria-label="Remove one"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="rv-qty-num">{qty}</span>
                              <button
                                className="rv-qty-btn rv-qty-plus"
                                onClick={() => addToCart(dish, selectedRestaurant)}
                                aria-label="Add one"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          ) : (
                            <button
                              className="rv-add-btn"
                              onClick={() => addToCart(dish, selectedRestaurant)}
                            >
                              ADD <Plus size={12} strokeWidth={3} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </main>
      </div>

      {/* Sticky Bottom Cart Bar */}
      {cartCount > 0 && (
        <div className="rv-cart-bar" onClick={() => setActiveView('checkout')}>
          <div className="rv-cart-bar-left">
            <div className="rv-cart-count-badge">{cartCount}</div>
            <span className="rv-cart-bar-label">item{cartCount > 1 ? 's' : ''} added</span>
          </div>
          <span className="rv-cart-bar-mid">View Cart</span>
          <span className="rv-cart-bar-right">₹{cartTotal}</span>
        </div>
      )}

      <style>{`
        /* ===== ROOT ===== */
        .rv-root {
          min-height: 100vh;
          background: var(--bg-app);
          padding-bottom: ${cart.length > 0 ? '80px' : '0'};
        }
        .rv-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          min-height: 60vh;
        }

        /* ===== BANNER ===== */
        .rv-banner {
          position: relative;
          height: 240px;
          background-size: cover;
          background-position: center;
        }
        .rv-banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%);
        }
        .rv-banner-inner {
          position: relative;
          z-index: 1;
          padding-top: 20px;
        }
        .rv-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 99px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .rv-back-btn:hover {
          background: rgba(255,255,255,0.25);
          transform: translateX(-2px);
        }

        /* ===== INFO CARD ===== */
        .rv-info-wrap { margin-top: -2px; }
        .rv-info-card {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px 28px;
          box-shadow: var(--shadow-md);
          margin-bottom: 16px;
          position: relative;
          z-index: 2;
        }
        .rv-restaurant-name {
          font-size: 26px;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          margin-bottom: 6px;
        }
        .rv-cuisines {
          font-size: 14px;
          color: var(--text-muted);
          font-weight: 500;
          margin-bottom: 14px;
        }
        .rv-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .rv-meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 700;
          border: 1px solid var(--border);
          background: var(--bg-app);
          color: var(--text-primary);
        }
        .rv-rating-pill { background: #22c55e; color: white; border-color: #22c55e; }
        .rv-rating-count { font-weight: 500; opacity: 0.85; }
        .rv-time-pill svg { color: var(--primary); }
        .rv-offer-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          border: 1.5px solid #f59e0b;
          border-radius: var(--radius-md);
          padding: 12px 18px;
          font-size: 13px;
          font-weight: 800;
          color: #92400e;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .rv-offer-emoji { font-size: 20px; }

        /* ===== AI BANNER ===== */
        .rv-ai-banner {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          background: linear-gradient(135deg, rgba(255,75,26,0.05), rgba(168,85,247,0.05));
          border: 1.5px solid rgba(255,75,26,0.2);
          border-radius: var(--radius-lg);
          padding: 16px 20px;
          margin-bottom: 20px;
        }
        .rv-ai-banner-left { display: flex; gap: 12px; align-items: flex-start; flex: 1; }
        .rv-ai-icon {
          width: 34px; height: 34px; border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .rv-ai-label {
          font-size: 10px; font-weight: 800; color: var(--primary);
          text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 5px;
        }
        .rv-ai-text { font-size: 13px; color: var(--text-primary); line-height: 1.55; }
        .rv-ai-loading { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--text-muted); }
        .rv-dot {
          width: 6px; height: 6px; background: var(--primary); border-radius: 50%;
          animation: bounce 1s infinite; display: inline-block;
        }
        .rv-dot:nth-child(2) { animation-delay: 0.15s; }
        .rv-dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        .rv-ai-close {
          background: none; border: none; color: var(--text-muted); font-size: 16px;
          cursor: pointer; padding: 4px; line-height: 1; flex-shrink: 0;
          transition: color var(--transition-fast);
        }
        .rv-ai-close:hover { color: #ef4444; }

        /* ===== LAYOUT ===== */
        .rv-layout {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 24px;
          align-items: start;
          padding-bottom: 40px;
        }

        /* ===== SIDEBAR ===== */
        .rv-sidebar {
          position: sticky;
          top: 80px;
        }
        .rv-sidebar-inner {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .rv-sidebar-title {
          font-size: 13px;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 16px 18px 10px;
          border-bottom: 1px solid var(--border);
        }
        .rv-cat-list {
          display: flex;
          flex-direction: column;
        }
        .rv-cat-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 18px;
          border: none;
          background: none;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
          text-align: left;
          transition: all var(--transition-fast);
          border-bottom: 1px solid var(--border);
        }
        .rv-cat-btn:last-child { border-bottom: none; }
        .rv-cat-btn:hover { background: rgba(255,75,26,0.04); color: var(--text-primary); }
        .rv-cat-btn.active {
          background: rgba(255,75,26,0.07);
          color: var(--primary);
          font-weight: 800;
        }
        .rv-cat-indicator {
          width: 3px;
          height: 20px;
          background: var(--primary);
          border-radius: 99px;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }

        /* ===== MENU PANEL ===== */
        .rv-menu-panel { display: flex; flex-direction: column; gap: 0; }
        .rv-menu-topbar {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 12px 16px;
          margin-bottom: 16px;
          position: sticky;
          top: 76px;
          z-index: 50;
          box-shadow: var(--shadow-sm);
        }
        .rv-search-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-app);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          padding: 9px 14px;
          transition: border-color var(--transition-fast);
        }
        .rv-search-wrap:focus-within { border-color: var(--primary); }
        .rv-search-icon { color: var(--text-muted); flex-shrink: 0; }
        .rv-search-input {
          flex: 1; border: none; background: none; outline: none;
          font-size: 13px; color: var(--text-primary); font-family: var(--font-body);
        }
        .rv-search-input::placeholder { color: var(--text-muted); }
        .rv-search-clear {
          background: none; border: none; color: var(--text-muted); cursor: pointer;
          font-size: 14px; line-height: 1; padding: 0;
          transition: color var(--transition-fast);
        }
        .rv-search-clear:hover { color: #ef4444; }
        .rv-veg-toggle {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 16px;
          border: 2px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--bg-app);
          font-size: 13px;
          font-weight: 700;
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .rv-veg-toggle:hover { border-color: #22c55e; color: #16a34a; }
        .rv-veg-toggle.active {
          border-color: #22c55e;
          background: rgba(34,197,94,0.08);
          color: #16a34a;
        }

        /* ===== CATEGORY GROUP ===== */
        .rv-category-group { margin-bottom: 8px; }
        .rv-category-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 17px;
          font-weight: 800;
          color: var(--text-primary);
          padding: 20px 0 12px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 4px;
        }
        .rv-category-count {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          background: var(--border);
          padding: 2px 8px;
          border-radius: 99px;
        }
        .rv-items-list { display: flex; flex-direction: column; }

        /* ===== ITEM CARD ===== */
        .rv-item-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 20px 0;
          border-bottom: 1px solid var(--border);
          transition: background var(--transition-fast);
        }
        .rv-item-card:last-child { border-bottom: none; }
        .rv-item-card:hover { background: rgba(0,0,0,0.01); }

        /* Left info */
        .rv-item-info { flex: 1; min-width: 0; }
        .rv-item-badges {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .rv-item-rating {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 12px;
          font-weight: 700;
          color: #92400e;
          background: #fef3c7;
          padding: 2px 7px;
          border-radius: 4px;
        }
        .rv-item-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
          line-height: 1.3;
        }
        .rv-item-price {
          font-size: 15px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        .rv-item-desc {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.55;
          max-width: 480px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Right visual */
        .rv-item-visual {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .rv-item-img-wrap {
          width: 120px;
          height: 100px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--border);
        }
        .rv-item-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .rv-item-card:hover .rv-item-img { transform: scale(1.05); }

        /* Add button */
        .rv-add-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          background: var(--bg-card);
          color: var(--primary);
          border: 2px solid var(--primary);
          border-radius: var(--radius-sm);
          padding: 7px 20px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: all var(--transition-fast);
          width: 120px;
          box-shadow: 0 2px 8px rgba(255,75,26,0.1);
        }
        .rv-add-btn:hover {
          background: var(--primary);
          color: white;
          transform: scale(1.03);
          box-shadow: 0 4px 16px rgba(255,75,26,0.25);
        }

        /* Qty controls */
        .rv-qty-ctrl {
          display: flex;
          align-items: center;
          gap: 0;
          background: var(--primary);
          border-radius: var(--radius-sm);
          overflow: hidden;
          width: 120px;
          box-shadow: 0 4px 16px rgba(255,75,26,0.25);
        }
        .rv-qty-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-weight: 900;
          transition: background var(--transition-fast);
          flex-shrink: 0;
        }
        .rv-qty-btn:hover { background: rgba(0,0,0,0.15); }
        .rv-qty-num {
          flex: 1;
          text-align: center;
          font-size: 15px;
          font-weight: 800;
          color: white;
        }

        /* ===== EMPTY STATE ===== */
        .rv-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 60px 20px;
          text-align: center;
          color: var(--text-muted);
        }
        .rv-empty-icon { font-size: 48px; }
        .rv-empty h4 { font-size: 17px; color: var(--text-primary); }
        .rv-empty p { font-size: 14px; }

        /* ===== CART BAR ===== */
        .rv-cart-bar {
          position: fixed;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 300;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          padding: 16px 24px;
          border-radius: var(--radius-full);
          min-width: 360px;
          max-width: 600px;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(255,75,26,0.4);
          animation: fadeInUp 0.3s ease;
          transition: all var(--transition-fast);
        }
        .rv-cart-bar:hover { transform: translateX(-50%) translateY(-2px); box-shadow: 0 12px 40px rgba(255,75,26,0.5); }
        .rv-cart-bar-left { display: flex; align-items: center; gap: 10px; }
        .rv-cart-count-badge {
          width: 26px; height: 26px; border-radius: 50%;
          background: rgba(255,255,255,0.25);
          font-size: 13px; font-weight: 900;
          display: flex; align-items: center; justify-content: center;
        }
        .rv-cart-bar-label { font-size: 13px; font-weight: 600; opacity: 0.9; }
        .rv-cart-bar-mid { font-size: 15px; font-weight: 800; }
        .rv-cart-bar-right { font-size: 15px; font-weight: 800; }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .rv-banner { height: 180px; }
          .rv-layout {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .rv-sidebar {
            position: static;
            margin-bottom: 16px;
          }
          .rv-sidebar-inner {
            display: flex;
            flex-direction: row;
            overflow-x: auto;
            border-radius: var(--radius-md);
          }
          .rv-sidebar-title { display: none; }
          .rv-cat-list { flex-direction: row; }
          .rv-cat-btn {
            white-space: nowrap;
            border-bottom: none;
            border-right: 1px solid var(--border);
            padding: 12px 16px;
            font-size: 13px;
          }
          .rv-cat-indicator { display: none; }
          .rv-cat-btn.active {
            border-bottom: 2.5px solid var(--primary);
          }
          .rv-item-img-wrap { width: 90px; height: 80px; }
          .rv-add-btn, .rv-qty-ctrl { width: 90px; font-size: 12px; }
          .rv-restaurant-name { font-size: 20px; }
          .rv-cart-bar { min-width: calc(100vw - 32px); border-radius: var(--radius-lg); }
          .rv-menu-topbar { top: 62px; }
          .rv-info-card { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
