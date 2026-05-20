import { NavLink } from 'react-router-dom';
import { Shield, Users, History, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const links = [
    { to: '/', name: 'Dashboard', icon: LayoutDashboard },
    { to: '/candidates', name: 'Candidates', icon: Users },
    { to: '/logs', name: 'Verification Logs', icon: History },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 flex-shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-100">
        <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center">
          <Shield className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-slate-900 leading-none">vShield</h1>
          <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Verification Platform</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded transition-all ${
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              {link.name}
            </NavLink>
          );
        })}
      </nav>

      {/* User Session Info & Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs font-semibold text-slate-800 truncate">{user?.name}</p>
          <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-all"
        >
          <LogOut className="w-4.5 h-4.5 flex-shrink-0 text-red-600" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
