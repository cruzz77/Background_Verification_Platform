import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useToastStore } from '../components/Toast';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ShieldAlert, 
  ExternalLink 
} from 'lucide-react';

interface ReportDetails {
  id: string;
  candidateId: string;
  reportUrl: string;
  generatedAt: string;
  candidate: {
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    address: string;
    status: string;
    aadhaarNumber: string;
    panNumber: string;
  };
}

export const ReportViewer = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);
  
  const [report, setReport] = useState<ReportDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      if (!candidateId) return;
      setLoading(true);
      try {
        const response = await api.get(`/reports/${candidateId}`);
        setReport(response.data.data.report);
      } catch (err: any) {
        addToast(err.response?.data?.message || 'Failed to fetch verification report.', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, [candidateId, addToast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200">VERIFIED</span>;
      case 'FAILED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-700 border border-red-200">FAILED</span>;
      case 'PARTIAL':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">PARTIAL</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">PENDING</span>;
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

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-24"></div>
        <div className="h-96 bg-white border border-slate-200 rounded"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-16 bg-white border border-slate-200 rounded shadow-premium max-w-xl mx-auto">
        <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Report Not Generated</h3>
        <p className="text-sm text-slate-400 font-medium mt-1 mb-6">
          A verification report does not exist for this candidate yet. You must first trigger the verification check.
        </p>
        <div className="flex justify-center gap-2">
          <button 
            onClick={() => navigate(`/candidates/${candidateId}`)}
            className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded shadow-premium"
          >
            Candidate Profile
          </button>
          <Link to="/candidates" className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded shadow-premium">
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button 
            onClick={() => navigate(`/candidates/${candidateId}`)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Candidate File
          </button>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Background Assessment Record</h2>
        </div>
        <div className="flex gap-2">
          <a
            href={report.reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded shadow-premium transition-all"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        </div>
      </div>

      {/* Web assessment card representation */}
      <div className="bg-white border border-slate-200 rounded shadow-premium p-8 space-y-8 font-sans">
        {/* Certificate Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <h1 className="text-lg font-bold text-slate-900 leading-none">vShield Assessment Certificate</h1>
            <p className="text-xs text-slate-400 font-medium">DIGITALLY SECURED BACKGROUND VERIFICATION REPORT</p>
          </div>
          <div className="text-right text-xs text-slate-500 font-medium leading-normal">
            <div>Report ID: <span className="font-mono text-slate-700">{report.id.slice(0, 8).toUpperCase()}</span></div>
            <div>Compiled: {new Date(report.generatedAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}</div>
          </div>
        </div>

        {/* Assessment Status Bar */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Credential Validation Result</span>
            <span className="text-sm font-bold text-slate-800">Overall Verification Conclusion</span>
          </div>
          {getStatusBadge(report.candidate.status)}
        </div>

        {/* Candidate particulars */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Candidate profile</h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Full Name</span>
              <span className="text-slate-800 font-medium">{report.candidate.fullName}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Date of Birth</span>
              <span className="text-slate-800 font-medium">{report.candidate.dob}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Email Address</span>
              <span className="text-slate-800 font-medium truncate block max-w-xs">{report.candidate.email}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Phone Number</span>
              <span className="text-slate-800 font-medium">{report.candidate.phone}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Current Address</span>
              <span className="text-slate-800 font-medium">{report.candidate.address}</span>
            </div>
          </div>
        </div>

        {/* Document validations */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Gateway Identity Checks</h3>
          
          <div className="space-y-4">
            {/* Aadhaar Check */}
            <div className="border border-slate-200 rounded p-4 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-sm font-bold text-slate-800">Aadhaar Verification check</span>
                <div className="text-xs text-slate-400">UIDAI government database validation</div>
                <div className="text-xs font-mono font-medium text-slate-500 mt-1">Aadhaar: {maskAadhaar(report.candidate.aadhaarNumber)}</div>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-xs">
                {report.candidate.status === 'FAILED' ? (
                  <>
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-red-700 uppercase">FAILED</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-700 uppercase">SUCCESS</span>
                  </>
                )}
              </div>
            </div>

            {/* PAN Check */}
            <div className="border border-slate-200 rounded p-4 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-sm font-bold text-slate-800">PAN Verification check</span>
                <div className="text-xs text-slate-400">Income Tax Department database validation</div>
                <div className="text-xs font-mono font-medium text-slate-500 mt-1">PAN: {maskPAN(report.candidate.panNumber)}</div>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-xs">
                {report.candidate.status === 'FAILED' || report.candidate.status === 'PARTIAL' ? (
                  <>
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-red-700 uppercase">FAILED</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-700 uppercase">SUCCESS</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer stamp/placeholder */}
        <div className="flex justify-between items-end pt-8 border-t border-slate-200 text-xs text-slate-400 font-medium">
          <div>
            <p>Verified through vShield Trust Gateway Protocol.</p>
            <p className="text-[10px] mt-0.5">© vShield Inc. All credentials cryptographically certified.</p>
          </div>
          <div className="text-center w-40">
            <div className="h-10 border-b border-slate-300"></div>
            <p className="mt-1 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Verification Officer</p>
          </div>
        </div>
      </div>

      {/* Cloudinary direct view block */}
      <div className="bg-slate-100 border border-slate-200 rounded p-4 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600 flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" />
          Officially compiled assessment document is hosted on secure CDN storage.
        </span>
        <a 
          href={report.reportUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-slate-900 hover:underline"
        >
          View raw PDF <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
export default ReportViewer;
