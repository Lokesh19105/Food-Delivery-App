import React, { useEffect, useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { Phone, Shield, Clock, MapPin, Bike, CheckCircle2, MessageSquare } from 'lucide-react';

export default function OrderTrackingView() {
  const { activeOrder, setActiveOrder, setActiveView } = useCart();
  const [progress, setProgress] = useState(0); // 0 to 100
  const [status, setStatus] = useState('confirmed'); // 'confirmed', 'preparing', 'delivering', 'delivered'
  const [riderPos, setRiderPos] = useState({ x: 40, y: 260 });
  const pathRef = useRef(null);

  // Simulation Timeline
  // Total duration: 30 seconds
  // 0-20% (0-6s): Confirmed
  // 20-50% (6-15s): Preparing
  // 50-95% (15-28s): Out for Delivery (Rider moves along path)
  // 95-100% (28-30s): Delivered

  useEffect(() => {
    if (!activeOrder) return;

    const duration = 30000; // 30 seconds
    const intervalTime = 100; // 100ms updates
    const step = (intervalTime / duration) * 100;
    
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setStatus('delivered');
          return 100;
        }

        // Update status text
        if (next < 20) {
          setStatus('confirmed');
        } else if (next < 50) {
          setStatus('preparing');
        } else if (next < 95) {
          setStatus('delivering');
        } else {
          setStatus('delivered');
        }

        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeOrder]);

  // Track rider coordinates along the SVG path
  useEffect(() => {
    if (!pathRef.current) return;

    const pathLength = pathRef.current.getTotalLength();
    
    // Rider only moves during the 'delivering' phase (50% to 95% progress)
    // Scale progress from 50%-95% to 0%-100% path distance
    let pathPercent = 0;
    if (progress >= 50 && progress < 95) {
      pathPercent = (progress - 50) / 45;
    } else if (progress >= 95) {
      pathPercent = 1;
    }

    const currentLength = pathPercent * pathLength;
    try {
      const point = pathRef.current.getPointAtLength(currentLength);
      setRiderPos({ x: point.x, y: point.y });
    } catch (e) {
      // Fallback if browser doesn't support getPointAtLength
      const ratio = pathPercent;
      const startX = 40, endX = 440;
      const startY = 260, endY = 80;
      setRiderPos({
        x: startX + (endX - startX) * ratio,
        y: startY + (endY - startY) * ratio
      });
    }
  }, [progress]);

  if (!activeOrder) {
    return (
      <div className="container error-view">
        <p>No active order found.</p>
        <button className="btn btn-primary" onClick={() => setActiveView('home')}>Go Home</button>
      </div>
    );
  }

  const timelineSteps = [
    { key: 'confirmed', label: 'Order Confirmed', time: '12:05 PM', desc: 'We have received your order.', active: progress >= 0 },
    { key: 'preparing', label: 'Kitchen Preparing', time: '12:12 PM', desc: 'Chefs are busy packaging your fresh meal.', active: progress >= 20 },
    { key: 'delivering', label: 'Out for Delivery', time: '12:22 PM', desc: 'Rider is driving to your building.', active: progress >= 50 },
    { key: 'delivered', label: 'Arrived & Enjoy!', time: '12:28 PM', desc: 'Rider has reached your address.', active: progress >= 95 }
  ];

  return (
    <div className="container tracking-container animate-fade-in">
      <h2 className="tracking-title">Yumzy Live Tracker</h2>
      <p className="order-id-sub">Order ID: <strong>{activeOrder.id}</strong> | Est. Delivery: <strong>15-20 mins</strong></p>

      <div className="tracking-grid">
        {/* Left Side: Map Simulation */}
        <div className="tracking-left card">
          <div className="map-header">
            <span className="live-badge">🔴 LIVE MAP</span>
            <span className="map-restaurant-title">{activeOrder.restaurant.name} → Home</span>
          </div>

          <div className="map-view-wrapper">
            <svg viewBox="0 0 500 350" className="map-canvas">
              {/* Map background grids/roads */}
              <rect x="0" y="0" width="500" height="350" className="map-bg" />
              
              {/* Decorative blocks (Neighborhood areas / Parks) */}
              <rect x="80" y="40" width="100" height="80" rx="10" className="map-block park" />
              <rect x="260" y="40" width="140" height="80" rx="10" className="map-block building" />
              <rect x="220" y="160" width="80" height="100" rx="10" className="map-block building" />
              <rect x="20" y="160" width="80" height="60" rx="10" className="map-block residential" />
              <rect x="360" y="240" width="100" height="70" rx="10" className="map-block residential" />

              {/* Grid Lines representing streets */}
              <line x1="200" y1="0" x2="200" y2="350" className="map-street-line" />
              <line x1="0" y1="140" x2="500" y2="140" className="map-street-line" />
              <line x1="320" y1="0" x2="320" y2="350" className="map-street-line" />
              <line x1="0" y1="280" x2="500" y2="280" className="map-street-line" />

              {/* The Actual Rider Path */}
              <path
                id="rider-path"
                ref={pathRef}
                d="M 40,260 C 120,260 120,140 200,140 C 260,140 260,280 320,280 C 400,280 400,80 440,80"
                className="map-delivery-route-bg"
              />
              <path
                d="M 40,260 C 120,260 120,140 200,140 C 260,140 260,280 320,280 C 400,280 400,80 440,80"
                className="map-delivery-route-filled"
                style={{ strokeDasharray: 1000, strokeDashoffset: 1000 - (progress * 10) }}
              />

              {/* Restaurant Pin */}
              <g transform="translate(40, 260)">
                <circle r="14" className="pin-circle res" />
                <text y="5" textAnchor="middle" className="pin-text">🏪</text>
                <text y="-20" textAnchor="middle" className="pin-label">Restaurant</text>
              </g>

              {/* Home Pin */}
              <g transform="translate(440, 80)">
                <circle r="14" className="pin-circle home" />
                <text y="5" textAnchor="middle" className="pin-text">🏠</text>
                <text y="-20" textAnchor="middle" className="pin-label">Home</text>
              </g>

              {/* Rider Icon */}
              {status !== 'delivered' && (
                <g transform={`translate(${riderPos.x}, ${riderPos.y})`} className="rider-g">
                  <circle r="16" className="rider-circle" />
                  <text y="5" textAnchor="middle" className="rider-emoji">🚴</text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Right Side: Timeline & Support */}
        <div className="tracking-right">
          {/* Status Timeline */}
          <section className="tracking-section card">
            <h3 className="section-title-tracking">Delivery Timeline</h3>
            
            <div className="timeline">
              {timelineSteps.map((step, idx) => (
                <div key={step.key} className={`timeline-item ${step.active ? 'active' : ''} ${status === step.key ? 'current' : ''}`}>
                  <div className="timeline-node">
                    {idx < timelineSteps.findIndex(s => s.key === status) || status === 'delivered' ? (
                      <CheckCircle2 size={16} fill="#22c55e" color="white" />
                    ) : (
                      <span className="node-dot"></span>
                    )}
                  </div>
                  
                  <div className="timeline-content">
                    <div className="timeline-header-row">
                      <h4>{step.label}</h4>
                      <span className="timeline-time">{step.time}</span>
                    </div>
                    <p className="timeline-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Rider and Safety Section */}
          <section className="tracking-section card rider-card-section">
            <div className="rider-profile">
              <div className="rider-avatar">🚴</div>
              <div className="rider-info-text">
                <h4>Rahul Sharma</h4>
                <p>Your Yumzy Delivery Partner</p>
                <div className="rider-badge-row">
                  <span className="rider-tag">⚡ Superfast</span>
                  <span className="rider-tag">⭐ 4.9</span>
                </div>
              </div>
            </div>

            <div className="action-buttons-row">
              <a href="tel:+919876543210" className="btn btn-secondary flex-1">
                <Phone size={16} />
                <span>Call Partner</span>
              </a>
              <button className="btn btn-secondary flex-1" onClick={() => alert('Support Chat simulation active!')}>
                <MessageSquare size={16} />
                <span>Chat</span>
              </button>
            </div>

            <div className="safety-badge">
              <Shield size={16} className="safety-icon" />
              <span>Contactless Delivery active. Rider wearing face mask.</span>
            </div>
          </section>

          {/* Order Completion Action */}
          {status === 'delivered' && (
            <div className="congrats-card card animate-slide-up">
              <span className="congrats-emoji">🎉</span>
              <h3>Your Food has Arrived!</h3>
              <p>Thank you for ordering with Yumzy. We hope you love your gourmet dinner!</p>
              <button 
                className="btn btn-primary w-full"
                onClick={() => {
                  setActiveOrder(null);
                  setActiveView('home');
                }}
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Styled Tracking CSS */}
      <style>{`
        .tracking-container {
          padding-top: 32px;
          padding-bottom: 80px;
        }
        .tracking-title {
          font-size: 26px;
          font-weight: 800;
          text-align: center;
          margin-bottom: 4px;
        }
        .order-id-sub {
          text-align: center;
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 32px;
        }
        .tracking-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 32px;
          align-items: start;
        }
        .tracking-section {
          padding: 24px;
          margin-bottom: 24px;
        }
        .section-title-tracking {
          font-size: 18px;
          margin-bottom: 20px;
          border-bottom: 1.5px solid var(--border);
          padding-bottom: 10px;
        }

        /* Map styling */
        .map-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
        }
        .live-badge {
          background-color: #ef4444;
          color: white;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          animation: pulseGlow 1s infinite;
        }
        .map-restaurant-title {
          font-size: 14px;
          font-weight: 700;
        }
        .map-view-wrapper {
          padding: 12px;
          position: relative;
        }
        .map-canvas {
          width: 100%;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
        }
        .map-bg {
          fill: #f1f5f9;
        }
        [data-theme="dark"] .map-bg {
          fill: #1e293b;
        }
        .map-block {
          fill: #e2e8f0;
          stroke: rgba(0,0,0,0.02);
          stroke-width: 1px;
        }
        [data-theme="dark"] .map-block {
          fill: #334155;
        }
        .map-block.park {
          fill: #dcfce7;
        }
        [data-theme="dark"] .map-block.park {
          fill: #14532d;
        }
        .map-street-line {
          stroke: #ffffff;
          stroke-width: 6px;
          stroke-linecap: round;
        }
        [data-theme="dark"] .map-street-line {
          stroke: #0f172a;
        }

        /* Route Paths */
        .map-delivery-route-bg {
          fill: none;
          stroke: #cbd5e1;
          stroke-width: 4px;
          stroke-dasharray: 6 6;
          stroke-linecap: round;
        }
        [data-theme="dark"] .map-delivery-route-bg {
          stroke: #475569;
        }
        .map-delivery-route-filled {
          fill: none;
          stroke: var(--primary);
          stroke-width: 4px;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.1s linear;
        }

        /* Pins */
        .pin-circle {
          fill: white;
          stroke-width: 3px;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
        }
        .pin-circle.res { stroke: var(--primary); }
        .pin-circle.home { stroke: #22c55e; }
        .pin-text {
          font-size: 14px;
        }
        .pin-label {
          font-size: 10px;
          font-weight: 800;
          fill: var(--text-primary);
        }
        .rider-circle {
          fill: var(--primary);
          stroke: white;
          stroke-width: 2px;
          filter: drop-shadow(0 4px 8px rgba(255, 75, 26, 0.3));
        }
        .rider-emoji {
          font-size: 16px;
        }
        .rider-g {
          animation: riderBounce 0.5s ease-in-out infinite alternate;
        }
        @keyframes riderBounce {
          from { transform: translateY(0); }
          to { transform: translateY(-4px); }
        }

        /* Timeline Items */
        .timeline {
          display: flex;
          flex-direction: column;
          position: relative;
          padding-left: 20px;
        }
        .timeline::before {
          content: '';
          position: absolute;
          left: 6px;
          top: 8px;
          bottom: 8px;
          width: 2px;
          background-color: var(--border);
        }
        .timeline-item {
          display: flex;
          gap: 20px;
          padding-bottom: 24px;
          position: relative;
        }
        .timeline-item:last-child {
          padding-bottom: 0;
        }
        .timeline-node {
          position: absolute;
          left: -20px;
          top: 4px;
          width: 14px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }
        .node-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: var(--border);
          border: 2px solid var(--bg-card);
        }
        .timeline-item.active .node-dot {
          background-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
        }
        .timeline-item.current .node-dot {
          background-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(255, 75, 26, 0.25);
          animation: pulseGlow 1.5s infinite;
        }
        .timeline-content {
          flex: 1;
        }
        .timeline-header-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 4px;
        }
        .timeline-content h4 {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-muted);
        }
        .timeline-item.active h4 {
          color: var(--text-primary);
        }
        .timeline-item.current h4 {
          color: var(--primary);
        }
        .timeline-time {
          font-size: 11px;
          color: var(--text-muted);
        }
        .timeline-desc {
          font-size: 12px;
          color: var(--text-muted);
        }

        /* Rider Profile */
        .rider-profile {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }
        .rider-avatar {
          font-size: 32px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: rgba(255, 75, 26, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
        }
        .rider-info-text h4 {
          font-size: 15px;
          font-weight: 700;
        }
        .rider-info-text p {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 4px;
        }
        .rider-badge-row {
          display: flex;
          gap: 6px;
        }
        .rider-tag {
          font-size: 10px;
          font-weight: 700;
          background-color: var(--border);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--text-primary);
        }
        .action-buttons-row {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        .safety-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-muted);
          background-color: rgba(0, 0, 0, 0.02);
          padding: 10px 14px;
          border-radius: var(--radius-md);
        }
        .safety-icon {
          color: #22c55e;
          flex-shrink: 0;
        }

        /* Congrats box */
        .congrats-card {
          padding: 24px;
          text-align: center;
          background: linear-gradient(to bottom, var(--bg-card), rgba(34, 197, 94, 0.03));
          border-color: rgba(34, 197, 94, 0.3);
          margin-top: 24px;
        }
        .congrats-emoji {
          font-size: 48px;
          display: block;
          margin-bottom: 12px;
          animation: float 2s infinite;
        }
        .congrats-card h3 {
          font-size: 18px;
          color: #15803d;
          margin-bottom: 8px;
        }
        .congrats-card p {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 20px;
        }

        @media (max-width: 992px) {
          .tracking-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
}
