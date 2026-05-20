import { useLocation } from 'react-router-dom';

export const Header = () => {
  const location = useLocation();

  // Get Page Title from Pathname
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/candidates/new')) return 'Register Candidate';
    if (path.match(/\/candidates\/[a-z0-9-]+\/edit/)) return 'Edit Candidate Profile';
    if (path.startsWith('/candidates/')) return 'Candidate File';
    if (path === '/candidates') return 'Candidates Directory';
    if (path === '/logs') return 'System Logs';
    return 'Verification Platform';
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <span className="text-slate-400 text-sm font-medium">vShield</span>
        <span className="text-slate-300">/</span>
        <h2 className="text-sm font-semibold text-slate-800 tracking-tight">{getPageTitle()}</h2>
      </div>
      <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          <span>Gateway: Active</span>
        </div>
        <span>{formattedDate}</span>
      </div>
    </header>
  );
};
