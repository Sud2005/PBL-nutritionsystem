import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ReactMarkdown from 'react-markdown';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const QUICK_ACTIONS = [
    "What should I eat for breakfast today?",
    "How can I hit my target faster?",
    "Suggest a high-protein Indian snack.",
    "What should I avoid given my conditions?"
  ];

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/chat');
      setMessages(res.data);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    const newMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await api.post('/chat/message', { message: text });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch(err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) return <div className="container"><p>Connecting to Priya...</p></div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      
      {/* Header */}
      <div style={{ padding: '20px', background: '#fff', borderBottom: '1px solid #e3e8ee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <div style={{width: '45px', height: '45px', borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'}}>
            👩‍⚕️
          </div>
          <div>
            <h2 style={{margin: 0, fontSize: '18px', color: '#1a1f36'}}>Priya</h2>
            <div style={{fontSize: '12px', color: '#10b981', fontWeight: 600}}>AI Nutritionist Coach</div>
          </div>
        </div>
        <button onClick={() => navigate('/dashboard')} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '14px', fontWeight: 600}}>
          Exit Chat
        </button>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {messages.length === 0 && (
          <div style={{textAlign: 'center', color: '#64748b', marginTop: '40px'}}>
            <p style={{marginBottom: '20px'}}>Say hi to Priya! She has your full health profile context.</p>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center'}}>
              {QUICK_ACTIONS.map(action => (
                <button key={action} onClick={() => sendMessage(action)} style={{background: '#fff', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '100px', fontSize: '13px', color: '#334155', cursor: 'pointer'}}>
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => {
          if (msg.role === 'system') return null; // Hide system prompt
          const isUser = msg.role === 'user';
          return (
            <div key={idx} style={{display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start'}}>
              <div style={{
                maxWidth: '75%',
                padding: '12px 18px',
                borderRadius: '16px',
                borderBottomRightRadius: isUser ? '4px' : '16px',
                borderBottomLeftRadius: isUser ? '16px' : '4px',
                background: isUser ? 'var(--primary-color)' : '#ffffff',
                color: isUser ? '#fff' : '#1a1f36',
                boxShadow: isUser ? 'none' : '0 2px 4px rgba(0,0,0,0.03)',
                fontSize: '15px',
                lineHeight: '1.5'
              }}>
                {isUser ? msg.content : <ReactMarkdown>{msg.content}</ReactMarkdown>}
              </div>
            </div>
          );
        })}

        {isTyping && (
           <div style={{display: 'flex', justifyContent: 'flex-start'}}>
            <div style={{background: '#ffffff', padding: '12px 18px', borderRadius: '16px', borderBottomLeftRadius: '4px', color: '#94a3b8', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)'}}>
               Priya is typing...
            </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '20px', background: '#fff', borderTop: '1px solid #e3e8ee' }}>
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} style={{display: 'flex', gap: '10px'}}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Priya about your diet..."
            style={{flex: 1, padding: '14px 20px', borderRadius: '100px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc'}}
          />
          <button type="submit" disabled={!input.trim() || isTyping} style={{background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '100px', padding: '0 24px', fontWeight: 600, cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed', opacity: input.trim() && !isTyping ? 1 : 0.6}}>
            Send
          </button>
        </form>
      </div>

    </div>
  );
};

export default ChatPage;
