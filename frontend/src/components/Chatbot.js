import React, { useState, useRef, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Hi! I\'m your event assistant. How can I help you today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    // Event-related queries
    if (msg.includes('event') && (msg.includes('find') || msg.includes('search') || msg.includes('browse'))) {
      return 'You can browse all events by clicking on "Events" in the navigation menu, or visit the Categories page to explore events by type!';
    }
    if (msg.includes('book') || msg.includes('register')) {
      return 'To book an event: Go to Events → Select an event → Click "Book Now" → Choose your tickets → Complete payment. You\'ll receive a confirmation email!';
    }
    if (msg.includes('ticket')) {
      return 'You can view your tickets in "My Bookings" section. Each booking has a unique ticket ID and QR code for entry.';
    }
    if (msg.includes('cancel') || msg.includes('refund')) {
      return 'To cancel a booking, go to "My Bookings" and click the cancel button. Refunds are processed within 5-7 business days.';
    }
    if (msg.includes('certificate')) {
      return 'Certificates are automatically generated after event completion. Check the "Certificates" section to download yours!';
    }

    // Category queries
    if (msg.includes('categor')) {
      return 'We have categories like Technology, Music, Sports, Business, Education, Food, Entertainment, Online & Virtual Events, and Social & Personal Events!';
    }

    // Payment queries
    if (msg.includes('payment') || msg.includes('pay')) {
      return 'We accept credit cards, debit cards, and online payment methods. All transactions are secure and encrypted.';
    }

    // Account queries
    if (msg.includes('account') || msg.includes('profile')) {
      return 'You can manage your account by clicking on your profile icon. Update your details, change password, and view your activity there.';
    }
    if (msg.includes('password') && msg.includes('forgot')) {
      return 'Click "Forgot Password?" on the login page. Enter your email to receive a reset code, then create a new password.';
    }
    if (msg.includes('login') || msg.includes('sign in')) {
      return 'Click the "Login" button in the top right corner. Use your email and password to sign in. New user? Click "Register" instead!';
    }

    // Organizer queries
    if (msg.includes('organizer') || msg.includes('create event')) {
      return 'To become an organizer, contact our admin team. Organizers can create events, manage bookings, and view analytics.';
    }

    // Virtual events
    if (msg.includes('virtual') || msg.includes('online')) {
      return 'Virtual events can be joined from anywhere! You\'ll receive a meeting link after booking. Check "Online & Virtual Events" category.';
    }

    // Feedback
    if (msg.includes('feedback') || msg.includes('review')) {
      return 'After attending an event, you can leave feedback in the "Feedback" section. Your reviews help improve future events!';
    }

    // Notifications
    if (msg.includes('notification') || msg.includes('reminder')) {
      return 'You\'ll receive notifications for booking confirmations, event reminders, and updates. Check the Notifications page for all alerts.';
    }

    // Help queries
    if (msg.includes('help') || msg.includes('support')) {
      return 'I\'m here to help! Ask me about booking events, managing tickets, payments, categories, or any other questions about our platform.';
    }

    // Greetings
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return 'Hello! How can I assist you with events today?';
    }
    if (msg.includes('thank')) {
      return 'You\'re welcome! Feel free to ask if you need anything else.';
    }
    if (msg.includes('bye')) {
      return 'Goodbye! Have a great time at your events!';
    }

    // Default response
    return 'I can help you with:\n• Finding and booking events\n• Managing tickets and bookings\n• Payment information\n• Account management\n• Event categories\n• Certificates\n\nWhat would you like to know?';
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot thinking and respond
    setTimeout(() => {
      const botResponse = { text: getBotResponse(input), sender: 'bot' };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <div className={`chatbot-button ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
        <span className="chatbot-icon">💬</span>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div>
              <strong>Event Assistant</strong>
              <div className="chatbot-status">Online</div>
            </div>
            <Button variant="link" className="close-btn" onClick={() => setIsOpen(false)}>
              ✕
            </Button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div className="message-bubble">{msg.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="message bot">
                <div className="message-bubble typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <Form.Control
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button variant="primary" onClick={handleSend} disabled={!input.trim()}>
              Send
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
