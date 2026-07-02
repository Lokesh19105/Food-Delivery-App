import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowLeft, Percent, CreditCard, Landmark, Truck, Wallet } from 'lucide-react';

export default function CheckoutView() {
  const {
    cart,
    activeRestaurant,
    setActiveView,
    updateQuantity,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getDeliveryFee,
    getPlatformFee,
    getGST,
    getTotal,
    placeOrder
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('home');
  const [selectedPayment, setSelectedPayment] = useState('upi');

  const addresses = [
    { id: 'home', label: '🏠 Home', detail: 'Flat 402, Block C, Silver Oak Apartments, Indiranagar, Bengaluru' },
    { id: 'office', label: '💼 Office', detail: 'Tower B, 6th Floor, Tech Park, Outer Ring Road, Bengaluru' }
  ];

  const paymentMethods = [
    { id: 'upi', label: 'UPI (GPay / PhonePe / PayTM)', icon: <Wallet size={18} /> },
    { id: 'card', label: 'Credit / Debit / ATM Card', icon: <CreditCard size={18} /> },
    { id: 'net', label: 'Net Banking', icon: <Landmark size={18} /> },
    { id: 'cod', label: 'Cash on Delivery (COD)', icon: <Truck size={18} /> }
  ];

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      const success = applyCoupon(couponInput.trim());
      if (success) setCouponInput('');
    }
  };

  const handleCheckout = () => {
    const addressObj = addresses.find(a => a.id === selectedAddress);
    const paymentObj = paymentMethods.find(p => p.id === selectedPayment);
    placeOrder(addressObj, paymentObj.label);
  };

  if (cart.length === 0) {
    return (
      <div className="container empty-checkout-container animate-fade-in">
        <div className="empty-cart-card card">
          <ShoppingBag size={48} className="empty-icon" />
          <h2>Your cart is empty</h2>
          <p>Go back to the homepage and select items to order.</p>
          <button className="btn btn-primary" onClick={() => setActiveView('home')}>
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container checkout-container animate-fade-in">
      <div className="checkout-header">
        <button className="btn-back-res" onClick={() => setActiveView('restaurant')}>
          <ArrowLeft size={16} />
          <span>Back to Menu</span>
        </button>
        <h2>Secure Checkout</h2>
      </div>

      <div className="checkout-grid">
        {/* Left Side: Delivery Details, Address, and Payments */}
        <div className="checkout-left">
          {/* Address Section */}
          <section className="checkout-section card">
            <h3 className="section-title-checkout">1. Select Delivery Address</h3>
            <div className="address-options">
              {addresses.map(addr => (
                <div
                  key={addr.id}
                  className={`address-card ${selectedAddress === addr.id ? 'active' : ''}`}
                  onClick={() => setSelectedAddress(addr.id)}
                >
                  <div className="address-header-row">
                    <span className="address-label">{addr.label}</span>
                    <input
                      type="radio"
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                      className="radio-input"
                    />
                  </div>
                  <p className="address-detail">{addr.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Payment Section */}
          <section className="checkout-section card">
            <h3 className="section-title-checkout">2. Choose Payment Method</h3>
            <div className="payment-options">
              {paymentMethods.map(pay => (
                <div
                  key={pay.id}
                  className={`payment-card ${selectedPayment === pay.id ? 'active' : ''}`}
                  onClick={() => setSelectedPayment(pay.id)}
                >
                  <div className="payment-left-row">
                    <span className="payment-icon">{pay.icon}</span>
                    <span className="payment-label">{pay.label}</span>
                  </div>
                  <input
                    type="radio"
                    checked={selectedPayment === pay.id}
                    onChange={() => setSelectedPayment(pay.id)}
                    className="radio-input"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Side: Order Review, Coupon & Bill Summary */}
        <div className="checkout-right">
          {/* Cart Review */}
          <section className="checkout-section card">
            <h3 className="section-title-checkout">Order Review</h3>
            <p className="order-res-name">From <strong>{activeRestaurant?.name}</strong></p>
            
            <div className="cart-items-list">
              {cart.map(item => (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-item-details">
                    <span className={item.isVeg ? 'badge-veg' : 'badge-nonveg'}></span>
                    <span className="cart-item-name">{item.name}</span>
                  </div>
                  
                  <div className="cart-item-actions">
                    <div className="mini-qty-controller">
                      <button className="mini-qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span className="mini-qty-val">{item.quantity}</span>
                      <button className="mini-qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <span className="cart-item-price">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Coupon Engine */}
          <section className="checkout-section card">
            <h3 className="section-title-checkout">Offers & Coupons</h3>
            {appliedCoupon ? (
              <div className="coupon-applied-box">
                <div className="coupon-applied-details">
                  <Percent size={18} className="coupon-icon-check" />
                  <div>
                    <p className="coupon-code-success">'{appliedCoupon.code}' Applied</p>
                    <p className="coupon-desc-success">{appliedCoupon.description}</p>
                  </div>
                </div>
                <button className="btn-remove-coupon" onClick={removeCoupon}>Remove</button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="coupon-form">
                <input
                  type="text"
                  placeholder="Enter Promo Code (e.g., YUMZY50)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="input-text coupon-input"
                />
                <button type="submit" className="btn btn-primary btn-apply">Apply</button>
              </form>
            )}
            {couponError && <p className="coupon-error-text">{couponError}</p>}
            
            {/* Display list of active coupons for user friendliness */}
            {!appliedCoupon && (
              <div className="suggested-coupons">
                <p className="suggested-title">Available Coupons:</p>
                <div className="coupons-scroller">
                  <div className="suggested-coupon-badge" onClick={() => applyCoupon('YUMZY50')}>
                    <strong>YUMZY50</strong> - 50% off
                  </div>
                  <div className="suggested-coupon-badge" onClick={() => applyCoupon('SUPER30')}>
                    <strong>SUPER30</strong> - 30% off
                  </div>
                  <div className="suggested-coupon-badge" onClick={() => applyCoupon('FLAT100')}>
                    <strong>FLAT100</strong> - ₹100 off
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Bill summary */}
          <section className="checkout-section card bill-summary-section">
            <h3 className="section-title-checkout">Bill Details</h3>
            
            <div className="bill-row">
              <span>Item Subtotal</span>
              <span>₹{getSubtotal()}</span>
            </div>
            
            {getDiscount() > 0 && (
              <div className="bill-row discount-row">
                <span>Coupon Discount</span>
                <span>-₹{getDiscount()}</span>
              </div>
            )}

            <div className="bill-row">
              <span>Delivery Partner Fee</span>
              <span>₹{getDeliveryFee()}</span>
            </div>

            <div className="bill-row">
              <span>GST & Restaurant Charges (5%)</span>
              <span>₹{getGST()}</span>
            </div>

            <div className="bill-row">
              <span>Platform Fee</span>
              <span>₹{getPlatformFee()}</span>
            </div>

            <div className="bill-row total-row">
              <span>To Pay</span>
              <span>₹{getTotal()}</span>
            </div>

            <button 
              className="btn btn-primary btn-place-order w-full"
              onClick={handleCheckout}
            >
              Place Order - ₹{getTotal()}
            </button>
          </section>
        </div>
      </div>

      {/* Styled Checkout View */}
      <style>{`
        .checkout-container {
          padding-top: 32px;
          padding-bottom: 80px;
        }
        .checkout-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
        }
        .btn-back-res {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: 1.5px solid var(--border);
          padding: 6px 12px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          color: var(--text-primary);
          transition: all var(--transition-fast);
        }
        .btn-back-res:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        .checkout-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 32px;
          align-items: start;
        }
        .checkout-section {
          padding: 24px;
          margin-bottom: 24px;
        }
        .section-title-checkout {
          font-size: 18px;
          margin-bottom: 16px;
          border-bottom: 1px dashed var(--border);
          padding-bottom: 10px;
        }
        
        /* Addresses */
        .address-options {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .address-card {
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .address-card:hover {
          border-color: var(--primary);
        }
        .address-card.active {
          border-color: var(--primary);
          background-color: rgba(255, 75, 26, 0.03);
        }
        .address-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .address-label {
          font-weight: 700;
          font-size: 15px;
        }
        .address-detail {
          font-size: 13px;
          color: var(--text-muted);
        }

        /* Payments */
        .payment-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .payment-card {
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .payment-card:hover {
          border-color: var(--primary);
        }
        .payment-card.active {
          border-color: var(--primary);
          background-color: rgba(255, 75, 26, 0.03);
        }
        .payment-left-row {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          font-size: 14px;
        }
        .payment-icon {
          color: var(--primary);
        }
        .radio-input {
          accent-color: var(--primary);
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        /* Cart items review */
        .order-res-name {
          font-size: 14px;
          margin-bottom: 12px;
          color: var(--text-muted);
        }
        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .cart-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid var(--border);
        }
        .cart-item-details {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }
        .cart-item-name {
          font-size: 14px;
          font-weight: 600;
        }
        .cart-item-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .mini-qty-controller {
          display: inline-flex;
          align-items: center;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          overflow: hidden;
          background-color: var(--bg-card);
        }
        .mini-qty-btn {
          border: none;
          background: none;
          width: 24px;
          height: 24px;
          cursor: pointer;
          font-weight: 800;
          font-size: 12px;
          color: var(--text-primary);
        }
        .mini-qty-btn:hover {
          background-color: var(--border);
        }
        .mini-qty-val {
          font-size: 12px;
          font-weight: 700;
          min-width: 16px;
          text-align: center;
        }
        .cart-item-price {
          font-weight: 600;
          font-size: 14px;
          min-width: 50px;
          text-align: right;
        }

        /* Coupon Form */
        .coupon-form {
          display: flex;
          gap: 10px;
        }
        .coupon-input {
          flex: 1;
          padding: 10px 14px;
        }
        .btn-apply {
          padding: 10px 20px;
        }
        .coupon-error-text {
          color: #ef4444;
          font-size: 12px;
          font-weight: 600;
          margin-top: 8px;
        }
        .coupon-applied-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: rgba(34, 197, 94, 0.08);
          border: 1.5px solid #22c55e;
          border-radius: var(--radius-md);
          padding: 12px 16px;
        }
        .coupon-applied-details {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .coupon-icon-check {
          color: #22c55e;
        }
        .coupon-code-success {
          font-weight: 700;
          font-size: 14px;
          color: #15803d;
        }
        .coupon-desc-success {
          font-size: 12px;
          color: #166534;
        }
        .btn-remove-coupon {
          background: none;
          border: none;
          color: #ef4444;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-remove-coupon:hover {
          text-decoration: underline;
        }
        .suggested-coupons {
          margin-top: 12px;
        }
        .suggested-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 6px;
        }
        .coupons-scroller {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .coupons-scroller::-webkit-scrollbar {
          display: none;
        }
        .suggested-coupon-badge {
          background-color: rgba(255, 75, 26, 0.06);
          color: var(--primary);
          border: 1px dashed var(--primary);
          border-radius: var(--radius-sm);
          padding: 4px 8px;
          font-size: 11px;
          cursor: pointer;
          white-space: nowrap;
          transition: all var(--transition-fast);
        }
        .suggested-coupon-badge:hover {
          background-color: var(--primary);
          color: white;
        }

        /* Bill breakdown */
        .bill-summary-section {
          background: linear-gradient(to bottom, var(--bg-card), rgba(255, 75, 26, 0.02));
        }
        .bill-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 10px;
          font-weight: 500;
        }
        .discount-row {
          color: #22c55e;
          font-weight: 600;
        }
        .total-row {
          border-top: 1px solid var(--border);
          padding-top: 14px;
          margin-top: 14px;
          font-size: 17px;
          font-weight: 800;
          color: var(--text-primary);
        }
        .btn-place-order {
          margin-top: 20px;
          padding: 14px;
          font-size: 16px;
        }

        /* Empty Cart */
        .empty-checkout-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: calc(100vh - 200px);
        }
        .empty-cart-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 60px 40px;
          max-width: 480px;
          gap: 16px;
        }
        .empty-icon {
          color: var(--text-muted);
        }

        @media (max-width: 992px) {
          .checkout-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
}
