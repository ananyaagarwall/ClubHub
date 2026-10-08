import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { clubApi, membershipApi, eventApi } from '../../api';
import { useAuth } from '../../contexts/AuthContext';

const STAGES = ['idea','permission','funds','planning','promotion','pre_event','execution','post_event','archived'];

export default function ClubDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [joinNote, setJoinNote] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinMsg, setJoinMsg] = useState('');

  useEffect(() => {
    clubApi.get(id).then(r => setClub(r.data)).catch(() => navigate('/clubs'));
    eventApi.list({ club_id: id }).then(r => setEvents(r.data)).catch(() => {});
  }, [id, navigate]);

  const handleJoin = async () => {
    if (!user) return navigate('/login');
    setJoining(true);
    try {
      await membershipApi.submitJoinRequest({ club_id: id, motivation: joinNote });
      setJoinMsg('✅ Join request submitted! The club lead will review it.');
    } catch (err) {
      setJoinMsg(err?.response?.data?.detail || 'Error submitting request.');
    } finally {
      setJoining(false);
    }
  };

  if (!club) return <AppLayout><div className="page-loader"><div className="spinner" /></div></AppLayout>;

  return (
    <AppLayout>
      <div className="animate-fadeUp">
        {/* Hero Cover */}
        <div style={{
          height: 180,
          borderRadius: 'var(--radius-xl)',
          marginBottom: '1.5rem',
          background: `linear-gradient(135deg, hsl(${club.name.charCodeAt(0) * 7 % 360}, 70%, 35%) 0%, hsl(${(club.name.charCodeAt(0) * 7 + 120) % 360}, 70%, 45%) 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '4rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          🎯
          <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>{club.name}</h1>
            <div className="flex gap-1" style={{ marginTop: '0.4rem' }}>
              <span className="badge badge--success">{club.status}</span>
              <span className="badge badge--primary">{club.club_type?.replace('_', ' ')}</span>
              {club.short_name && <span className="badge badge--muted">{club.short_name}</span>}
            </div>
          </div>
        </div>

        <div className="grid-2">
          {/* Left: Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card">
              <div className="card__title">About</div>
              <p className="text-sm text-muted mt-1">{club.description || 'No description provided yet.'}</p>
              {club.tagline && <p className="text-sm mt-1" style={{ fontStyle: 'italic', color: 'var(--color-brand-secondary)' }}>"{club.tagline}"</p>}
              {club.instagram_handle && (
                <a href={`https://instagram.com/${club.instagram_handle}`} target="_blank" rel="noreferrer"
                  className="btn btn--secondary btn--sm" style={{ marginTop: '1rem', width: 'fit-content' }}>
                  📸 @{club.instagram_handle}
                </a>
              )}
            </div>

            {/* Join request */}
            {user && user.global_role === 'student' && (
              <div className="card">
                <div className="card__title">Request to Join</div>
                <div className="form-group" style={{ marginTop: '0.75rem' }}>
                  <label className="form-label">Why do you want to join?</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Tell us about your motivation..."
                    value={joinNote}
                    onChange={e => setJoinNote(e.target.value)}
                  />
                </div>
                {joinMsg ? (
                  <p className="text-sm" style={{ color: joinMsg.startsWith('✅') ? 'var(--color-success)' : 'var(--color-danger)', marginTop: '0.5rem' }}>{joinMsg}</p>
                ) : (
                  <button id={`join-club-${id}`} className="btn btn--primary" style={{ marginTop: '0.75rem' }} onClick={handleJoin} disabled={joining}>
                    {joining ? <span className="spinner" /> : '🚀 Request to Join'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right: Events */}
          <div className="card">
            <div className="card__header flex justify-between items-center">
              <div className="card__title">Events</div>
              {user && (
                <Link to={`/events/new?club_id=${id}`} className="btn btn--primary btn--sm">+ Event</Link>
              )}
            </div>
            {events.length === 0 ? (
              <div className="empty-state" style={{ padding: '1.5rem' }}>
                <div className="empty-state__icon">📅</div>
                <div className="empty-state__text">No events yet</div>
              </div>
            ) : events.map(ev => {
              const stageIdx = STAGES.indexOf(ev.stage);
              return (
                <Link key={ev.id} to={`/events/${ev.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-bold">{ev.title}</div>
                      <span className="badge badge--primary">{ev.stage}</span>
                    </div>
                    {/* Stage progress mini bar */}
                    <div style={{ marginTop: '0.5rem', height: 4, background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${((stageIdx + 1) / STAGES.length) * 100}%`,
                        background: 'var(--gradient-brand)',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                    <div className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>
                      {stageIdx + 1}/{STAGES.length} stages complete
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
