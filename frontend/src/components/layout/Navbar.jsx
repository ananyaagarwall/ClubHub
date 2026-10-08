import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">🎓 ClubHub</Link>
      <div className="navbar__actions">
        {user ? (
          <>
            <span className="text-sm text-muted">{user.full_name}</span>
            <span className="badge badge--primary" style={{ textTransform: 'capitalize' }}>
              {user.global_role.replace('_', ' ')}
            </span>
            <button className="btn btn--secondary btn--sm" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn--secondary btn--sm">Login</Link>
            <Link to="/register" className="btn btn--primary btn--sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
