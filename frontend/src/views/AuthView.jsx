import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function AuthView() {
  const { handleLogin, handleRegister, authError, setActiveView } = useCart();
  const [isRegister, setIsRegister] = useState(false);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('CUSTOMER'); // 'CUSTOMER', 'RESTAURANT', 'ADMIN'
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    let success = false;
    
    if (isRegister) {
      success = await handleRegister(username, password, email, role);
    } else {
      success = await handleLogin(username, password);
    }

    setLoading(false);
  };

  return (
    <div className="container auth-view-container animate-fade-in">
      <div className="auth-card card">
        <div className="auth-header">
          <span className="auth-icon-badge">🧞‍♂️</span>
          <h2>{isRegister ? 'Join FoodGenie AI' : 'Welcome Back'}</h2>
          <p>{isRegister ? 'Create an account to order food' : 'Log in to manage orders'}</p>
        </div>

        {authError && <p className="auth-error-msg">{authError}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-text"
              placeholder="Enter username (e.g. lokesh)"
              required
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-text"
                placeholder="Enter email (e.g. user@domain.com)"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-text"
              placeholder="••••••••"
              required
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label>Access Role Type</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-text"
              >
                <option value="CUSTOMER">Customer (Order food & ask AI)</option>
                <option value="RESTAURANT">Restaurant Owner (Edit menu & dispatch)</option>
                <option value="ADMIN">System Administrator (View dashboard & stats)</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full btn-auth-submit" disabled={loading}>
            {loading ? 'Authenticating...' : isRegister ? 'Register Account' : 'Log In'}
          </button>
        </form>

        <div className="auth-footer-toggle">
          <p>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button 
              className="btn-toggle-link"
              onClick={() => {
                setIsRegister(!isRegister);
                setUsername('');
                setPassword('');
                setEmail('');
              }}
            >
              {isRegister ? 'Log In here' : 'Register here'}
            </button>
          </p>
          
          {/* Quick Demo Assist */}
          {!isRegister && (
            <div className="demo-accounts-box">
              <p className="demo-title">💡 Quick Login Profiles (No Password):</p>
              <div className="demo-buttons">
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setUsername('lokesh');
                    setPassword('pass123');
                  }}
                >
                  Customer
                </button>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setUsername('restaurant_owner');
                    setPassword('pass123');
                  }}
                >
                  Owner
                </button>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setUsername('admin_user');
                    setPassword('pass123');
                  }}
                >
                  Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .auth-view-container {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 60px;
          padding-bottom: 80px;
        }
        .auth-card {
          width: 100%;
          max-width: 420px;
          padding: 32px;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .auth-icon-badge {
          font-size: 40px;
          margin-bottom: 8px;
          display: inline-block;
        }
        .auth-header h2 {
          font-size: 22px;
          font-weight: 800;
        }
        .auth-header p {
          font-size: 13px;
          color: var(--text-muted);
        }
        
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 12px;
          font-weight: 750;
          color: var(--text-primary);
        }
        
        .btn-auth-submit {
          margin-top: 10px;
          padding: 12px;
        }
        .auth-error-msg {
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          font-size: 12px;
          font-weight: 600;
          padding: 10px;
          border-radius: var(--radius-sm);
          text-align: center;
          margin-bottom: 16px;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .auth-footer-toggle {
          text-align: center;
          margin-top: 20px;
          font-size: 13px;
          color: var(--text-muted);
        }
        .btn-toggle-link {
          background: none;
          border: none;
          color: var(--primary);
          font-weight: 750;
          cursor: pointer;
          margin-left: 6px;
        }
        .btn-toggle-link:hover {
          text-decoration: underline;
        }

        /* Demo Assist box */
        .demo-accounts-box {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px dashed var(--border);
          text-align: left;
        }
        .demo-title {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .demo-buttons {
          display: flex;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}
