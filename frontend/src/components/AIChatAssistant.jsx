import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { MessageSquare, Send, X, Bot, Sparkles, User } from 'lucide-react';

export default function AIChatAssistant() {
  const { currentUser, addToCart, restaurants } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'bot',
      text: "Hello! I'm your FoodGenie AI assistant. 🧞‍♂️\nAsk me for custom food recommendations, meal planning, or to search menus! \n\n*Try asking: 'Recommend a spicy dinner under ₹300' or 'Plan a weight loss diet'*"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || messageInput;
    if (!text.trim()) return;

    // Add user message to history
    setChatHistory(prev => [...prev, { sender: 'user', text }]);
    setMessageInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id || 1,
          message: text
        })
      });

      if (!response.ok) throw new Error('API offline');
      const data = await response.json();
      setChatHistory(prev => [...prev, { sender: 'bot', text: data.response }]);
    } catch (err) {
      console.warn('Backend offline, running local mock NLP chatbot response.', err);
      // Local fallback simulator logic
      setTimeout(() => {
        const fallbackResponse = getLocalChatbotResponse(text);
        setChatHistory(prev => [...prev, { sender: 'bot', text: fallbackResponse }]);
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  // Local rule-based chat simulator if spring boot is offline
  const getLocalChatbotResponse = (msg) => {
    const text = msg.toLowerCase();
    
    if (text.includes('spicy') && text.includes('300')) {
      return "Here are some spicy options under ₹300:\n\n• **Hyderabadi Chicken Biryani** (₹279) from *The Biryani Pavilion* (4.7⭐)\n• **Chicken Tikka Starter** (₹219) from *The Biryani Pavilion* (4.6⭐)\n• **Szechuan Chilli Noodles** (₹199) from *Wok Wonders* (4.5⭐)\n\nYou can add these to your cart directly!";
    }
    
    if (text.includes('healthy') || text.includes('diet') || text.includes('loss')) {
      return "### 🥗 Weight Loss Diet Plan\n\n**Breakfast:** Detox Juice (₹129) - *Green & Lean Organics*\n**Lunch:** Avocado Quinoa Salad (₹249) - *Green & Lean Organics*\n**Dinner:** Paneer Tofu Wellness Wrap (₹189) - *Green & Lean Organics*\n\nWould you like to search for protein-rich options instead?";
    }

    if (text.includes('protein') || text.includes('gain') || text.includes('muscle')) {
      return "### 💪 Muscle Gain Diet Plan (High Protein)\n\n**Lunch:** Hyderabadi Chicken Biryani (₹279) - *The Biryani Pavilion* (48g Protein)\n**Snacks:** Chicken Tikka Starter (₹219) - *The Biryani Pavilion* (28g Protein)\n**Dinner:** Dilli Special Mutton Biryani (₹329) - *Dilli Durbar* (52g Protein)";
    }

    if (text.includes('crispy') || text.includes('crunchy')) {
      return "Looking for something crunchy? Check these out:\n\n• **Ultimate Cheeseburger Smash** (₹189) - *Burger & Co.* (Crispy double grill patty!)\n• **Crunchy Veg Supreme Burger** (₹149) - *Burger & Co.*\n• **Salted Peri-Peri Fries** (₹99) - *Burger & Co.*";
    }

    if (text.includes('veg') || text.includes('vegetarian')) {
      return "I recommend trying: \n\n• **Classic Margherita Pizza** (₹229) from *Pizzeria Bella* (4.6⭐)\n• **Paneer Makhani Biryani** (₹249) from *The Biryani Pavilion* (4.4⭐)\n• **Veg Seekh Kabab Feast** (₹199) from *Dilli Durbar* (4.3⭐)";
    }

    return "I understand! I'm scanning all menus. Try asking for:\n1. 'Recommend a spicy dinner under ₹300'\n2. 'Plan a weight loss diet'\n3. 'Something crispy'\n4. 'Suggest vegetarian options'";
  };

  // Helper to render message with markdown bold and newlines
  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      // Bold matches **text**
      let formattedLine = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const italicRegex = /_(.*?)_/g;
      
      formattedLine = line.replace(boldRegex, '<strong>$1</strong>');
      formattedLine = formattedLine.replace(italicRegex, '<em>$1</em>');
      
      if (line.startsWith('### ')) {
        return <h3 key={i} className="bot-h3">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('• ')) {
        return <li key={i} className="bot-li" dangerouslySetInnerHTML={{ __html: formattedLine.replace('• ', '') }} />;
      }
      return <p key={i} className="bot-p" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });
  };

  // Custom addition triggers inside chat (e.g. Add Biryani buttons)
  const renderInlineActions = (text) => {
    const lowercaseText = text.toLowerCase();
    const actions = [];

    // Parse and show Quick Add Buttons for demo items
    if (lowercaseText.includes('hyderabadi chicken biryani')) {
      actions.push({
        id: 1,
        name: 'Hyderabadi Chicken Biryani',
        price: 279,
        isVeg: false,
        res: { id: 1, name: 'The Biryani Pavilion' }
      });
    }
    if (lowercaseText.includes('margherita pizza')) {
      actions.push({
        id: 4,
        name: 'Classic Margherita Pizza',
        price: 229,
        isVeg: true,
        res: { id: 2, name: 'Pizzeria Bella' }
      });
    }
    if (lowercaseText.includes('cheeseburger smash')) {
      actions.push({
        id: 6,
        name: 'Ultimate Cheeseburger Smash',
        price: 189,
        isVeg: false,
        res: { id: 3, name: 'Burger & Co. Craft House' }
      });
    }
    if (lowercaseText.includes('quinoa power salad') || lowercaseText.includes('avocado quinoa')) {
      actions.push({
        id: 11, // matches item or local mapping
        name: 'Avocado Quinoa Power Salad',
        price: 249,
        isVeg: true,
        res: { id: 5, name: 'Green & Lean Organics' }
      });
    }

    if (actions.length === 0) return null;

    return (
      <div className="chat-actions-row">
        {actions.map((act, index) => (
          <button
            key={index}
            className="chat-action-btn"
            onClick={() => {
              addToCart(
                { id: act.id, name: act.name, price: act.price, isVeg: act.isVeg },
                act.res
              );
              alert(`Added "${act.name}" from "${act.res.name}" to cart!`);
            }}
          >
            <span>+ Add {act.name.split(' ')[0]} (₹{act.price})</span>
          </button>
        ))}
      </div>
    );
  };

  const suggestions = [
    "Recommend spicy under ₹300",
    "Weight loss diet plan",
    "Crispy snacks",
    "Vegetarian options"
  ];

  return (
    <>
      {/* Floating Button */}
      <button 
        className={`chat-genie-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="FoodGenie AI Assistant"
      >
        <Sparkles size={20} className="glow-icon" />
        <span className="hide-mobile font-heading">Genie AI</span>
      </button>

      {/* Chat Drawer */}
      {isOpen && (
        <div className="chat-drawer-container card animate-slide-up">
          <div className="chat-drawer-header">
            <div className="header-title-box">
              <Bot size={22} className="genie-bot-icon" />
              <div>
                <h4>FoodGenie AI</h4>
                <span className="genie-online-badge">Online</span>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="chat-messages-stream" ref={scrollRef}>
            {chatHistory.map((chat, idx) => (
              <div key={idx} className={`chat-bubble-container ${chat.sender}`}>
                <div className="chat-avatar">
                  {chat.sender === 'bot' ? '🧞‍♂️' : <User size={12} />}
                </div>
                <div className="chat-bubble-wrapper">
                  <div className="chat-bubble">
                    {formatText(chat.text)}
                  </div>
                  {chat.sender === 'bot' && renderInlineActions(chat.text)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-bubble-container bot loading">
                <div className="chat-avatar">🧞‍♂️</div>
                <div className="chat-bubble loading-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions chips */}
          <div className="chat-suggestions-chips">
            {suggestions.map((sug, i) => (
              <button 
                key={i} 
                className="chat-sug-chip"
                onClick={() => handleSendMessage(sug)}
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }} 
            className="chat-input-form"
          >
            <input
              type="text"
              placeholder="Ask FoodGenie..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="input-text chat-text-input"
            />
            <button type="submit" className="btn btn-primary chat-send-btn">
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Styled Chat CSS */}
      <style>{`
        .chat-genie-toggle-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 999;
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: var(--radius-full);
          font-weight: 750;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 8px 30px rgba(255, 75, 26, 0.4);
          transition: all var(--transition-normal);
        }
        .chat-genie-toggle-btn:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 12px 40px rgba(255, 75, 26, 0.6);
        }
        .chat-genie-toggle-btn.active {
          transform: rotate(360deg);
          background-color: var(--text-primary);
        }
        .glow-icon {
          animation: spin 6s linear infinite;
        }

        /* Drawer container */
        .chat-drawer-container {
          position: fixed;
          bottom: 90px;
          right: 30px;
          width: 380px;
          height: 520px;
          z-index: 999;
          display: flex;
          flex-direction: column;
          border: 1.5px solid var(--border);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }
        .chat-drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background-color: var(--bg-card);
          border-bottom: 1.5px solid var(--border);
        }
        .header-title-box {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .genie-bot-icon {
          color: var(--primary);
        }
        .header-title-box h4 {
          font-size: 14px;
          font-weight: 800;
        }
        .genie-online-badge {
          font-size: 10px;
          color: #22c55e;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .genie-online-badge::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          background-color: #22c55e;
          border-radius: 50%;
        }
        .chat-close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: var(--radius-sm);
        }
        .chat-close-btn:hover {
          background-color: var(--border);
        }

        /* Messages stream */
        .chat-messages-stream {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background-color: var(--bg-app);
        }
        .chat-bubble-container {
          display: flex;
          gap: 10px;
          max-width: 85%;
        }
        .chat-bubble-container.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        .chat-bubble-container.bot {
          align-self: flex-start;
        }
        .chat-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          flex-shrink: 0;
        }
        .chat-bubble-container.user .chat-avatar {
          background-color: var(--primary);
          color: white;
        }
        .chat-bubble-wrapper {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
        }
        .chat-bubble {
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-size: 13px;
          line-height: 1.45;
          color: var(--text-primary);
          background-color: var(--bg-card);
          border: 1.5px solid var(--border);
        }
        .chat-bubble-container.user .chat-bubble {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        .bot-p {
          margin-bottom: 8px;
        }
        .bot-p:last-child {
          margin-bottom: 0;
        }
        .bot-h3 {
          font-size: 13px;
          font-weight: 800;
          margin: 10px 0 6px;
          color: var(--primary);
        }
        .bot-li {
          margin-left: 12px;
          margin-bottom: 4px;
          list-style-type: square;
        }

        /* Suggestions chips */
        .chat-suggestions-chips {
          display: flex;
          gap: 6px;
          padding: 8px 16px;
          overflow-x: auto;
          background-color: var(--bg-card);
          border-top: 1px solid var(--border);
          scrollbar-width: none;
        }
        .chat-suggestions-chips::-webkit-scrollbar {
          display: none;
        }
        .chat-sug-chip {
          flex-shrink: 0;
          font-size: 11px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          border: 1.5px solid var(--border);
          background-color: var(--bg-app);
          color: var(--text-primary);
          cursor: pointer;
          font-weight: 600;
        }
        .chat-sug-chip:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        /* Inline Actions */
        .chat-actions-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 2px;
        }
        .chat-action-btn {
          border: 1px solid #22c55e;
          background-color: rgba(34, 197, 94, 0.08);
          color: #166534;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        [data-theme="dark"] .chat-action-btn {
          color: #dcfce7;
        }
        .chat-action-btn:hover {
          background-color: #22c55e;
          color: white;
        }

        /* Input area */
        .chat-input-form {
          display: flex;
          padding: 10px 16px 16px;
          gap: 8px;
          background-color: var(--bg-card);
        }
        .chat-text-input {
          flex: 1;
          padding: 8px 12px;
          font-size: 13px;
          border-radius: var(--radius-md);
        }
        .chat-send-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          padding: 0;
        }

        /* Loading dots */
        .loading-dots {
          display: flex;
          gap: 4px;
          padding: 12px 20px;
          align-items: center;
        }
        .loading-dots span {
          width: 6px;
          height: 6px;
          background-color: var(--text-muted);
          border-radius: 50%;
          animation: dotBounce 1.2s infinite;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @media (max-width: 480px) {
          .chat-drawer-container {
            right: 10px;
            left: 10px;
            width: auto;
          }
        }
      `}</style>
    </>
  );
}
