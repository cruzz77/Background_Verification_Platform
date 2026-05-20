import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCandidateStore } from '../store/candidateStore';
import { Card } from '../components/Card';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  HelpCircle, 
  UserPlus, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { Candidate } from '../types';

export const Dashboard = () => {
  const { dashboardStats, candidates, loading, fetchDashboardStats, fetchCandidates } = useCandidateStore();
  const navigate = useNavigate();
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setStatsLoading(true);
      await Promise.all([
        fetchDashboardStats(),
        fetchCandidates({ limit: 5 }) // load latest 5 candidates
      ]);
      setStatsLoading(false);
    };
    loadDashboardData();
  }, [fetchDashboardStats, fetchCandidates]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200">VERIFIED</span>;
      case 'FAILED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">FAILED</span>;
      case 'PARTIAL':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-50 text-orange-700 border border-orange-200">PARTIAL</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-200">PENDING</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Workspace Insights</h2>
          <p className="text-sm text-slate-500 font-medium">Real-time candidate authentication performance overview.</p>
        </div>
        <button
          onClick={() => navigate('/candidates/new')}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded shadow-premium transition-all w-fit"
        >
          <UserPlus className="w-4 h-4" />
          Add Candidate
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card
          title="Total Audited"
          value={dashboardStats.total}
          subtext="Total candidate profiles"
          icon={Users}
          loading={statsLoading}
        />
        <Card
          title="Fully Verified"
          value={dashboardStats.verified}
          subtext={`${dashboardStats.total > 0 ? Math.round((dashboardStats.verified / dashboardStats.total) * 100) : 0}% success rate`}
          icon={CheckCircle2}
          loading={statsLoading}
        />
        <Card
          title="Partial Match"
          value={dashboardStats.partial}
          subtext="Single document passed"
          icon={AlertCircle}
          loading={statsLoading}
        />
        <Card
          title="Failed Checks"
          value={dashboardStats.failed}
          subtext="Mismatches detected"
          icon={XCircle}
          loading={statsLoading}
        />
        <Card
          title="Pending Queue"
          value={dashboardStats.pending}
          subtext="Awaiting verification"
          icon={HelpCircle}
          loading={statsLoading}
        />
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Candidates List Table */}
        <div className="bg-white border border-slate-200 rounded p-6 shadow-premium lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Latest Candidate Filings</h3>
            <Link to="/candidates" className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1">
              View directory <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-semibold text-slate-400 border-b border-slate-100">
                  <th className="py-2">Name</th>
                  <th className="py-2">Identity Details</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {loading && candidates.length === 0 ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-3"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                      <td className="py-3"><div className="h-4 bg-slate-100 rounded w-36"></div></td>
                      <td className="py-3"><div className="h-4 bg-slate-100 rounded w-16"></div></td>
                      <td className="py-3"><div className="h-4 bg-slate-100 rounded w-10 ml-auto"></div></td>
                    </tr>
                  ))
                ) : candidates.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                      No candidate filings added yet. Click 'Add Candidate' to start.
                    </td>
                  </tr>
                ) : (
                  candidates.slice(0, 5).map((candidate: Candidate) => (
                    <tr key={candidate.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 font-semibold text-slate-800 truncate max-w-[120px]">{candidate.fullName}</td>
                      <td className="py-3.5 text-xs text-slate-500">
                        PAN: {candidate.panNumber.slice(0,2)}•••{candidate.panNumber.slice(-1)} | DOB: {candidate.dob}
                      </td>
                      <td className="py-3.5">{getStatusBadge(candidate.status)}</td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => navigate(`/candidates/${candidate.id}`)}
                          className="text-xs font-bold text-slate-900 hover:underline"
                        >
                          View File
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Summary Audit Card */}
        <div className="bg-white border border-slate-200 rounded p-6 shadow-premium flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Gateway Metrics</h3>
              <TrendingUp className="w-4 h-4 text-slate-500" />
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Audit Pass Rate</span>
                  <span>{dashboardStats.total > 0 ? Math.round(((dashboardStats.verified + dashboardStats.partial) / dashboardStats.total) * 100) : 0}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-900 rounded-full" 
                    style={{ width: `${dashboardStats.total > 0 ? ((dashboardStats.verified + dashboardStats.partial) / dashboardStats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 text-xs space-y-2 text-slate-500 leading-snug">
                <div className="flex items-center justify-between">
                  <span>Aadhaar Integrations</span>
                  <span className="font-semibold text-slate-700">Mock API Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>PAN Integrations</span>
                  <span className="font-semibold text-slate-700">Mock API Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>PDF Engine</span>
                  <span className="font-semibold text-slate-700">Puppeteer Headless</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Secure Storage</span>
                  <span className="font-semibold text-slate-700">Cloudinary SDK</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6">
            <Link 
              to="/logs" 
              className="w-full text-center block bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 py-2.5 rounded transition-all"
            >
              Auditing System Logs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
