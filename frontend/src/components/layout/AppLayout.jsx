import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AppLayout({ children, hideSidebar = false }) {
  return (
    <div className={`app-layout${hideSidebar ? ' app-layout--no-sidebar' : ''}`}>
      <Navbar />
      {!hideSidebar && <Sidebar />}
      <main className="main-content">{children}</main>
    </div>
  );
}
