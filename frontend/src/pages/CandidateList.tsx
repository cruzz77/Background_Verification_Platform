import { useEffect, useState, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCandidateStore } from '../store/candidateStore';
import { Table, Column } from '../components/Table';
import { Search, UserPlus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Candidate } from '../types';

export const CandidateList = () => {
  const { candidates, pagination, loading, fetchCandidates } = useCandidateStore();
  const navigate = useNavigate();
  
  const [searchVal, setSearchVal] = useState('');
  const [statusVal, setStatusVal] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [, startTransition] = useTransition();

  const handleFetch = (page: number, search: string, status: string) => {
    fetchCandidates({
      page,
      limit: 10,
      search: search.trim() || undefined,
      status: status || undefined,
    });
  };

  useEffect(() => {
    handleFetch(currentPage, searchVal, statusVal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusVal]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchVal(val);
    startTransition(() => {
      setCurrentPage(1);
      handleFetch(1, val, statusVal);
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusVal(e.target.value);
    setCurrentPage(1);
  };

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

  const columns: Column<Candidate>[] = [
    {
      header: 'Full Name',
      accessor: (c) => <span className="font-semibold text-slate-900">{c.fullName}</span>,
    },
    {
      header: 'Email / Phone',
      accessor: (c) => (
        <div className="flex flex-col">
          <span>{c.email}</span>
          <span className="text-xs text-slate-400 font-normal mt-0.5">{c.phone}</span>
        </div>
      ),
    },
    {
      header: 'Aadhaar Number',
      accessor: (c) => <span className="font-mono text-slate-600 text-xs">{maskAadhaar(c.aadhaarNumber)}</span>,
    },
    {
      header: 'PAN Number',
      accessor: (c) => <span className="font-mono text-slate-600 text-xs">{maskPAN(c.panNumber)}</span>,
    },
    {
      header: 'Status',
      accessor: (c) => getStatusBadge(c.status),
    },
    {
      header: 'Added Date',
      accessor: (c) => new Date(c.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' }),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Candidates Directory</h2>
          <p className="text-sm text-slate-500 font-medium">Verify credentials and manage employment candidate profiles.</p>
        </div>
        <button
          onClick={() => navigate('/candidates/new')}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded shadow-premium transition-all w-fit"
        >
          <UserPlus className="w-4 h-4" />
          Add Candidate
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white border border-slate-200 rounded p-4 shadow-premium">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates by name, email, phone..."
            value={searchVal}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded bg-white text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <select
            value={statusVal}
            onChange={handleStatusChange}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded bg-white text-slate-800 focus:ring-1 focus:ring-slate-900 appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="PARTIAL">PARTIAL</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>
      </div>

      {/* Main Table Grid */}
      <Table
        columns={columns}
        data={candidates}
        loading={loading}
        emptyMessage="No candidates match your queries. Click 'Add Candidate' to record a new profile."
        rowKey={(c) => c.id}
        onRowClick={(c) => navigate(`/candidates/${c.id}`)}
      />

      {/* Pagination Controls */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm font-medium text-slate-500">
          <span>
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} records)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={pagination.page === 1}
              className="inline-flex items-center justify-center p-2 border border-slate-200 rounded bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={pagination.page === pagination.totalPages}
              className="inline-flex items-center justify-center p-2 border border-slate-200 rounded bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default CandidateList;
