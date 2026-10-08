import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../contexts/AuthContext';
import { clubApi, eventApi, notificationApi } from '../../api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      clubApi.list().then(r => setClubs(r.data.slice(0, 6))),
      eventApi.list().then(r => setEvents(r.data.slice(0, 5))),
      user && notificationApi.list().then(r => setNotifications(r.data.filter(n => !n.is_read).slice(0, 5))),
    ]).finally(() => setLoading(false));
  }, [user]);

  const statCards = [
    { icon: '🎯', label: 'Active Clubs', value: clubs.length, color: 'rgba(108,99,255,0.15)', iconColor: '#6C63FF' },
    { icon: '📅', label: 'Upcoming Events', value: events.length, color: 'rgba(72,207,173,0.15)', iconColor: '#48CFAD' },
    { icon: '🔔', label: 'Unread Notifications', value: notifications.length, color: 'rgba(247,183,49,0.15)', iconColor: '#F7B731' },
    { icon: '👥', label: 'Your Role', value: user?.global_role?.replace('_', ' ') || '—', color: 'rgba(255,94,125,0.15)', iconColor: '#FF5E7D' },
  ];

  if (loading) return (
    <AppLayout>
      <div className="page-loader"><div className="spinner" /></div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="animate-fadeUp">
        {/* Hero greeting */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="page-title" style={{ fontSize: '2rem' }}>
            Welcome back, {user?.full_name?.split(' ')[0]} 👋
          </h1>
          <p className="text-muted mt-1">Here's what's happening across clubs today.</p>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          {statCards.map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card__icon" style={{ background: s.color }}>
                {s.icon}
              </div>
              <div>
                <div className="stat-card__value" style={{ textTransform: 'capitalize' }}>{s.value}</div>
                <div className="stat-card__label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          {/* Recent Clubs */}
          <div className="card">
            <div className="card__header flex justify-between items-center">
              <div>
                <div className="card__title">Active Clubs</div>
                <div className="card__subtitle">Across all colleges</div>
              </div>
              <Link to="/clubs" className="btn btn--secondary btn--sm">View All</Link>
            </div>
            {clubs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">🎯</div>
                <div className="empty-state__text">No clubs yet. Be the first!</div>
              </div>
            ) : clubs.map(club => (
              <Link key={club.id} to={`/clubs/${club.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div className="club-card card--clickable" style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                  <div className="flex items-center gap-2">
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                      🎯
                    </div>
                    <div>
                      <div className="text-sm font-bold truncate">{club.name}</div>
                      <div className="text-xs text-muted">{club.club_type?.replace('_', ' ')}</div>
                    </div>
                    <span className="badge badge--success" style={{ marginLeft: 'auto' }}>Active</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Upcoming Events */}
          <div className="card">
            <div className="card__header flex justify-between items-center">
              <div>
                <div className="card__title">Upcoming Events</div>
                <div className="card__subtitle">Public calendar</div>
              </div>
              <Link to="/events" className="btn btn--secondary btn--sm">View All</Link>
            </div>
            {events.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">📅</div>
                <div className="empty-state__text">No upcoming events</div>
              </div>
            ) : events.map(ev => {
              const d = ev.start_datetime ? new Date(ev.start_datetime) : null;
              return (
                <Link key={ev.id} to={`/events/${ev.id}`} style={{ textDecoration: 'none' }}>
                  <div className="event-card" style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                    <div className="event-card__date">
                      <div className="event-card__month">{d ? d.toLocaleString('default', { month: 'short' }) : '—'}</div>
                      <div className="event-card__day">{d ? d.getDate() : '—'}</div>
                    </div>
                    <div className="event-card__body">
                      <div className="event-card__title">{ev.title}</div>
                      <div className="event-card__sub">{ev.venue || 'Venue TBD'}</div>
                      <span className="badge badge--primary" style={{ marginTop: '0.25rem' }}>{ev.stage}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="card mt-2" style={{ marginTop: '1.25rem' }}>
            <div className="card__header">
              <div className="card__title">🔔 Recent Notifications</div>
            </div>
            {notifications.map(n => (
              <div key={n.id} style={{ padding: '0.625rem 0', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="text-sm font-bold">{n.title}</div>
                  <div className="text-xs text-muted">{n.message}</div>
                </div>
                <span className="badge badge--warning">New</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
