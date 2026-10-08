import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: '🏠', path: '/dashboard', section: 'Main' },
  { label: 'Clubs', icon: '🎯', path: '/clubs', section: 'Main' },
  { label: 'Events', icon: '📅', path: '/events', section: 'Main' },
  { label: 'Meetings', icon: '💬', path: '/meetings', section: 'Club' },
  { label: 'Documents', icon: '📄', path: '/documents', section: 'Club' },
];

const ADMIN_ITEMS = [
  { label: 'Institutions', icon: '🏛️', path: '/admin/institutions', section: 'Admin' },
  { label: 'Users', icon: '👥', path: '/admin/users', section: 'Admin' },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const sections = {};
  const allItems = [...NAV_ITEMS, ...(user?.global_role === 'platform_admin' ? ADMIN_ITEMS : [])];
  allItems.forEach(item => {
    if (!sections[item.section]) sections[item.section] = [];
    sections[item.section].push(item);
  });

  return (
    <aside className="sidebar">
      {Object.entries(sections).map(([section, items]) => (
        <div key={section}>
          <div className="sidebar__section-label">{section}</div>
          {items.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar__item${pathname.startsWith(item.path) ? ' sidebar__item--active' : ''}`}
            >
              <span className="sidebar__icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      ))}
    </aside>
  );
}
