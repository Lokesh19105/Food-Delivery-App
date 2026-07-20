import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import HomeView from './views/HomeView';
import RestaurantView from './views/RestaurantView';
import CheckoutView from './views/CheckoutView';
import OrderTrackingView from './views/OrderTrackingView';
import DashboardViews from './views/DashboardViews';
import AuthView from './views/AuthView';
import AIChatAssistant from './components/AIChatAssistant';
import { ShieldCheck } from 'lucide-react';

function AppContent() {
  const { activeView } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView searchQuery={searchQuery} />;
      case 'restaurant':
        return <RestaurantView />;
      case 'checkout':
        return <CheckoutView />;
      case 'tracking':
        return <OrderTrackingView />;
      case 'dashboard-res':
      case 'dashboard-admin':
        return <DashboardViews />;
      case 'auth':
        return <AuthView />;
      default:
        return <HomeView searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="app-wrapper flex flex-col">
      {/* Header Navigation */}
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Main Content Area */}
      <main className="main-content-flow">
        {renderView()}
      </main>

      {/* AI Chatbot Assistant drawer */}
      {activeView !== 'auth' && <AIChatAssistant />}

      {/* Footer */}
      <footer className="app-footer">
        <div className="container footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <span className="footer-logo">🧞‍♂️ FoodGenie AI</span>
              <p className="footer-tagline">Satisfying your cravings intelligently, one bite at a time.</p>
            </div>
            
            <div className="footer-links">
              <div className="link-group">
                <h5>Platform</h5>
                <a href="#about" onClick={(e) => e.preventDefault()}>About Us</a>
                <a href="#careers" onClick={(e) => e.preventDefault()}>Careers</a>
                <a href="#blog" onClick={(e) => e.preventDefault()}>Blog</a>
              </div>
              <div className="link-group">
                <h5>Partners</h5>
                <a href="#partner" onClick={(e) => e.preventDefault()}>Add Restaurant</a>
                <a href="#ride" onClick={(e) => e.preventDefault()}>Ride with us</a>
                <a href="#merchant" onClick={(e) => e.preventDefault()}>Merchant terms</a>
              </div>
              <div className="link-group">
                <h5>AI Assistant</h5>
                <a href="#chat" onClick={(e) => e.preventDefault()}>AI Recommendations</a>
                <a href="#meal" onClick={(e) => e.preventDefault()}>Diet Planning</a>
                <a href="#search" onClick={(e) => e.preventDefault()}>Smart Search</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="copy-text">© 2026 FoodGenie AI Delivery Network. Built with Java Spring Boot + React + Local NLP.</p>
            <div className="safety-badge-footer">
              <ShieldCheck size={16} />
              <span>Secure H2/REST transactions</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Footer & App Layout Styles */}
      <style>{`
        .app-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .main-content-flow {
          flex: 1;
        }
        .app-footer {
          background-color: hsl(20, 10%, 12%);
          color: hsl(0, 0%, 90%);
          padding: 60px 0 30px;
          border-top: 1px solid var(--border);
          transition: background-color var(--transition-normal);
        }
        [data-theme="dark"] .app-footer {
          background-color: hsl(220, 15%, 7%);
        }
        .footer-inner {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        .footer-top {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 40px;
        }
        .footer-brand {
          max-width: 320px;
        }
        .footer-logo {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 24px;
          display: inline-block;
          margin-bottom: 12px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .footer-tagline {
          font-size: 14px;
          color: hsl(20, 5%, 70%);
        }
        .footer-links {
          display: flex;
          gap: 60px;
          flex-wrap: wrap;
        }
        .link-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .link-group h5 {
          color: white;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        .link-group a {
          color: hsl(20, 5%, 70%);
          font-size: 13px;
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        .link-group a:hover {
          color: var(--primary);
        }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid hsl(20, 5%, 20%);
          padding-top: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .copy-text {
          font-size: 12px;
          color: hsl(20, 5%, 60%);
        }
        .safety-badge-footer {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: hsl(20, 5%, 60%);
        }

        @media (max-width: 768px) {
          .footer-top {
            flex-direction: column;
            gap: 30px;
          }
          .footer-links {
            gap: 30px;
            justify-content: space-between;
            width: 100%;
          }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
