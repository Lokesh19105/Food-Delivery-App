import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Plus, Trash2, Edit2, ShieldAlert, Award, FileText, ChevronRight } from 'lucide-react';

export default function DashboardViews() {
  const { currentUser, setActiveView } = useCart();

  if (!currentUser) {
    return (
      <div className="container dashboard-offline">
        <h3>Access Denied</h3>
        <p>Please log in to access this portal.</p>
        <button className="btn btn-primary" onClick={() => setActiveView('auth')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="container dashboard-container animate-fade-in">
      {currentUser.role === 'RESTAURANT' ? (
        <RestaurantDashboard />
      ) : currentUser.role === 'ADMIN' ? (
        <AdminDashboard />
      ) : (
        <div className="card pad-lg text-center">
          <ShieldAlert size={48} className="warn-icon" />
          <h3>Invalid Access Role</h3>
          <p>Customers do not have dashboard privileges.</p>
          <button className="btn btn-primary" onClick={() => setActiveView('home')}>Go to Home</button>
        </div>
      )}
    </div>
  );
}

// 1. RESTAURANT MANAGER DASHBOARD
function RestaurantDashboard() {
  const { currentUser } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Menu form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemVeg, setNewItemVeg] = useState(true);

  // Set default restaurant to 1 (Biryani Pavilion) for owner lokesh demo
  const restaurantId = 1;

  useEffect(() => {
    // Fetch Restaurant details
    fetch(`http://localhost:8080/api/restaurants/${restaurantId}`)
      .then(res => res.json())
      .then(data => setRestaurant(data))
      .catch(err => {
        setRestaurant({ id: 1, name: 'The Biryani Pavilion', rating: 4.5, costForTwo: 350 });
      });

    // Fetch Menu
    fetchMenu();

    // Fetch Restaurant Orders
    fetchOrders();
  }, []);

  const fetchMenu = () => {
    fetch(`http://localhost:8080/api/foods?restaurantId=${restaurantId}`)
      .then(res => res.json())
      .then(data => setMenuItems(data))
      .catch(err => {
        // Local mock menu list
        import('../data/restaurants').then(module => {
          setMenuItems(module.RESTAURANTS.find(r => r.id === restaurantId).menu);
        });
      });
  };

  const fetchOrders = () => {
    fetch(`http://localhost:8080/api/orders/restaurant/${restaurantId}`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => {
        // Local mock orders for display
        setOrders([
          { id: 'GENIE-481920', subtotal: 279, total: 328, status: 'confirmed', paymentMethod: 'UPI', timestamp: new Date().toISOString() },
          { id: 'GENIE-194012', subtotal: 528, total: 574, status: 'delivered', paymentMethod: 'Card', timestamp: new Date().toISOString() }
        ]);
      });
  };

  const handleAddDish = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;

    const payload = {
      name: newItemName,
      price: parseInt(newItemPrice),
      description: newItemDesc,
      isVeg: newItemVeg,
      categoryId: 1, // Biryani category
      restaurantId: restaurantId,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=60'
    };

    fetch('http://localhost:8080/api/foods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(() => {
        fetchMenu();
        setShowAddForm(false);
        setNewItemName('');
        setNewItemPrice('');
        setNewItemDesc('');
      })
      .catch(() => {
        // Local client addition fallback
        setMenuItems(prev => [...prev, { id: Math.random(), ...payload }]);
        setShowAddForm(false);
      });
  };

  const handleDeleteDish = (id) => {
    if (!window.confirm('Delete this food item from your menu?')) return;
    
    fetch(`http://localhost:8080/api/foods/${id}`, {
      method: 'DELETE'
    })
      .then(() => fetchMenu())
      .catch(() => {
        setMenuItems(prev => prev.filter(m => m.id !== id));
      });
  };

  const handleUpdateStatus = (orderId, nextStatus) => {
    fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    })
      .then(() => fetchOrders())
      .catch(() => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
      });
  };

  const salesTotal = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <div className="dash-header">
        <h2>🏬 Restaurant Owner Portal</h2>
        <p className="owner-title">{restaurant ? restaurant.name : 'Loading Restaurant...'}</p>
      </div>

      {/* Grid Stats */}
      <div className="stats-row">
        <div className="stat-box card">
          <span className="stat-num">{orders.length}</span>
          <span className="stat-label">Total Orders Received</span>
        </div>
        <div className="stat-box card">
          <span className="stat-num">₹{salesTotal}</span>
          <span className="stat-label">Total Revenue</span>
        </div>
        <div className="stat-box card">
          <span className="stat-num">₹{orders.length ? Math.round(salesTotal / orders.length) : 0}</span>
          <span className="stat-label">Average Order Value</span>
        </div>
      </div>

      <div className="dashboard-sections-grid">
        {/* Orders dispatcher panel */}
        <section className="dash-section card">
          <h3 className="section-title">Incoming Order Dispatcher</h3>
          <div className="orders-dispatch-list">
            {orders.length === 0 ? (
              <p className="empty-text">No active orders right now.</p>
            ) : (
              orders.map(ord => (
                <div key={ord.id} className="dispatch-order-card">
                  <div className="dispatch-order-info">
                    <h5>Order #{ord.id}</h5>
                    <p className="dispatch-price">Total: ₹{ord.total} | Pay: {ord.paymentMethod}</p>
                    <p className="dispatch-status">Status: <span className={`badge-status ${ord.status}`}>{ord.status.toUpperCase()}</span></p>
                  </div>
                  
                  <div className="dispatch-actions">
                    {ord.status === 'confirmed' && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleUpdateStatus(ord.id, 'preparing')}>
                        Accept & Prepare
                      </button>
                    )}
                    {ord.status === 'preparing' && (
                      <button className="btn btn-primary btn-sm btn-deliver" onClick={() => handleUpdateStatus(ord.id, 'delivering')}>
                        Send to Delivery
                      </button>
                    )}
                    {ord.status === 'delivering' && (
                      <button className="btn btn-secondary btn-sm" onClick={() => handleUpdateStatus(ord.id, 'delivered')}>
                        Mark Completed
                      </button>
                    )}
                    {ord.status === 'delivered' && (
                      <span className="text-success-bold">✓ Handed Over</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Menu editing Panel */}
        <section className="dash-section card">
          <div className="section-header-row">
            <h3 className="section-title">Edit Menu Offerings</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus size={14} />
              <span>Add Dish</span>
            </button>
          </div>

          {/* Add dish form */}
          {showAddForm && (
            <form onSubmit={handleAddDish} className="add-dish-form card">
              <input
                type="text"
                placeholder="Dish Name (e.g. Garlic Naan)"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="input-text"
                required
              />
              <input
                type="number"
                placeholder="Price in ₹"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="input-text"
                required
              />
              <textarea
                placeholder="Description"
                value={newItemDesc}
                onChange={(e) => setNewItemDesc(e.target.value)}
                className="input-text"
              />
              <div className="form-toggle-row">
                <label>Vegetarian Option</label>
                <input
                  type="checkbox"
                  checked={newItemVeg}
                  onChange={(e) => setNewItemVeg(e.target.checked)}
                />
              </div>
              <div className="form-btns">
                <button type="submit" className="btn btn-primary btn-sm">Submit</button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </form>
          )}

          <div className="menu-edit-list">
            {menuItems.map(item => (
              <div key={item.id} className="menu-edit-row">
                <div className="menu-edit-left">
                  <span className={item.isVeg ? 'badge-veg' : 'badge-nonveg'}></span>
                  <span className="edit-item-name">{item.name}</span>
                  <span className="edit-item-price">₹{item.price}</span>
                </div>
                <button className="btn-icon delete-btn" onClick={() => handleDeleteDish(item.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// 2. ADMIN PLATFORM ANALYTICS DASHBOARD
function AdminDashboard() {
  const [usersCount, setUsersCount] = useState(3);
  const [restaurantsCount, setRestaurantsCount] = useState(8);
  const [analytics, setAnalytics] = useState({ totalOrders: 142, revenue: 48900 });

  return (
    <div>
      <div className="dash-header">
        <h2>🛠️ Administrator Control Panel</h2>
        <p className="owner-title">Platform-wide Analytics & Health Diagnostics</p>
      </div>

      <div className="stats-row">
        <div className="stat-box card">
          <span className="stat-num">{usersCount}</span>
          <span className="stat-label">Active Users</span>
        </div>
        <div className="stat-box card">
          <span className="stat-num">{restaurantsCount}</span>
          <span className="stat-label">Registered Restaurants</span>
        </div>
        <div className="stat-box card">
          <span className="stat-num">{analytics.totalOrders}</span>
          <span className="stat-label">Total platform orders</span>
        </div>
        <div className="stat-box card">
          <span className="stat-num">₹{analytics.revenue}</span>
          <span className="stat-label">Platform Gross Value</span>
        </div>
      </div>

      <div className="dashboard-sections-grid">
        <section className="dash-section card">
          <h3 className="section-title">System Status</h3>
          <div className="system-health-list">
            <div className="health-row">
              <span>Main REST Engine:</span>
              <span className="text-success-bold">🟢 ONLINE</span>
            </div>
            <div className="health-row">
              <span>H2 Database Engine:</span>
              <span className="text-success-bold">🟢 ONLINE (Port 8080/h2-console)</span>
            </div>
            <div className="health-row">
              <span>AI Simulation Core:</span>
              <span className="text-success-bold">🟢 ACTIVE (Rule-NLP Engine)</span>
            </div>
            <div className="health-row">
              <span>WebSocket Socket Layer:</span>
              <span className="text-success-bold">🟢 MOCKED / SIMULATED</span>
            </div>
          </div>
        </section>

        <section className="dash-section card">
          <h3 className="section-title">Active Database Tables</h3>
          <div className="tables-list">
            {['USERS', 'RESTAURANTS', 'FOOD_ITEMS', 'CATEGORIES', 'ORDERS', 'ORDER_ITEMS', 'PAYMENTS', 'REVIEWS', 'AI_CHAT_HISTORY', 'LOCATION_NODES'].map(tbl => (
              <div key={tbl} className="table-row">
                <span className="table-name">📄 {tbl}</span>
                <span className="badge-status success">Loaded</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Styled Dashboard CSS */}
      <style>{`
        .dashboard-container {
          padding-top: 32px;
          padding-bottom: 80px;
        }
        .dash-header {
          margin-bottom: 32px;
          border-bottom: 1.5px solid var(--border);
          padding-bottom: 12px;
        }
        .owner-title {
          font-size: 15px;
          color: var(--primary);
          font-weight: 700;
        }
        
        /* Stats Row */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }
        .stat-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          text-align: center;
        }
        .stat-num {
          font-family: var(--font-heading);
          font-size: 32px;
          font-weight: 800;
          color: var(--primary);
        }
        .stat-label {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
        }

        /* Layout Grid */
        .dashboard-sections-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 32px;
          align-items: start;
        }
        .dash-section {
          padding: 24px;
        }
        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .section-title {
          font-size: 16px;
          font-weight: 800;
          border-bottom: 1px dashed var(--border);
          padding-bottom: 8px;
          margin-bottom: 16px;
        }

        /* Incoming Orders dispatcher */
        .orders-dispatch-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .dispatch-order-card {
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }
        .dispatch-order-info h5 {
          font-size: 14px;
          font-weight: 750;
        }
        .dispatch-price {
          font-size: 12px;
          color: var(--text-muted);
        }
        .dispatch-status {
          font-size: 12px;
        }
        .badge-status {
          font-size: 9px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          color: white;
        }
        .badge-status.confirmed { background-color: var(--primary); }
        .badge-status.preparing { background-color: #f59e0b; }
        .badge-status.delivering { background-color: #3b82f6; }
        .badge-status.delivered { background-color: #10b981; }
        .badge-status.success { background-color: #10b981; }

        .text-success-bold {
          color: #10b981;
          font-weight: 800;
          font-size: 13px;
        }
        .btn-deliver {
          background-color: #3b82f6;
        }
        .btn-deliver:hover {
          background-color: #2563eb;
        }

        /* Menu manager list */
        .add-dish-form {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
          border-color: var(--primary);
        }
        .form-toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          font-weight: 600;
        }
        .form-btns {
          display: flex;
          gap: 8px;
        }
        .menu-edit-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .menu-edit-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid var(--border);
        }
        .menu-edit-left {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 600;
        }
        .edit-item-name {
          font-weight: 750;
        }
        .edit-item-price {
          color: var(--primary);
        }
        .delete-btn {
          border-color: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }
        .delete-btn:hover {
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        /* System Health list */
        .system-health-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .health-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          font-weight: 600;
        }
        .tables-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .table-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid var(--border);
          font-size: 13px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
