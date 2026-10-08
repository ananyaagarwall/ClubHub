import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { clubApi, institutionApi } from '../../api';

const CLUB_TYPE_LABELS = {
  departmental: 'Departmental',
  inter_departmental: 'Inter-dept',
  institute_level: 'Institute Level',
};

export default function ClubDirectoryPage() {
  const [clubs, setClubs] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    institutionApi.listColleges().then(r => setColleges(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = selectedCollege ? { college_id: selectedCollege } : {};
    clubApi.list(params).then(r => setClubs(r.data)).finally(() => setLoading(false));
  }, [selectedCollege]);

  const filtered = clubs.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const EMOJI_MAP = { departmental: '🔬', inter_departmental: '🤝', institute_level: '🏛️' };

  return (
    <AppLayout>
      <div className="animate-fadeUp">
        <div className="page-header">
          <div>
            <h1 className="page-title">Club Directory</h1>
            <p className="page-subtitle">Discover clubs and communities at your college</p>
          </div>
          <Link to="/clubs/new" className="btn btn--primary">+ Start a Club</Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2" style={{ marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <input
            id="club-search"
            className="form-control"
            style={{ maxWidth: 280 }}
            placeholder="🔍 Search clubs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            id="college-filter"
            className="form-control"
            style={{ maxWidth: 220 }}
            value={selectedCollege}
            onChange={e => setSelectedCollege(e.target.value)}
          >
            <option value="">All Colleges</option>
            {colleges.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🎯</div>
            <div className="empty-state__text">No clubs found. Try adjusting filters.</div>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map(club => (
              <Link key={club.id} to={`/clubs/${club.id}`} style={{ textDecoration: 'none' }}>
                <div className="card card--clickable club-card">
                  <div className="club-card__cover" style={{
                    background: `linear-gradient(135deg, hsl(${club.name.charCodeAt(0) * 7 % 360}, 70%, 45%) 0%, hsl(${(club.name.charCodeAt(0) * 7 + 120) % 360}, 70%, 55%) 100%)`
                  }}>
                    {EMOJI_MAP[club.club_type] || '🎯'}
                  </div>
                  <div className="card__header" style={{ marginBottom: '0.5rem' }}>
                    <div className="card__title truncate">{club.name}</div>
                  </div>
                  <div className="club-card__meta">
                    <span className="badge badge--primary">{CLUB_TYPE_LABELS[club.club_type]}</span>
                    {club.short_name && <span className="badge badge--muted">{club.short_name}</span>}
                  </div>
                  {club.description && (
                    <p className="text-xs text-muted mt-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {club.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
