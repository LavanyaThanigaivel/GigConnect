import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { messageService } from '../services/messageService';
import io from 'socket.io-client';
import '../styles/Messages.css';

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('conversations'); // 'conversations' or 'contacts'
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  
  const { user } = useAuth();

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    loadInitialData();

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket && activeConversation) {
      socket.emit('join_conversation', activeConversation.id);
      
      socket.on('receive_message', (data) => {
        setMessages(prev => [...prev, data]);
      });
    }

    return () => {
      if (socket) {
        socket.off('receive_message');
      }
    };
  }, [socket, activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadInitialData = async () => {
    try {
      const [conversationsData, contactsData] = await Promise.all([
        messageService.getConversations(),
        messageService.getContacts()
      ]);
      
      setConversations(conversationsData);
      setContacts(contactsData);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchContacts = async (query) => {
    if (!query.trim()) {
      // If empty search, load all contacts
      const contactsData = await messageService.getContacts();
      setContacts(contactsData);
      return;
    }

    try {
      const searchResults = await messageService.searchContacts(query);
      setContacts(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const startNewConversation = async (contact) => {
    try {
      const conversation = await messageService.getOrCreateConversation(contact._id);
      
      // Add to conversations list if not already there
      setConversations(prev => {
        const exists = prev.find(conv => conv.id === conversation.id);
        if (!exists) {
          return [conversation, ...prev];
        }
        return prev;
      });
      
      setActiveConversation(conversation);
      setActiveTab('conversations');
      setMessages([]); // Clear messages for new conversation
    } catch (error) {
      console.error('Failed to start conversation:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  const loadConversation = async (conversation) => {
    setActiveConversation(conversation);
    try {
      const messagesData = await messageService.getMessages(conversation.id);
      setMessages(messagesData);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const messageData = {
      conversationId: activeConversation.id,
      receiverId: activeConversation.participant._id,
      content: newMessage.trim()
    };

    try {
      if (socket) {
        socket.emit('send_message', {
          ...messageData,
          senderId: user.id
        });
      }

      // Add message locally immediately
      const tempMessage = {
        _id: Date.now().toString(),
        senderId: { _id: user.id, firstName: user.firstName, lastName: user.lastName },
        content: newMessage.trim(),
        createdAt: new Date().toISOString(),
        read: false
      };

      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');

      // Also save to database
      await messageService.sendMessage(messageData);

    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredContacts = contacts.filter(contact =>
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="messages-loading">
        <div className="loading-spinner"></div>
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="messages">
      <div className="messages-header">
        <h1>Messages</h1>
        <p>Communicate with {user?.userType === 'client' ? 'freelancers' : 'clients'}</p>
      </div>

      <div className="messages-container">
        {/* Sidebar */}
        <div className="messages-sidebar">
          <div className="sidebar-tabs">
            <button 
              className={`tab-button ${activeTab === 'conversations' ? 'active' : ''}`}
              onClick={() => setActiveTab('conversations')}
            >
              Conversations
            </button>
            <button 
              className={`tab-button ${activeTab === 'contacts' ? 'active' : ''}`}
              onClick={() => setActiveTab('contacts')}
            >
              {user?.userType === 'client' ? 'Freelancers' : 'Clients'} ({contacts.length})
            </button>
          </div>

          {activeTab === 'conversations' ? (
            <div className="conversations-list">
              {conversations.length === 0 ? (
                <div className="empty-state">
                  <p>No conversations yet</p>
                  <small>Start a conversation from the Contacts tab</small>
                </div>
              ) : (
                conversations.map(conversation => (
                  <div
                    key={conversation.id}
                    className={`conversation-item ${
                      activeConversation?.id === conversation.id ? 'active' : ''
                    }`}
                    onClick={() => loadConversation(conversation)}
                  >
                    <div className="conversation-avatar">
                      {conversation.participant.name.charAt(0)}
                    </div>
                    <div className="conversation-info">
                      <div className="conversation-header">
                        <span className="participant-name">
                          {conversation.participant.name}
                        </span>
                        <span className="message-time">
                          {new Date(conversation.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="last-message">{conversation.lastMessage}</p>
                      <span className="user-type-badge">
                        {conversation.participant.type}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="contacts-list">
              <div className="contacts-search">
                <input
                  type="text"
                  placeholder={`Search ${user?.userType === 'client' ? 'freelancers' : 'clients'}...`}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchContacts(e.target.value);
                  }}
                  className="search-input"
                />
              </div>
              
              {filteredContacts.length === 0 ? (
                <div className="empty-state">
                  <p>No {user?.userType === 'client' ? 'freelancers' : 'clients'} found</p>
                </div>
              ) : (
                filteredContacts.map(contact => (
                  <div
                    key={contact._id}
                    className="contact-item"
                    onClick={() => startNewConversation(contact)}
                  >
                    <div className="contact-avatar">
                      {contact.firstName.charAt(0)}
                    </div>
                    <div className="contact-info">
                      <div className="contact-header">
                        <span className="contact-name">
                          {contact.firstName} {contact.lastName}
                        </span>
                        <span className="contact-rating">
                          ⭐ {contact.rating || 'New'}
                        </span>
                      </div>
                      <p className="contact-skills">
                        {contact.skills?.slice(0, 3).join(', ')}
                        {contact.skills?.length > 3 && '...'}
                      </p>
                      <span className="user-type-badge">
                        {contact.userType}
                      </span>
                    </div>
                    <div className="contact-action">
                      <button className="start-chat-btn">💬</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {activeConversation ? (
            <>
              <div className="chat-header">
                <div className="chat-partner">
                  <div className="partner-avatar">
                    {activeConversation.participant.name.charAt(0)}
                  </div>
                  <div>
                    <h4>{activeConversation.participant.name}</h4>
                    <span className="partner-type">
                      {activeConversation.participant.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="messages-list">
                {messages.map(message => (
                  <div
                    key={message._id}
                    className={`message ${
                      message.senderId._id === user.id ? 'sent' : 'received'
                    }`}
                  >
                    <div className="message-content">
                      <p>{message.content}</p>
                      <span className="message-time">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="message-input-form">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="message-input"
                />
                <button type="submit" className="send-button">
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="no-conversation">
              <h3>Select a conversation to start messaging</h3>
              <p>
                {activeTab === 'conversations' 
                  ? 'Choose from your existing conversations' 
                  : 'Or browse contacts to start a new conversation'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;