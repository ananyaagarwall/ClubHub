import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AppLayout from '../components/layout/AppLayout';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ClubDirectoryPage from '../pages/clubs/ClubDirectoryPage';
import ClubDetailPage from '../pages/clubs/ClubDetailPage';
import EventListPage from '../pages/events/EventListPage';
import EventDetailPage from '../pages/events/EventDetailPage';
import EventCreatePage from '../pages/events/EventCreatePage';

// Simple Auth Guard
const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <AppLayout><div className="page-loader"><div className="spinner"/></div></AppLayout>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  // Clubs
  {
    path: '/clubs',
    element: <ClubDirectoryPage />,
  },
  {
    path: '/clubs/:id',
    element: <ClubDetailPage />,
  },
  // Events
  {
    path: '/events',
    element: <EventListPage />,
  },
  {
    path: '/events/new',
    element: <RequireAuth><EventCreatePage /></RequireAuth>,
  },
  {
    path: '/events/:id',
    element: <EventDetailPage />,
  },
  // Fallback routes for undeveloped pages
  {
    path: '/meetings',
    element: <AppLayout><div className="empty-state"><h3>Meetings Module</h3><p>Coming soon...</p></div></AppLayout>,
  },
  {
    path: '/documents',
    element: <AppLayout><div className="empty-state"><h3>Document Vault</h3><p>Coming soon...</p></div></AppLayout>,
  },
  {
    path: '/admin/institutions',
    element: <AppLayout><div className="empty-state"><h3>Admin: Institutions</h3><p>Coming soon...</p></div></AppLayout>,
  },
  {
    path: '/admin/users',
    element: <AppLayout><div className="empty-state"><h3>Admin: Users</h3><p>Coming soon...</p></div></AppLayout>,
  },
  {
    path: '*',
    element: <AppLayout><div className="empty-state"><h2>404</h2><p>Page not found</p></div></AppLayout>,
  },
]);

export default router;
