import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCandidateStore } from '../store/candidateStore';
import { useToastStore } from '../components/Toast';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  FileCheck, 
  Trash2, 
  Edit, 
  Play, 
  ShieldAlert, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Download
} from 'lucide-react';

export const CandidateDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);
  const { currentCandidate, loading, fetchCandidate, startVerification, deleteCandidate } = useCandidateStore();

  const [verifying, setVerifying] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCandidate(id);
    }
  }, [id, fetchCandidate]);

  const handleStartVerification = async () => {
    if (!id) return;
    setVerifying(true);
    addToast('Starting verification pipeline... Running mock Government APIs.', 'info');
    try {
      await startVerification(id);
      addToast('Verification pipeline completed successfully!', 'success');
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Verification workflow execution failed.', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteCandidate(id);
      addToast('Candidate profile deleted successfully.', 'success');
      navigate('/candidates');
    } catch (err: any) {
      addToast('Failed to delete candidate.', 'error');
    }
  };

  if (loading && !currentCandidate) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-24"></div>
        <div className="h-32 bg-white border border-slate-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-white border border-slate-200 rounded md:col-span-2"></div>
          <div className="h-64 bg-white border border-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!currentCandidate) {
    return (
      <div className="text-center py-16 bg-white border border-slate-200 rounded shadow-premium">
        <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Candidate Not Found</h3>
        <p className="text-sm text-slate-400 font-medium mt-1 mb-6">The profile file could not be found or you do not have permission to view it.</p>
        <Link to="/candidates" className="bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded shadow-premium">
          Back to Directory
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200">VERIFIED</span>;
      case 'FAILED':
        return <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-red-50 text-red-700 border border-red-200">FAILED</span>;
      case 'PARTIAL':
        return <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">PARTIAL</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">PENDING</span>;
    }
  };

  const maskAadhaar = (val: string) => {
    if (val.length < 12) return 'XXXX-XXXX-XXXX';
    return `XXXX-XXXX-${val.substring(8)}`;
  };

  const maskPAN = (val: string) => {
    if (val.length < 10) return 'XXXXX-XXXX-X';
    return `${val.substring(0, 5)}XXXX${val.substring(9)}`;
  };

  const toggleLogExpand = (logId: string) => {
    setExpandedLogId(expandedLogId === logId ? null : logId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button and profile title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <button 
            onClick={() => navigate('/candidates')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">{currentCandidate.fullName}</h2>
            {getStatusBadge(currentCandidate.status)}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleStartVerification}
            disabled={verifying || currentCandidate.status === 'VERIFIED'}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white text-sm font-semibold px-4 py-2 rounded shadow-premium transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            {verifying ? 'Verifying...' : 'Start Verification'}
          </button>
          <button
            onClick={() => navigate(`/candidates/${currentCandidate.id}/edit`)}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold px-4 py-2 rounded shadow-premium transition-all"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 bg-white hover:bg-red-50 border border-slate-200 text-red-600 text-sm font-semibold px-4 py-2 rounded shadow-premium transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Delete File
          </button>
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card & Report info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Profile particulars */}
          <div className="bg-white border border-slate-200 rounded p-6 shadow-premium space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">Identity Particulars</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="flex flex-col truncate">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Email Address</span>
                  <span className="text-slate-700 font-medium truncate">{currentCandidate.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Phone Number</span>
                  <span className="text-slate-700 font-medium">{currentCandidate.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Date of Birth</span>
                  <span className="text-slate-700 font-medium">{currentCandidate.dob}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Current Address</span>
                  <span className="text-slate-700 font-medium truncate max-w-[240px]" title={currentCandidate.address}>{currentCandidate.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Aadhaar Number (Govt ID)</span>
                  <span className="text-slate-700 font-mono font-medium">{maskAadhaar(currentCandidate.aadhaarNumber)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">PAN Number (Tax ID)</span>
                  <span className="text-slate-700 font-mono font-medium">{maskPAN(currentCandidate.panNumber)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white border border-slate-200 rounded p-6 shadow-premium space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">Identity Check Audit Trails</h3>
            
            {!currentCandidate.logs || currentCandidate.logs.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm font-medium">
                No identity checks have been executed yet. Click 'Start Verification' to run checks.
              </div>
            ) : (
              <div className="space-y-3">
                {currentCandidate.logs.map((log) => {
                  const isExpanded = expandedLogId === log.id;
                  return (
                    <div key={log.id} className="border border-slate-200 rounded overflow-hidden">
                      <button
                        onClick={() => toggleLogExpand(log.id)}
                        className="w-full flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3 text-sm">
                          <span className={`w-2 h-2 rounded-full ${log.verificationStatus === 'SUCCESS' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span className="font-semibold text-slate-700">{log.verificationType} CHECK</span>
                          <span className="text-xs text-slate-400 font-normal">
                            {new Date(log.verifiedAt).toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric' })}
                          </span>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                      </button>
                      
                      {isExpanded && (
                        <div className="p-4 bg-slate-900 text-slate-300 font-mono text-xs border-t border-slate-200 space-y-3 overflow-x-auto">
                          <div>
                            <span className="text-slate-400 font-semibold block mb-1">// Request Parameters:</span>
                            <pre className="bg-slate-950 p-2.5 rounded text-green-400 max-h-40 overflow-y-auto">
                              {JSON.stringify(log.requestPayload, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold block mb-1">// Gateway Response:</span>
                            <pre className="bg-slate-950 p-2.5 rounded text-blue-400 max-h-40 overflow-y-auto">
                              {JSON.stringify(log.responsePayload, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Verification Reports panel */}
        <div className="bg-white border border-slate-200 rounded p-6 shadow-premium space-y-4 h-fit">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">Verification Filings</h3>

          {!currentCandidate.reports || currentCandidate.reports.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-sm font-medium">
              No reports compiled. Running verification automatically builds the PDF certificate.
            </div>
          ) : (
            <div className="space-y-3">
              {currentCandidate.reports.map((report) => (
                <div key={report.id} className="p-3 border border-slate-200 rounded hover:border-slate-300 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4.5 h-4.5 text-slate-600" />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">Verification Report</span>
                      <span className="text-[9px] text-slate-400">
                        {new Date(report.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {/* Link to external tab viewer */}
                    <a
                      href={report.reportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded text-slate-600 hover:text-slate-900 transition-colors"
                      title="Open Report PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                    <Link
                      to={`/reports/${currentCandidate.id}`}
                      className="text-xs font-bold text-slate-900 hover:underline px-2 py-1"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded p-6 shadow-premium-lg space-y-4 animate-scale-up">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Confirm Profile Deletion</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Are you sure you want to delete the file for <strong>{currentCandidate.fullName}</strong>? This will permanently erase candidate records, verification logs, and compiled PDF reports.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded shadow-premium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded shadow-premium transition-all"
              >
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CandidateDetails;
