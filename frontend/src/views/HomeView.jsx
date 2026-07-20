import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Star, Clock, Filter, Flame, Heart, Sparkles, ChevronRight, Zap, Award, MapPin, TrendingUp, X } from 'lucide-react';
import { CUISINES } from '../data/restaurants';

export default function HomeView({ searchQuery }) {
  const { 
    restaurants, 
    setSelectedRestaurant, 
    setActiveView, 
    currentUser,
    selectedVillage,
    selectedDistrict,
    selectedState
  } = useCart();
  
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [vegOnly, setVegOnly] = useState(false);
  const [highlyRated, setHighlyRated] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState('');

  useEffect(() => {
    if (currentUser && currentUser.role === 'CUSTOMER') {
      fetch(`http://localhost:8080/api/ai/recommend?userId=${currentUser.id}`)
        .then(res => res.json())
        .then(data => setAiRecommendation(data.recommendation))
        .catch(() => {
          setAiRecommendation("Weekend Special: You usually order Biryani on weekends! Would you like to try the **Hyderabadi Chicken Biryani** or **Paneer Makhani Biryani** from *The Biryani Pavilion* today?");
        });
    }
  }, [currentUser]);

  const filteredRestaurants = useMemo(() => {
    let result = [...restaurants];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (Array.isArray(r.cuisines) ? r.cuisines : (r.cuisines || '').split(', ')).some(c => c.toLowerCase().includes(q))
      );
    }

    if (selectedCuisine !== 'all') {
      result = result.filter(r => {
        const cuisinesList = Array.isArray(r.cuisines) ? r.cuisines : (r.cuisines ? r.cuisines.split(', ') : []);
        return cuisinesList.some(c => c.toLowerCase() === selectedCuisine.toLowerCase());
      });
    }

    if (vegOnly) result = result.filter(r => r.vegOnly);
    if (highlyRated) result = result.filter(r => r.rating >= 4.5);

    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'time') {
      const getMinTime = (str) => parseInt(str?.split('-')[0]) || 0;
      result.sort((a, b) => getMinTime(a.deliveryTime) - getMinTime(b.deliveryTime));
    } else if (sortBy === 'costLow') result.sort((a, b) => a.costForTwo - b.costForTwo);
    else if (sortBy === 'costHigh') result.sort((a, b) => b.costForTwo - a.costForTwo);

    return result;
  }, [restaurants, selectedCuisine, sortBy, vegOnly, highlyRated, searchQuery]);

  const locationName = selectedVillage?.name || selectedDistrict?.name || selectedState?.name || 'your area';

  const activeFiltersCount = [selectedCuisine !== 'all', vegOnly, highlyRated].filter(Boolean).length;

  const resetFilters = () => {
    setVegOnly(false);
    setHighlyRated(false);
    setSelectedCuisine('all');
    setSortBy('default');
  };

  return (
    <div className="hv-root animate-fade-in">
      {/* Role Alert Banner */}
      {currentUser && currentUser.role !== 'CUSTOMER' && (
        <div className="hv-role-banner">
          <span>👋 You're signed in as a <strong>{currentUser.role}</strong> partner.</span>
          <button 
            className="hv-role-btn" 
            onClick={() => setActiveView(currentUser.role === 'RESTAURANT' ? 'dashboard-res' : 'dashboard-admin')}
          >
            Go to Dashboard →
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div className="hv-hero">
        <div className="hv-hero-bg" aria-hidden="true">
          <div className="hv-hero-blob hv-blob1" />
          <div className="hv-hero-blob hv-blob2" />
        </div>
        <div className="container hv-hero-inner">
          <div className="hv-hero-text">
            <div className="hv-hero-badge animate-slide-up">
              <Zap size={14} />
              <span>AI-Powered Food Discovery</span>
            </div>
            <h1 className="hv-hero-title animate-slide-up">
              Hungry? Order <span className="hv-hero-accent">delicious food</span><br/>to your doorstep.
            </h1>
            <p className="hv-hero-sub animate-slide-up">
              Freshly prepared meals from the best restaurants{selectedState ? ` in ${selectedState.name}` : ' across India'}.
            </p>
            <div className="hv-stats animate-slide-up">
              <div className="hv-stat-pill">
                <Star size={14} fill="currentColor" />
                <span>4.5+ Avg Rating</span>
              </div>
              <div className="hv-stat-pill">
                <Zap size={14} />
                <span>Superfast Delivery</span>
              </div>
              <div className="hv-stat-pill">
                <Award size={14} />
                <span>Pan-India Coverage</span>
              </div>
            </div>
          </div>
          <div className="hv-hero-visual" aria-hidden="true">
            <div className="hv-hero-genie">🧞‍♂️</div>
            <div className="hv-food-ring">
              {['🍕','🍔','🍜','🍚','🥗','🍣','🌮','🍰'].map((emoji, i) => (
                <span key={i} className="hv-food-dot" style={{ '--i': i }}>{emoji}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container hv-content">

        {/* AI Recommendation Banner */}
        {currentUser?.role === 'CUSTOMER' && aiRecommendation && (
          <div className="hv-ai-card animate-slide-up">
            <div className="hv-ai-left">
              <div className="hv-ai-icon-wrap">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="hv-ai-label">FoodGenie Smart Recommendation</div>
                <p className="hv-ai-text" dangerouslySetInnerHTML={{ 
                  __html: aiRecommendation
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/_(.*?)_/g, '<em>$1</em>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                }} />
              </div>
            </div>
            <div className="hv-ai-tag">AI Picks</div>
          </div>
        )}

        {/* Cuisine Categories */}
        <section className="hv-section">
          <h2 className="hv-section-title">What's on your mind?</h2>
          <div className="hv-cuisine-scroll">
            {CUISINES.map(cuisine => (
              <button
                key={cuisine.id}
                className={`hv-cuisine-pill ${selectedCuisine === cuisine.id ? 'active' : ''}`}
                onClick={() => setSelectedCuisine(selectedCuisine === cuisine.id ? 'all' : cuisine.id)}
              >
                <span className="hv-cuisine-icon">{cuisine.icon}</span>
                <span>{cuisine.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Collections Row */}
        <section className="hv-section">
          <div className="hv-collections">
            <div className="hv-collection hv-collection--fire" onClick={() => { setHighlyRated(true); setSortBy('rating'); }}>
              <div className="hv-col-emoji">🔥</div>
              <div>
                <div className="hv-col-title">Trending Now</div>
                <div className="hv-col-sub">Top-rated this week</div>
              </div>
              <ChevronRight size={16} className="hv-col-arrow" />
            </div>
            <div className="hv-collection hv-collection--offer" onClick={() => setSortBy('costLow')}>
              <div className="hv-col-emoji">🎉</div>
              <div>
                <div className="hv-col-title">Best Deals</div>
                <div className="hv-col-sub">Max savings & cashback</div>
              </div>
              <ChevronRight size={16} className="hv-col-arrow" />
            </div>
            <div className="hv-collection hv-collection--veg" onClick={() => setVegOnly(true)}>
              <div className="hv-col-emoji">🌿</div>
              <div>
                <div className="hv-col-title">Pure Veg Gems</div>
                <div className="hv-col-sub">100% vegetarian picks</div>
              </div>
              <ChevronRight size={16} className="hv-col-arrow" />
            </div>
            <div className="hv-collection hv-collection--new" onClick={() => setSortBy('time')}>
              <div className="hv-col-emoji">⚡</div>
              <div>
                <div className="hv-col-title">Express Delivery</div>
                <div className="hv-col-sub">Fastest kitchens near you</div>
              </div>
              <ChevronRight size={16} className="hv-col-arrow" />
            </div>
          </div>
        </section>

        {/* Filters & Sort Bar */}
        <section className="hv-filter-bar">
          <div className="hv-filter-left">
            <div className="hv-filter-label">
              <Filter size={14} />
              <span>Filters</span>
              {activeFiltersCount > 0 && <span className="hv-filter-count">{activeFiltersCount}</span>}
            </div>
            <button 
              className={`hv-filter-chip ${vegOnly ? 'hv-chip--active' : ''}`}
              onClick={() => setVegOnly(!vegOnly)}
            >
              <span className="badge-veg" />
              Pure Veg
            </button>
            <button 
              className={`hv-filter-chip ${highlyRated ? 'hv-chip--active' : ''}`}
              onClick={() => setHighlyRated(!highlyRated)}
            >
              <Star size={12} fill="currentColor" />
              Ratings 4.5+
            </button>
            {activeFiltersCount > 0 && (
              <button className="hv-clear-chip" onClick={resetFilters}>
                <X size={12} /> Clear
              </button>
            )}
          </div>
          <div className="hv-filter-right">
            <TrendingUp size={14} className="hv-sort-icon" />
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              className="hv-sort-select"
            >
              <option value="default">Relevance</option>
              <option value="rating">⭐ Rating: High to Low</option>
              <option value="time">⚡ Fastest Delivery</option>
              <option value="costLow">₹ Price: Low to High</option>
              <option value="costHigh">₹ Price: High to Low</option>
            </select>
          </div>
        </section>

        {/* Restaurants Grid */}
        <section className="hv-section">
          <div className="hv-section-head">
            <h2 className="hv-section-title">
              {selectedVillage ? `Restaurants in ${selectedVillage.name}` : 'Restaurants near you'}
            </h2>
            <span className="hv-results-badge">
              {filteredRestaurants.length} found
            </span>
          </div>

          {filteredRestaurants.length === 0 ? (
            <div className="hv-empty card">
              <div className="hv-empty-icon">🍽️</div>
              <h3>No restaurants match your filters</h3>
              <p>Try resetting filters, searching something else, or picking a different delivery location.</p>
              <button className="btn btn-primary" onClick={resetFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="hv-restaurant-grid">
              {filteredRestaurants.map((restaurant, idx) => (
                <div 
                  key={restaurant.id}
                  className="hv-res-card"
                  onClick={() => {
                    setSelectedRestaurant(restaurant);
                    setActiveView('restaurant');
                  }}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* Image */}
                  <div className="hv-res-img-wrap">
                    <img src={restaurant.image} alt={restaurant.name} className="hv-res-img" loading="lazy" />
                    <div className="hv-res-img-overlay" />
                    {restaurant.featured && (
                      <span className="hv-featured-tag">
                        <Award size={11} /> Gourmet Choice
                      </span>
                    )}
                    {restaurant.offer && (
                      <span className="hv-offer-tag">{restaurant.offer}</span>
                    )}
                    <div className="hv-delivery-badge">
                      <Clock size={11} />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="hv-res-body">
                    <div className="hv-res-top">
                      <h3 className="hv-res-name">{restaurant.name}</h3>
                      <div className="hv-res-rating">
                        <Star size={11} fill="white" />
                        <span>{restaurant.rating}</span>
                      </div>
                    </div>
                    <p className="hv-res-cuisines">
                      {(Array.isArray(restaurant.cuisines) ? restaurant.cuisines : (restaurant.cuisines || '').split(', ')).join(' • ')}
                    </p>
                    <div className="hv-res-meta">
                      <span className="hv-res-meta-item">
                        <MapPin size={11} /> {restaurant.distance}
                      </span>
                      <span className="hv-res-divider" />
                      <span className="hv-res-meta-item">₹{restaurant.costForTwo} for two</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <style>{`
        /* Root */
        .hv-root {
          min-height: 100vh;
          background: var(--bg-app);
        }

        /* Role Banner */
        .hv-role-banner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 10px 24px;
          background: linear-gradient(90deg, #f59e0b, #f97316);
          color: white;
          font-size: 13px;
          font-weight: 600;
        }
        .hv-role-btn {
          background: white;
          color: #d97706;
          border: none;
          padding: 4px 14px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .hv-role-btn:hover { transform: scale(1.04); }

        /* Hero */
        .hv-hero {
          position: relative;
          overflow: hidden;
          padding: 52px 0 40px;
          background: linear-gradient(160deg, hsl(20,100%,98%) 0%, hsl(340,60%,97%) 100%);
          border-bottom: 1px solid var(--border);
        }
        [data-theme="dark"] .hv-hero {
          background: linear-gradient(160deg, hsl(220,18%,11%) 0%, hsl(260,18%,10%) 100%);
        }
        .hv-hero-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .hv-hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.35;
        }
        .hv-blob1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, hsl(15,100%,70%), hsl(30,100%,80%));
          top: -120px; right: -80px;
        }
        .hv-blob2 {
          width: 280px; height: 280px;
          background: radial-gradient(circle, hsl(340,80%,70%), hsl(310,70%,80%));
          bottom: -60px; left: 10%;
        }
        .hv-hero-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          position: relative;
          z-index: 1;
        }
        .hv-hero-text { max-width: 520px; }
        .hv-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,75,26,0.1);
          color: var(--primary);
          border: 1px solid rgba(255,75,26,0.2);
          padding: 5px 12px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 18px;
          letter-spacing: 0.02em;
        }
        .hv-hero-title {
          font-size: clamp(26px, 4vw, 44px);
          line-height: 1.15;
          font-weight: 900;
          color: var(--text-primary);
          letter-spacing: -0.04em;
          margin-bottom: 14px;
        }
        .hv-hero-accent {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hv-hero-sub {
          color: var(--text-muted);
          font-size: 15px;
          line-height: 1.55;
          margin-bottom: 24px;
        }
        .hv-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .hv-stat-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 99px;
          padding: 7px 14px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-primary);
          box-shadow: var(--shadow-sm);
        }
        .hv-stat-pill svg { color: var(--primary); }

        /* Hero Visual */
        .hv-hero-visual {
          position: relative;
          width: 220px;
          height: 220px;
          flex-shrink: 0;
        }
        .hv-hero-genie {
          font-size: 70px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: float 3s ease-in-out infinite;
          filter: drop-shadow(0 8px 24px rgba(255,75,26,0.2));
          z-index: 2;
        }
        .hv-food-ring {
          position: absolute;
          inset: 0;
          animation: spin 20s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .hv-food-dot {
          position: absolute;
          font-size: 24px;
          top: 50%;
          left: 50%;
          transform: rotate(calc(var(--i) * 45deg)) translateY(-90px) rotate(calc(var(--i) * -45deg));
          transform-origin: 0 0;
        }

        /* Content */
        .hv-content { padding: 36px 0 60px; display: flex; flex-direction: column; gap: 32px; }

        /* AI Card */
        .hv-ai-card {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          background: linear-gradient(135deg, rgba(255,75,26,0.06), rgba(170,59,255,0.06));
          border: 1.5px solid rgba(255,75,26,0.2);
          border-radius: var(--radius-lg);
          padding: 20px 24px;
        }
        .hv-ai-left { display: flex; gap: 14px; align-items: flex-start; }
        .hv-ai-icon-wrap {
          width: 42px; height: 42px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(255,75,26,0.25);
        }
        .hv-ai-label {
          font-size: 11px;
          font-weight: 800;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
        }
        .hv-ai-text {
          font-size: 13px;
          color: var(--text-primary);
          line-height: 1.5;
        }
        .hv-ai-tag {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          font-size: 10px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 99px;
          flex-shrink: 0;
          letter-spacing: 0.04em;
        }

        /* Section */
        .hv-section { display: flex; flex-direction: column; gap: 16px; }
        .hv-section-head { display: flex; align-items: center; gap: 12px; }
        .hv-section-title {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-primary);
        }
        .hv-results-badge {
          background: rgba(255,75,26,0.1);
          color: var(--primary);
          font-size: 12px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 99px;
        }

        /* Cuisine Pills */
        .hv-cuisine-scroll {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 6px;
          scrollbar-width: none;
        }
        .hv-cuisine-scroll::-webkit-scrollbar { display: none; }
        .hv-cuisine-pill {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 16px;
          border-radius: 99px;
          border: 1.5px solid var(--border);
          background: var(--bg-card);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all var(--transition-fast);
          flex-shrink: 0;
          box-shadow: var(--shadow-sm);
        }
        .hv-cuisine-pill:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(255,75,26,0.05);
          transform: translateY(-1px);
        }
        .hv-cuisine-pill.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: 0 4px 16px rgba(255,75,26,0.25);
        }
        .hv-cuisine-icon { font-size: 18px; }

        /* Collections */
        .hv-collections {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .hv-collection {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-normal);
          border: 1.5px solid var(--border);
          background: var(--bg-card);
          position: relative;
          overflow: hidden;
        }
        .hv-collection:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
        .hv-collection--fire { border-color: rgba(239,68,68,0.2); background: linear-gradient(135deg, rgba(239,68,68,0.04), rgba(251,146,60,0.04)); }
        .hv-collection--offer { border-color: rgba(59,130,246,0.2); background: linear-gradient(135deg, rgba(59,130,246,0.04), rgba(99,102,241,0.04)); }
        .hv-collection--veg { border-color: rgba(34,197,94,0.2); background: linear-gradient(135deg, rgba(34,197,94,0.04), rgba(16,185,129,0.04)); }
        .hv-collection--new { border-color: rgba(168,85,247,0.2); background: linear-gradient(135deg, rgba(168,85,247,0.04), rgba(236,72,153,0.04)); }
        .hv-col-emoji { font-size: 26px; flex-shrink: 0; }
        .hv-col-title { font-size: 13px; font-weight: 800; color: var(--text-primary); }
        .hv-col-sub { font-size: 11px; color: var(--text-muted); font-weight: 500; margin-top: 2px; }
        .hv-col-arrow { color: var(--text-muted); flex-shrink: 0; margin-left: auto; }

        /* Filter Bar */
        .hv-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 18px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
        }
        .hv-filter-left {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .hv-filter-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .hv-filter-count {
          background: var(--primary);
          color: white;
          border-radius: 99px;
          font-size: 10px;
          font-weight: 900;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hv-filter-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 99px;
          border: 1.5px solid var(--border);
          background: var(--bg-app);
          color: var(--text-muted);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .hv-filter-chip:hover { border-color: var(--primary); color: var(--primary); }
        .hv-filter-chip.hv-chip--active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: 0 2px 8px rgba(255,75,26,0.2);
        }
        .hv-clear-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: 99px;
          border: 1.5px solid rgba(239,68,68,0.3);
          background: rgba(239,68,68,0.05);
          color: #ef4444;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .hv-clear-chip:hover { background: #ef4444; color: white; }
        .hv-filter-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .hv-sort-icon { color: var(--text-muted); }
        .hv-sort-select {
          border: 1.5px solid var(--border);
          background: var(--bg-app);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 600;
          font-family: var(--font-body);
          padding: 7px 12px;
          border-radius: var(--radius-md);
          outline: none;
          cursor: pointer;
          transition: border-color var(--transition-fast);
        }
        .hv-sort-select:focus { border-color: var(--primary); }

        /* Restaurant Grid */
        .hv-restaurant-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .hv-res-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: pointer;
          transition: all var(--transition-normal);
          animation: fadeInUp 0.4s ease both;
        }
        .hv-res-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
          border-color: rgba(255,75,26,0.15);
        }
        .hv-res-img-wrap {
          position: relative;
          width: 100%;
          height: 180px;
          overflow: hidden;
        }
        .hv-res-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .hv-res-card:hover .hv-res-img { transform: scale(1.06); }
        .hv-res-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.45) 100%);
        }
        .hv-featured-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          display: flex;
          align-items: center;
          gap: 5px;
          background: linear-gradient(135deg, #f59e0b, #f97316);
          color: white;
          font-size: 10px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 99px;
          letter-spacing: 0.03em;
        }
        .hv-offer-tag {
          position: absolute;
          bottom: 10px;
          left: 12px;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          color: #fbbf24;
          font-size: 10px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 99px;
        }
        .hv-delivery-badge {
          position: absolute;
          bottom: 10px;
          right: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 99px;
        }
        .hv-res-body { padding: 14px 16px 16px; }
        .hv-res-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 6px;
        }
        .hv-res-name {
          font-size: 15px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.3;
        }
        .hv-res-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #22c55e;
          color: white;
          font-size: 12px;
          font-weight: 800;
          padding: 4px 9px;
          border-radius: 99px;
          flex-shrink: 0;
        }
        .hv-res-cuisines {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 10px;
          line-height: 1.4;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .hv-res-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 600;
        }
        .hv-res-meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .hv-res-divider {
          width: 3px;
          height: 3px;
          background: var(--text-muted);
          border-radius: 50%;
        }

        /* Empty State */
        .hv-empty {
          padding: 56px 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          border-radius: var(--radius-lg);
        }
        .hv-empty-icon { font-size: 52px; }
        .hv-empty h3 { font-size: 18px; }
        .hv-empty p { color: var(--text-muted); font-size: 14px; max-width: 360px; line-height: 1.6; }

        /* Responsive */
        @media (max-width: 900px) {
          .hv-collections { grid-template-columns: repeat(2, 1fr); }
          .hv-hero-visual { display: none; }
        }
        @media (max-width: 640px) {
          .hv-hero { padding: 36px 0 28px; }
          .hv-hero-title { font-size: 26px; }
          .hv-collections { grid-template-columns: 1fr 1fr; gap: 8px; }
          .hv-collection { padding: 12px; gap: 8px; }
          .hv-col-emoji { font-size: 20px; }
          .hv-restaurant-grid { grid-template-columns: 1fr; }
          .hv-filter-bar { flex-direction: column; align-items: flex-start; }
          .hv-filter-right { align-self: flex-end; }
          .hv-ai-card { flex-direction: column; }
          .hv-stats { gap: 6px; }
        }
      `}</style>
    </div>
  );
}
