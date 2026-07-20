import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();
const API_BASE = 'http://localhost:8080/api';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activeRestaurant, setActiveRestaurant] = useState(null); // Restaurant from which items are currently added
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // Restaurant page currently viewed
  const [activeView, setActiveView] = useState('home'); // 'home', 'restaurant', 'checkout', 'tracking', 'dashboard-res', 'dashboard-admin', 'auth'
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('foodgenie-theme') || 'light';
  });

  // Location Selector states
  const [locations, setLocations] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);

  // User Authentication & Roles
  const [currentUser, setCurrentUser] = useState(() => {
    // Default mock user to make it instantly usable
    return { id: 1, username: 'lokesh', role: 'CUSTOMER', email: 'lokesh@foodgenie.com', address: 'Indiranagar, Bangalore' };
  });
  const [authError, setAuthError] = useState('');

  // Coupons
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Active Order State for Tracking
  const [activeOrder, setActiveOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);

  // Fetch Locations on load
  useEffect(() => {
    fetch(`${API_BASE}/locations`)
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(err => {
        console.warn('Backend not running, loading comprehensive India locations from local data.', err);
        // Import and use comprehensive all-India location data as fallback
        import('../data/indiaLocations').then(module => {
          setLocations(module.INDIA_LOCATIONS);
        });
      });
  }, []);

  // Fetch Restaurants when selected Village/Town location changes
  useEffect(() => {
    let url = `${API_BASE}/restaurants`;
    if (selectedVillage) {
      url += `?locationNodeId=${selectedVillage.id}`;
    }
    
    fetch(url)
      .then(res => res.json())
      .then(data => setRestaurants(data))
      .catch(err => {
        console.warn('Backend not running, loading local mock restaurants.', err);
        // Fallback filter
        import('../data/restaurants').then(module => {
          let list = [...module.RESTAURANTS];
          if (selectedVillage) {
            if (selectedVillage.name === 'Indiranagar') {
              list = list.filter(r => r.id === 1 || r.id === 2);
            } else if (selectedVillage.name === 'Koramangala') {
              list = list.filter(r => r.id === 3 || r.id === 4);
            } else if (selectedVillage.name === 'Kothrud') {
              list = list.filter(r => r.id === 5 || r.id === 6);
            } else if (selectedVillage.name === 'Connaught Place') {
              list = list.filter(r => r.id === 7 || r.id === 8);
            }
          }
          setRestaurants(list);
        });
      });
  }, [selectedVillage]);

  // Load Order History
  useEffect(() => {
    if (currentUser && currentUser.role === 'CUSTOMER') {
      fetch(`${API_BASE}/orders/history?userId=${currentUser.id}`)
        .then(res => res.json())
        .then(data => setOrderHistory(data))
        .catch(err => console.log('Order history fetch offline.', err));
    }
  }, [currentUser, activeOrder]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('foodgenie-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Auth Operations
  const handleRegister = (username, password, email, role) => {
    setAuthError('');
    return fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email, role })
    })
      .then(res => {
        if (!res.ok) throw new Error('Registration failed');
        return res.json();
      })
      .then(user => {
        setCurrentUser(user);
        setActiveView('home');
        return true;
      })
      .catch(err => {
        setAuthError(err.message);
        return false;
      });
  };

  const handleLogin = (username, password) => {
    setAuthError('');
    return fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => {
        if (!res.ok) throw new Error('Invalid credentials');
        return res.json();
      })
      .then(user => {
        setCurrentUser(user);
        if (user.role === 'RESTAURANT') {
          setActiveView('dashboard-res');
        } else if (user.role === 'ADMIN') {
          setActiveView('dashboard-admin');
        } else {
          setActiveView('home');
        }
        return true;
      })
      .catch(err => {
        setAuthError(err.message);
        return false;
      });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    clearCart();
    setActiveView('home');
  };

  // Add Item to Cart
  const addToCart = (item, restaurant) => {
    if (cart.length > 0 && activeRestaurant && activeRestaurant.id !== restaurant.id) {
      if (window.confirm(`Your cart contains items from "${activeRestaurant.name}". Would you like to discard those items and add items from "${restaurant.name}" instead?`)) {
        setCart([{ ...item, quantity: 1 }]);
        setActiveRestaurant(restaurant);
        setAppliedCoupon(null);
      }
      return;
    }

    if (cart.length === 0) {
      setActiveRestaurant(restaurant);
    }

    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Remove Item / Decrease Quantity
  const removeFromCart = (itemId) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (!existing) return prev;
      
      let updated;
      if (existing.quantity === 1) {
        updated = prev.filter(i => i.id !== itemId);
      } else {
        updated = prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
      }

      if (updated.length === 0) {
        setActiveRestaurant(null);
        setAppliedCoupon(null);
      }
      return updated;
    });
  };

  // Update item quantity directly
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i));
  };

  // Clear Cart
  const clearCart = () => {
    setCart([]);
    setActiveRestaurant(null);
    setAppliedCoupon(null);
  };

  // Apply Coupon Code
  const applyCoupon = (code) => {
    setCouponError('');
    import('../data/restaurants').then(module => {
      const coupon = module.COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
      
      if (!coupon) {
        setCouponError('Invalid Coupon Code');
        return;
      }

      const subtotal = getSubtotal();
      if (subtotal < coupon.minOrder) {
        setCouponError(`Minimum order of ₹${coupon.minOrder} required.`);
        return;
      }

      setAppliedCoupon(coupon);
    });
  };

  // Remove Coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  // Cart Math
  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = getSubtotal();
    if (appliedCoupon.type === 'flat') {
      return appliedCoupon.discount;
    } else {
      const pctDiscount = (subtotal * appliedCoupon.discount) / 100;
      return Math.min(pctDiscount, appliedCoupon.maxDiscount);
    }
  };

  const getDeliveryFee = () => {
    if (cart.length === 0) return 0;
    if (appliedCoupon && appliedCoupon.code === 'FREEFEE') return 0;
    return 39; // Flat Delivery Fee
  };

  const getPlatformFee = () => {
    return cart.length > 0 ? 5 : 0;
  };

  const getGST = () => {
    return Math.round(getSubtotal() * 0.05); // 5% GST
  };

  const getTotal = () => {
    const total = getSubtotal() - getDiscount() + getDeliveryFee() + getPlatformFee() + getGST();
    return Math.max(0, Math.round(total));
  };

  // Place Order API Integration
  const placeOrder = (address, paymentMethod) => {
    if (cart.length === 0) return;

    const payload = {
      userId: currentUser?.id || 1,
      restaurantId: activeRestaurant.id,
      subtotal: getSubtotal(),
      discount: getDiscount(),
      deliveryFee: getDeliveryFee(),
      platformFee: getPlatformFee(),
      gst: getGST(),
      total: getTotal(),
      couponCode: appliedCoupon?.code || '',
      deliveryAddress: address.detail,
      paymentMethod: paymentMethod,
      items: cart.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Order submission failed');
        return res.json();
      })
      .then(order => {
        // Hydrate order details with restaurant data for tracking page
        order.restaurant = activeRestaurant;
        order.items = [...cart];
        setActiveOrder(order);
        clearCart();
        setActiveView('tracking');
      })
      .catch(err => {
        console.warn('Backend offline, running local mock order checkout.', err);
        // Fallback local checkout simulation
        const mockOrder = {
          id: `GENIE-${Math.floor(100000 + Math.random() * 900000)}`,
          restaurant: activeRestaurant,
          items: [...cart],
          total: getTotal(),
          status: 'confirmed',
          timestamp: new Date().toISOString()
        };
        setActiveOrder(mockOrder);
        clearCart();
        setActiveView('tracking');
      });
  };

  return (
    <CartContext.Provider value={{
      cart,
      restaurants,
      activeRestaurant,
      selectedRestaurant,
      activeView,
      theme,
      locations,
      selectedState,
      selectedDistrict,
      selectedVillage,
      currentUser,
      authError,
      appliedCoupon,
      couponError,
      activeOrder,
      orderHistory,
      setSelectedState,
      setSelectedDistrict,
      setSelectedVillage,
      setSelectedRestaurant,
      setActiveView,
      setCurrentUser,
      toggleTheme,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
      getSubtotal,
      getDiscount,
      getDeliveryFee,
      getPlatformFee,
      getGST,
      getTotal,
      placeOrder,
      handleRegister,
      handleLogin,
      handleLogout,
      setActiveOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};
