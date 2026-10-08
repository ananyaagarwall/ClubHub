import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { eventApi } from '../../api';

const STAGE_COLORS = {
  idea: 'badge--muted',
  permission: 'badge--warning',
  funds: 'badge--warning',
  planning: 'badge--primary',
  promotion: 'badge--primary',
  pre_event: 'badge--info',
  execution: 'badge--success',
  post_event: 'badge--success',
  archived: 'badge--muted',
};

export default function EventListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventApi.list().then(r => setEvents(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="animate-fadeUp">
        <div className="page-header">
          <div>
            <h1 className="page-title">Public Events</h1>
            <p className="page-subtitle">All upcoming and recent events across clubs</p>
          </div>
          <Link to="/events/new" className="btn btn--primary">+ Create Event</Link>
        </div>

        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📅</div>
            <div className="empty-state__text">No events found</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {events.map(ev => {
              const d = ev.start_datetime ? new Date(ev.start_datetime) : null;
              return (
                <Link key={ev.id} to={`/events/${ev.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card card--clickable" style={{ padding: '1rem 1.25rem' }}>
                    <div className="flex gap-2 items-center">
                      {/* Date chip */}
                      <div className="event-card__date" style={{ flexShrink: 0 }}>
                        <div className="event-card__month">{d ? d.toLocaleString('default', { month: 'short' }) : '—'}</div>
                        <div className="event-card__day">{d ? d.getDate() : '—'}</div>
                      </div>
                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <div className="flex justify-between items-center">
                          <span className="font-bold">{ev.title}</span>
                          <span className={`badge ${STAGE_COLORS[ev.stage] || 'badge--muted'}`}>{ev.stage?.replace('_', ' ')}</span>
                        </div>
                        <div className="text-xs text-muted mt-1">{ev.venue || 'Venue TBD'} {ev.audience ? `· ${ev.audience}` : ''}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
