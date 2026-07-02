import React, { createContext, useState, useContext, useEffect } from 'react';
import { COUPONS } from '../data/restaurants';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [activeRestaurant, setActiveRestaurant] = useState(null); // Restaurant from which items are currently added
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // Restaurant page currently viewed
  const [activeView, setActiveView] = useState('home'); // 'home', 'restaurant', 'checkout', 'tracking'
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('yumzy-theme') || 'light';
  });

  // Coupons
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Active Order State for Tracking
  const [activeOrder, setActiveOrder] = useState(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('yumzy-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Add Item to Cart
  const addToCart = (item, restaurant) => {
    // If cart has items and they are from a different restaurant, show a warning or clear cart
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
    const coupon = COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    
    if (!coupon) {
      setCouponError('Invalid Coupon Code');
      return false;
    }

    const subtotal = getSubtotal();
    if (subtotal < coupon.minOrder) {
      setCouponError(`Minimum order of ₹${coupon.minOrder} required for this coupon.`);
      return false;
    }

    setAppliedCoupon(coupon);
    return true;
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
    // Check if free delivery coupon is active
    if (appliedCoupon && appliedCoupon.code === 'FREEFEE') {
      return 0;
    }
    return 39; // Flat Delivery Fee
  };

  const getPlatformFee = () => {
    return cart.length > 0 ? 5 : 0; // Flat platform fee
  };

  const getGST = () => {
    return Math.round(getSubtotal() * 0.05); // 5% GST on food
  };

  const getTotal = () => {
    const total = getSubtotal() - getDiscount() + getDeliveryFee() + getPlatformFee() + getGST();
    return Math.max(0, Math.round(total));
  };

  // Place Order
  const placeOrder = (address, paymentMethod) => {
    if (cart.length === 0) return;

    const order = {
      id: `YUM-${Math.floor(100000 + Math.random() * 900000)}`,
      restaurant: activeRestaurant,
      items: [...cart],
      totals: {
        subtotal: getSubtotal(),
        discount: getDiscount(),
        deliveryFee: getDeliveryFee(),
        platformFee: getPlatformFee(),
        gst: getGST(),
        total: getTotal(),
      },
      couponCode: appliedCoupon?.code || null,
      address,
      paymentMethod,
      timestamp: new Date().toISOString(),
      status: 'confirmed' // 'confirmed', 'preparing', 'delivering', 'delivered'
    };

    setActiveOrder(order);
    clearCart();
    setActiveView('tracking');
  };

  return (
    <CartContext.Provider value={{
      cart,
      activeRestaurant,
      selectedRestaurant,
      activeView,
      theme,
      appliedCoupon,
      couponError,
      activeOrder,
      setSelectedRestaurant,
      setActiveView,
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
      setActiveOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};
