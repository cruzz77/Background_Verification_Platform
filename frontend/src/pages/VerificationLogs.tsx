import { useEffect, useState } from 'react';
import api from '../services/api';
import { useToastStore } from '../components/Toast';
import { History, ChevronDown, ChevronUp, CheckCircle2, XCircle, Search } from 'lucide-react';

interface VerificationLogItem {
  id: string;
  candidateId: string;
  verificationType: 'AADHAAR' | 'PAN';
  requestPayload: any;
  responsePayload: any;
  verificationStatus: 'SUCCESS' | 'FAILED';
  verifiedAt: string;
  candidate: {
    fullName: string;
    email: string;
  };
}

export const VerificationLogs = () => {
  const [logs, setLogs] = useState<VerificationLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const addToast = useToastStore((state) => state.addToast);

  const fetchLogs = async (page: number) => {
    setLoading(true);
    try {
      const response = await api.get('/verifications/logs', {
        params: { page, limit: 15 }
      });
      const { logs, pagination } = response.data.data;
      setLogs(logs);
      setTotalPages(pagination.totalPages);
      setTotalRecords(pagination.total);
    } catch (err: any) {
      addToast('Failed to fetch system verification logs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const toggleExpandLog = (logId: string) => {
    setExpandedLogId(expandedLogId === logId ? null : logId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">System Logs</h2>
        <p className="text-sm text-slate-500 font-medium">Audit logs of identity verification executions across the workspace gateway.</p>
      </div>

      {/* Logs Table grid */}
      <div className="bg-white border border-slate-200 rounded shadow-premium overflow-hidden">
        <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gateway Transactions ({totalRecords})</span>
          <History className="w-4 h-4 text-slate-400" />
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-12 bg-slate-50 border border-slate-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 text-slate-400 font-medium text-sm">
            No verification transactions logged yet. Run identity checks on candidate profiles to record transactions.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {logs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              const isSuccess = log.verificationStatus === 'SUCCESS';
              
              return (
                <div key={log.id} className="transition-colors">
                  {/* Row Header */}
                  <div 
                    onClick={() => toggleExpandLog(log.id)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer hover:bg-slate-50/50 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {isSuccess ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      )}
                      <div>
                        <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                          <span>{log.candidate?.fullName}</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-xs font-bold text-slate-600 tracking-wide uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                            {log.verificationType}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-medium mt-0.5">{log.candidate?.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-8 sm:ml-0">
                      <div className="text-right">
                        <div className="text-xs font-semibold text-slate-700">
                          {isSuccess ? 'CHECK PASSED' : 'CHECK FAILED'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                          {new Date(log.verifiedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric'
                          })}
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded JSON details */}
                  {isExpanded && (
                    <div className="p-4 bg-slate-900 text-slate-300 font-mono text-xs border-t border-slate-200/30 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 font-semibold block mb-1.5">// Submitted Payload:</span>
                        <pre className="bg-slate-950 p-3 rounded text-green-400 max-h-48 overflow-y-auto">
                          {JSON.stringify(log.requestPayload, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block mb-1.5">// Government response payloads:</span>
                        <pre className="bg-slate-950 p-3 rounded text-blue-400 max-h-48 overflow-y-auto">
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

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm font-medium text-slate-500 pt-2">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-3 py-1.5 rounded disabled:opacity-40 transition-all"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-3 py-1.5 rounded disabled:opacity-40 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default VerificationLogs;
