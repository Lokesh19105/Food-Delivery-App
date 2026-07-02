import React, { useState, useMemo } from 'react';
import { RESTAURANTS, CUISINES } from '../data/restaurants';
import { useCart } from '../context/CartContext';
import { Star, Clock, Filter, Compass, Flame, Heart } from 'lucide-react';

export default function HomeView({ searchQuery }) {
  const { setSelectedRestaurant, setActiveView } = useCart();
  
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'rating', 'time', 'costLow', 'costHigh'
  const [vegOnly, setVegOnly] = useState(false);
  const [highlyRated, setHighlyRated] = useState(false);

  // Filter & Sort Logic
  const filteredRestaurants = useMemo(() => {
    let result = [...RESTAURANTS];

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(r => {
        // Matches restaurant name
        if (r.name.toLowerCase().includes(query)) return true;
        // Matches cuisines
        if (r.cuisines.some(c => c.toLowerCase().includes(query))) return true;
        // Matches any menu item name
        if (r.menu.some(item => item.name.toLowerCase().includes(query))) return true;
        return false;
      });
    }

    // Filter by Cuisine tag
    if (selectedCuisine !== 'all') {
      result = result.filter(r => 
        r.cuisines.some(c => c.toLowerCase() === selectedCuisine.toLowerCase())
      );
    }

    // Filter Veg Only
    if (vegOnly) {
      result = result.filter(r => r.vegOnly);
    }

    // Filter Highly Rated
    if (highlyRated) {
      result = result.filter(r => r.rating >= 4.5);
    }

    // Sorting
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'time') {
      // Extract number from delivery time e.g., "20-25 mins" -> 20
      const getMinTime = (str) => parseInt(str.split('-')[0]) || 0;
      result.sort((a, b) => getMinTime(a.deliveryTime) - getMinTime(b.deliveryTime));
    } else if (sortBy === 'costLow') {
      result.sort((a, b) => a.costForTwo - b.costForTwo);
    } else if (sortBy === 'costHigh') {
      result.sort((a, b) => b.costForTwo - a.costForTwo);
    }

    return result;
  }, [searchQuery, selectedCuisine, sortBy, vegOnly, highlyRated]);

  // Quick Promo Collections
  const collections = [
    { title: 'Trending Brands', subtitle: 'Most ordered in your locality', tag: 'trending', icon: <Flame size={16} /> },
    { title: 'Super Offers', subtitle: 'Max discounts & cashbacks', tag: 'offers', icon: <Compass size={16} /> },
    { title: 'Pure Veg Gems', subtitle: 'Top rated green choices', tag: 'veg', icon: <Heart size={16} /> },
  ];

  return (
    <div className="home-container animate-fade-in">
      {/* Category Hero / Header */}
      <div className="hero-banner">
        <div className="container hero-content">
          <div className="hero-text-side">
            <h1>Hungry? Order delicious food to your doorstep.</h1>
            <p>Freshly prepared meals from top rated local restaurants.</p>
            
            <div className="quick-stats">
              <div className="stat-badge">
                <span className="stat-icon">⭐</span>
                <span>4.5+ Avg Rating</span>
              </div>
              <div className="stat-badge">
                <span className="stat-icon">⚡</span>
                <span>Superfast Delivery</span>
              </div>
            </div>
          </div>
          <div className="hero-graphic">
            <span className="hero-emoji">🍕</span>
            <span className="hero-emoji secondary">🍜</span>
            <span className="hero-emoji tertiary">🍔</span>
          </div>
        </div>
      </div>

      <div className="container home-content-section">
        {/* Cuisines Categories Bubble Slider */}
        <section className="categories-section">
          <h2 className="section-title">What's on your mind?</h2>
          <div className="cuisine-slider">
            {CUISINES.map(cuisine => (
              <button
                key={cuisine.id}
                className={`cuisine-card ${selectedCuisine === cuisine.id ? 'active' : ''}`}
                onClick={() => setSelectedCuisine(cuisine.id)}
              >
                <span className="cuisine-icon">{cuisine.icon}</span>
                <span className="cuisine-name">{cuisine.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Sorting & Filter Controls */}
        <section className="controls-bar card">
          <div className="controls-left">
            <div className="control-header">
              <Filter size={16} />
              <span>Filters</span>
            </div>
            
            {/* Toggles */}
            <button 
              className={`filter-btn ${vegOnly ? 'active' : ''}`}
              onClick={() => setVegOnly(!vegOnly)}
            >
              <span className="badge-veg"></span>
              <span>Pure Veg</span>
            </button>

            <button 
              className={`filter-btn ${highlyRated ? 'active' : ''}`}
              onClick={() => setHighlyRated(!highlyRated)}
            >
              <Star size={14} className="star-icon" />
              <span>Ratings 4.5+</span>
            </button>
          </div>

          <div className="controls-right">
            <span className="sort-label">Sort by:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="default">Relevance</option>
              <option value="rating">Rating: High to Low</option>
              <option value="time">Delivery Time: Quickest</option>
              <option value="costLow">Cost: Low to High</option>
              <option value="costHigh">Cost: High to Low</option>
            </select>
          </div>
        </section>

        {/* Collections */}
        <section className="collections-grid">
          {collections.map((col, index) => (
            <div 
              key={index} 
              className="collection-card"
              onClick={() => {
                if (col.tag === 'veg') setVegOnly(true);
                else if (col.tag === 'offers') setSortBy('costLow');
                else if (col.tag === 'trending') setHighlyRated(true);
              }}
            >
              <div className="col-icon-box">{col.icon}</div>
              <div className="col-text">
                <h4>{col.title}</h4>
                <p>{col.subtitle}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Restaurants Catalog */}
        <section className="restaurants-section">
          <h2 className="section-title">
            {selectedCuisine !== 'all' ? `${selectedCuisine.charAt(0).toUpperCase() + selectedCuisine.slice(1)} Restaurants` : 'Restaurants near you'}
            <span className="results-count">({filteredRestaurants.length} found)</span>
          </h2>

          {filteredRestaurants.length === 0 ? (
            <div className="empty-results card">
              <span className="empty-emoji">🔍</span>
              <h3>No restaurants match your filters</h3>
              <p>Try resetting some parameters or search criteria.</p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setVegOnly(false);
                  setHighlyRated(false);
                  setSelectedCuisine('all');
                  setSortBy('default');
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="restaurant-grid">
              {filteredRestaurants.map(restaurant => (
                <div 
                  key={restaurant.id}
                  className="restaurant-card card animate-slide-up"
                  onClick={() => {
                    setSelectedRestaurant(restaurant);
                    setActiveView('restaurant');
                  }}
                >
                  {/* Banner Image */}
                  <div className="res-img-wrapper">
                    <img src={restaurant.image} alt={restaurant.name} className="res-img" />
                    {restaurant.featured && <span className="featured-tag">Gourmet Choice</span>}
                    {restaurant.offer && <span className="offer-tag">{restaurant.offer}</span>}
                  </div>

                  {/* Body Content */}
                  <div className="res-body">
                    <div className="res-header">
                      <h3>{restaurant.name}</h3>
                      <div className="res-rating">
                        <span>{restaurant.rating}</span>
                        <Star size={12} fill="white" className="star-icon" />
                      </div>
                    </div>

                    <p className="res-cuisines">{restaurant.cuisines.join(', ')}</p>

                    <div className="res-footer">
                      <div className="res-meta-item">
                        <Clock size={14} />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <div className="res-meta-item">
                        <span>•</span>
                        <span>₹{restaurant.costForTwo} for two</span>
                      </div>
                      <div className="res-meta-item ml-auto">
                        <span>{restaurant.distance}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Styled Home CSS */}
      <style>{`
        .home-container {
          padding-bottom: 80px;
        }
        .hero-banner {
          background: linear-gradient(135deg, hsl(15, 95%, 93%) 0%, hsl(340, 85%, 93%) 100%);
          padding: 60px 0;
          margin-bottom: 40px;
          border-bottom: 1px solid var(--border);
        }
        [data-theme="dark"] .hero-banner {
          background: linear-gradient(135deg, hsl(15, 60%, 15%) 0%, hsl(340, 60%, 12%) 100%);
        }
        .hero-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }
        .hero-text-side {
          max-width: 600px;
        }
        .hero-text-side h1 {
          font-size: 38px;
          line-height: 1.2;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 16px;
          letter-spacing: -0.04em;
        }
        .hero-text-side p {
          font-size: 16px;
          color: var(--text-muted);
          margin-bottom: 24px;
        }
        .quick-stats {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .stat-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--bg-card);
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 600;
          box-shadow: var(--shadow-sm);
        }
        .hero-graphic {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          position: relative;
        }
        .hero-emoji {
          font-size: 64px;
          animation: float 4s ease-in-out infinite;
        }
        .hero-emoji.secondary {
          animation-delay: 1s;
        }
        .hero-emoji.tertiary {
          animation-delay: 2s;
        }
        .section-title {
          font-size: 22px;
          margin-bottom: 20px;
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .results-count {
          font-size: 14px;
          color: var(--text-muted);
          font-weight: 500;
        }

        /* Cuisine Slider */
        .categories-section {
          margin-bottom: 32px;
        }
        .cuisine-slider {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding: 8px 4px;
          scrollbar-width: none;
        }
        .cuisine-slider::-webkit-scrollbar {
          display: none;
        }
        .cuisine-card {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
          width: 100px;
          background-color: var(--bg-card);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .cuisine-card:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }
        .cuisine-card.active {
          background-color: rgba(255, 75, 26, 0.08);
          border-color: var(--primary);
        }
        .cuisine-icon {
          font-size: 32px;
        }
        .cuisine-name {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-primary);
        }

        /* Controls Bar */
        .controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          margin-bottom: 32px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .controls-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .control-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          font-size: 14px;
          color: var(--text-primary);
          margin-right: 12px;
        }
        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          border: 1.5px solid var(--border);
          background-color: var(--bg-card);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .filter-btn:hover {
          border-color: var(--primary);
          background-color: rgba(255, 75, 26, 0.02);
        }
        .filter-btn.active {
          border-color: var(--primary);
          background-color: rgba(255, 75, 26, 0.08);
          color: var(--primary);
        }
        .sort-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          margin-right: 8px;
        }
        .sort-select {
          padding: 8px 12px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--border);
          background-color: var(--bg-card);
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }
        .sort-select:focus {
          border-color: var(--primary);
        }

        /* Collections */
        .collections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .collection-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background-color: var(--bg-card);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-normal);
          box-shadow: var(--shadow-sm);
        }
        .collection-card:hover {
          transform: translateY(-2px);
          border-color: var(--primary);
          box-shadow: var(--shadow-md);
        }
        .col-icon-box {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background-color: rgba(255, 75, 26, 0.08);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .col-text h4 {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .col-text p {
          font-size: 12px;
          color: var(--text-muted);
        }

        /* Restaurant Cards */
        .restaurant-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }
        .restaurant-card {
          cursor: pointer;
        }
        .res-img-wrapper {
          position: relative;
          height: 200px;
          overflow: hidden;
          background-color: var(--border);
        }
        .res-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }
        .restaurant-card:hover .res-img {
          transform: scale(1.05);
        }
        .featured-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          background-color: var(--text-primary);
          color: var(--bg-card);
          font-size: 10px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
        }
        .offer-tag {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background-color: var(--primary);
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        .res-body {
          padding: 16px;
        }
        .res-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          gap: 12px;
        }
        .res-header h3 {
          font-size: 17px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }
        .res-rating {
          background-color: #22c55e;
          color: white;
          font-size: 12px;
          font-weight: 700;
          padding: 3px 6px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .res-cuisines {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .res-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          border-top: 1px dashed var(--border);
          padding-top: 12px;
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 500;
        }
        .res-meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .ml-auto {
          margin-left: auto;
        }
        .empty-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
          text-align: center;
        }
        .empty-emoji {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .empty-results h3 {
          font-size: 18px;
          margin-bottom: 8px;
        }
        .empty-results p {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .hero-content {
            flex-direction: column;
            text-align: center;
          }
          .hero-text-side h1 {
            font-size: 28px;
          }
          .quick-stats {
            justify-content: center;
          }
          .hero-graphic {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
