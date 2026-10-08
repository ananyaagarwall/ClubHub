import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { eventApi } from '../../api';
import { useAuth } from '../../contexts/AuthContext';

const STAGES = ['idea','permission','funds','planning','promotion','pre_event','execution','post_event','archived'];
const STAGE_LABELS = {
  idea: '💡 Idea',
  permission: '📋 Permission',
  funds: '💰 Funds',
  planning: '🗂 Planning',
  promotion: '📢 Promotion',
  pre_event: '🔧 Pre-Event',
  execution: '🎉 Execution',
  post_event: '📊 Post-Event',
  archived: '🗃 Archived',
};

export default function EventDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [advancing, setAdvancing] = useState(false);
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    eventApi.get(id).then(r => setEvent(r.data)).catch(() => navigate('/events'));
  }, [id, navigate]);

  const handleAdvance = async () => {
    setAdvancing(true);
    setMsg('');
    try {
      const { data } = await eventApi.advanceStage(id, { notes: note });
      setEvent(data);
      setNote('');
      setMsg('✅ Stage advanced successfully');
    } catch (err) {
      setMsg(err?.response?.data?.detail || 'Error advancing stage');
    } finally {
      setAdvancing(false);
    }
  };

  if (!event) return <AppLayout><div className="page-loader"><div className="spinner" /></div></AppLayout>;

  const currentIdx = STAGES.indexOf(event.stage);
  const d = event.start_datetime ? new Date(event.start_datetime) : null;
  const canAdvance = user && !event.is_locked && currentIdx < STAGES.length - 1;

  return (
    <AppLayout>
      <div className="animate-fadeUp">
        {/* Lifecycle Stepper */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
          <div className="stepper">
            {STAGES.map((s, i) => (
              <div key={s} className={`step ${i < currentIdx ? 'step--done' : i === currentIdx ? 'step--active' : ''}`}>
                {STAGE_LABELS[s]}
              </div>
            ))}
          </div>
        </div>

        <div className="grid-2">
          {/* Event info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card">
              <div style={{ marginBottom: '0.75rem' }}>
                <div className="flex gap-1" style={{ marginBottom: '0.5rem' }}>
                  <span className="badge badge--primary">{event.stage?.replace('_', ' ')}</span>
                  <span className="badge badge--muted">{event.visibility}</span>
                  {event.is_locked && <span className="badge badge--danger">Locked</span>}
                </div>
                <h1 className="page-title" style={{ fontSize: '1.5rem' }}>{event.title}</h1>
              </div>
              {event.description && <p className="text-sm text-muted">{event.description}</p>}
              <div className="divider" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { label: 'Venue', value: event.venue || 'TBD' },
                  { label: 'Date', value: d ? d.toLocaleDateString() : 'TBD' },
                  { label: 'Expected Turnout', value: event.expected_turnout || 'TBD' },
                  { label: 'Audience', value: event.audience || 'Open' },
                ].map(f => (
                  <div key={f.label}>
                    <div className="text-xs text-muted">{f.label}</div>
                    <div className="text-sm font-bold" style={{ marginTop: '0.15rem' }}>{f.value}</div>
                  </div>
                ))}
              </div>
              {event.registration_link && (
                <a href={event.registration_link} target="_blank" rel="noreferrer"
                  className="btn btn--primary" style={{ marginTop: '1rem' }}>
                  Register Now 🔗
                </a>
              )}
            </div>

            {/* Goal */}
            {event.goal && (
              <div className="card">
                <div className="card__title">🎯 Event Goal</div>
                <p className="text-sm text-muted mt-1">{event.goal}</p>
              </div>
            )}

            {/* Post-event */}
            {(event.feedback_summary || event.lessons_learned) && (
              <div className="card">
                <div className="card__title">📊 Post-Event</div>
                {event.feedback_summary && <p className="text-sm text-muted mt-1">{event.feedback_summary}</p>}
                {event.lessons_learned && <p className="text-sm mt-1" style={{ color: 'var(--color-brand-secondary)' }}>💡 {event.lessons_learned}</p>}
              </div>
            )}
          </div>

          {/* Stage advance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {canAdvance && (
              <div className="card">
                <div className="card__title">Advance Stage</div>
                <p className="text-sm text-muted mt-1">
                  Move to: <strong style={{ color: 'var(--color-brand-primary)' }}>{STAGE_LABELS[STAGES[currentIdx + 1]]}</strong>
                </p>
                <div className="form-group" style={{ marginTop: '0.75rem' }}>
                  <label className="form-label">Notes (optional)</label>
                  <textarea className="form-control" rows={3} value={note} onChange={e => setNote(e.target.value)}
                    placeholder="Any notes about this stage transition..." />
                </div>
                {msg && (
                  <p className="text-sm" style={{ color: msg.startsWith('✅') ? 'var(--color-success)' : 'var(--color-danger)', marginTop: '0.5rem' }}>
                    {msg}
                  </p>
                )}
                <button id={`advance-stage-${id}`} className="btn btn--primary" style={{ marginTop: '0.75rem' }} onClick={handleAdvance} disabled={advancing}>
                  {advancing ? <span className="spinner" /> : '⬆ Advance Stage'}
                </button>
              </div>
            )}

            {/* Progress */}
            <div className="card">
              <div className="card__title">Progress</div>
              <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {STAGES.map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <span style={{ fontSize: '0.75rem', color: i <= currentIdx ? 'var(--color-success)' : 'var(--color-text-muted)', minWidth: 16 }}>
                      {i < currentIdx ? '✓' : i === currentIdx ? '●' : '○'}
                    </span>
                    <span className="text-xs" style={{ color: i <= currentIdx ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
                      {STAGE_LABELS[s]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
