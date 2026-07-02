import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { Star, Clock, ArrowLeft, Search, Plus, Minus, Check } from 'lucide-react';

export default function RestaurantView() {
  const { 
    selectedRestaurant, 
    setActiveView, 
    cart, 
    addToCart, 
    removeFromCart 
  } = useCart();

  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  if (!selectedRestaurant) {
    return (
      <div className="container error-view">
        <p>No restaurant selected.</p>
        <button className="btn btn-primary" onClick={() => setActiveView('home')}>Go Home</button>
      </div>
    );
  }

  // Get list of menu categories
  const categories = useMemo(() => {
    const list = new Set(['All']);
    selectedRestaurant.menu.forEach(item => {
      if (item.category) list.add(item.category);
    });
    return Array.from(list);
  }, [selectedRestaurant]);

  // Filter Menu Items
  const filteredMenu = useMemo(() => {
    let result = selectedRestaurant.menu;

    // Search query filter
    if (menuSearchQuery.trim()) {
      const q = menuSearchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q)
      );
    }

    // Veg filter
    if (vegFilter) {
      result = result.filter(item => item.isVeg);
    }

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter(item => item.category === activeCategory);
    }

    return result;
  }, [selectedRestaurant, menuSearchQuery, vegFilter, activeCategory]);

  // Map cart items for convenient quantity lookup
  const cartQuantities = useMemo(() => {
    const qtys = {};
    cart.forEach(cartItem => {
      qtys[cartItem.id] = cartItem.quantity;
    });
    return qtys;
  }, [cart]);

  return (
    <div className="restaurant-detail-container animate-fade-in">
      {/* Detail Banner */}
      <div className="restaurant-banner" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8)), url(${selectedRestaurant.image})` }}>
        <div className="container banner-inner">
          <button className="btn-back" onClick={() => setActiveView('home')}>
            <ArrowLeft size={18} />
            <span>Back to Restaurants</span>
          </button>
          
          <div className="banner-details">
            <h1 className="banner-title">{selectedRestaurant.name}</h1>
            <p className="banner-cuisines">{selectedRestaurant.cuisines.join(', ')}</p>
            <div className="banner-stats">
              <div className="banner-stat">
                <Star size={16} fill="white" className="star-icon" />
                <span>{selectedRestaurant.rating} ({selectedRestaurant.reviewsCount})</span>
              </div>
              <div className="banner-stat">
                <Clock size={16} />
                <span>{selectedRestaurant.deliveryTime} ({selectedRestaurant.distance})</span>
              </div>
              <div className="banner-stat">
                <span>₹{selectedRestaurant.costForTwo} for two</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container menu-section">
        {/* Category Selector on the Left */}
        <aside className="category-sidebar">
          <h3>Menu</h3>
          <div className="category-list">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-nav-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Menu Items list on the Right */}
        <main className="menu-items-area">
          {/* Menu Search and Veg Switch */}
          <div className="menu-header-bar card">
            <div className="menu-search-wrapper">
              <Search size={16} className="menu-search-icon" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={menuSearchQuery}
                onChange={(e) => setMenuSearchQuery(e.target.value)}
                className="menu-search-input"
              />
            </div>
            
            <button 
              className={`veg-switch-btn ${vegFilter ? 'active' : ''}`}
              onClick={() => setVegFilter(!vegFilter)}
            >
              <span className="badge-veg"></span>
              <span>Veg Only</span>
            </button>
          </div>

          {/* Menu Catalog Grid */}
          <div className="menu-list">
            {filteredMenu.length === 0 ? (
              <div className="no-menu-items card">
                <span className="empty-emoji">🍲</span>
                <h4>No dishes match your criteria</h4>
                <p>Try clearing your search query or filters.</p>
              </div>
            ) : (
              filteredMenu.map(dish => {
                const qty = cartQuantities[dish.id] || 0;
                
                return (
                  <div key={dish.id} className="menu-item-card card animate-slide-up">
                    <div className="menu-item-info">
                      <div className="menu-item-tags">
                        <span className={dish.isVeg ? 'badge-veg' : 'badge-nonveg'}></span>
                        {dish.rating && (
                          <span className="dish-rating">
                            <Star size={10} fill="orange" stroke="orange" />
                            <span>{dish.rating}</span>
                          </span>
                        )}
                      </div>
                      <h4 className="dish-name">{dish.name}</h4>
                      <p className="dish-price">₹{dish.price}</p>
                      <p className="dish-desc">{dish.description}</p>
                    </div>

                    <div className="menu-item-graphic">
                      <img src={dish.image} alt={dish.name} className="dish-img" />
                      
                      {qty > 0 ? (
                        <div className="quantity-controller">
                          <button 
                            className="qty-btn"
                            onClick={() => removeFromCart(dish.id)}
                            title="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="qty-value">{qty}</span>
                          <button 
                            className="qty-btn"
                            onClick={() => addToCart(dish, selectedRestaurant)}
                            title="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="btn-add-item"
                          onClick={() => addToCart(dish, selectedRestaurant)}
                        >
                          <span>ADD</span>
                          <Plus size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      {/* CSS Styles */}
      <style>{`
        .restaurant-detail-container {
          padding-bottom: 80px;
        }
        .restaurant-banner {
          height: 320px;
          background-size: cover;
          background-position: center;
          position: relative;
          color: white;
          display: flex;
          align-items: flex-end;
          padding-bottom: 40px;
        }
        .banner-inner {
          display: flex;
          flex-direction: column;
          gap: 60px;
          width: 100%;
        }
        .btn-back {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background-color: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-full);
          color: white;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all var(--transition-fast);
          backdrop-filter: blur(4px);
        }
        .btn-back:hover {
          background-color: rgba(255, 75, 26, 0.8);
          border-color: var(--primary);
          transform: translateX(-4px);
        }
        .banner-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .banner-title {
          font-size: 32px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.03em;
        }
        .banner-cuisines {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 500;
        }
        .banner-stats {
          display: flex;
          gap: 20px;
          align-items: center;
          font-size: 14px;
          font-weight: 600;
        }
        .banner-stat {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .star-icon {
          color: #22c55e;
        }

        /* Menu layout grid */
        .menu-section {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 40px;
          margin-top: 40px;
        }
        
        /* Sidebar */
        .category-sidebar {
          position: sticky;
          top: 96px;
          align-self: start;
        }
        .category-sidebar h3 {
          font-size: 18px;
          margin-bottom: 16px;
          border-bottom: 2px solid var(--border);
          padding-bottom: 8px;
        }
        .category-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .category-nav-btn {
          text-align: left;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          background: none;
          border: none;
          color: var(--text-muted);
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .category-nav-btn:hover {
          color: var(--primary);
          background-color: rgba(255, 75, 26, 0.02);
        }
        .category-nav-btn.active {
          color: var(--primary);
          background-color: rgba(255, 75, 26, 0.08);
          font-weight: 700;
        }

        /* Menu items area */
        .menu-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          margin-bottom: 24px;
          gap: 16px;
        }
        .menu-search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          max-width: 320px;
        }
        .menu-search-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
        }
        .menu-search-input {
          width: 100%;
          padding: 8px 12px 8px 36px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--border);
          background-color: var(--bg-card);
          color: var(--text-primary);
          outline: none;
          font-size: 13px;
        }
        .menu-search-input:focus {
          border-color: var(--primary);
        }
        .veg-switch-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          border: 1.5px solid var(--border);
          background: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          color: var(--text-primary);
          transition: all var(--transition-fast);
        }
        .veg-switch-btn:hover {
          border-color: var(--primary);
        }
        .veg-switch-btn.active {
          background-color: rgba(34, 197, 94, 0.08);
          border-color: #22c55e;
          color: #22c55e;
        }

        /* Menu Items List */
        .menu-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .menu-item-card {
          display: flex;
          justify-content: space-between;
          padding: 24px;
          gap: 24px;
        }
        .menu-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .menu-item-tags {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dish-rating {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background-color: rgba(245, 158, 11, 0.1);
          color: rgb(245, 158, 11);
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: var(--radius-sm);
        }
        .dish-name {
          font-size: 17px;
          font-weight: 700;
        }
        .dish-price {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .dish-desc {
          font-size: 13px;
          color: var(--text-muted);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .menu-item-graphic {
          width: 120px;
          height: 120px;
          position: relative;
          flex-shrink: 0;
        }
        .dish-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: var(--radius-md);
          background-color: var(--border);
        }
        .btn-add-item {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          background-color: var(--bg-card);
          color: #22c55e;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          padding: 6px 16px;
          font-weight: 800;
          font-size: 12px;
          box-shadow: var(--shadow-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all var(--transition-fast);
        }
        .btn-add-item:hover {
          border-color: #22c55e;
          background-color: rgba(34, 197, 94, 0.05);
          box-shadow: var(--shadow-md);
          transform: translateX(-50%) translateY(-2px);
        }
        .quantity-controller {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #22c55e;
          color: white;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }
        .qty-btn {
          border: none;
          background: none;
          color: white;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-weight: bold;
          transition: background-color var(--transition-fast);
        }
        .qty-btn:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
        .qty-value {
          padding: 0 8px;
          font-size: 13px;
          font-weight: 800;
          min-width: 20px;
          text-align: center;
        }
        .no-menu-items {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
        }
        .no-menu-items h4 {
          margin-bottom: 4px;
        }
        .no-menu-items p {
          font-size: 13px;
          color: var(--text-muted);
        }
        .error-view {
          padding: 60px 24px;
          text-align: center;
        }

        @media (max-width: 768px) {
          .menu-section {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .category-sidebar {
            position: relative;
            top: 0;
          }
          .category-list {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 8px;
          }
          .category-nav-btn {
            white-space: nowrap;
          }
          .menu-item-card {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
