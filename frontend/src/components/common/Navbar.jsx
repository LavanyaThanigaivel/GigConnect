import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          GigConnect
        </Link>
        
        <div className="navbar-menu">
          {user ? (
            <>
              <Link 
                to="/gigs" 
                className={`nav-link ${location.pathname === '/gigs' ? 'active' : ''}`}
              >
                Find Gigs
              </Link>
              {user.userType === 'client' && (
                <Link 
                  to="/gigs/create" 
                  className={`nav-link ${location.pathname === '/gigs/create' ? 'active' : ''}`}
                >
                  Post Gig
                </Link>
              )}
              <Link 
                to="/messages" 
                className={`nav-link ${location.pathname === '/messages' ? 'active' : ''}`}
              >
                Messages
              </Link>
              <Link 
                to="/profile" 
                className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
              >
                Profile
              </Link>
              <span className="user-welcome">Hello, {user.firstName}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;