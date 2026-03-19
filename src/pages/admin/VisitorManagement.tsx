import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  LogIn,
  Calendar,
} from 'lucide-react';
import type { Visitor } from '@/types';
import { useDecideVisitor, useVisitors } from '@/hooks/api';

export default function VisitorManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { data: visitorList = [] } = useVisitors();
  const { mutateAsync: decideVisitor, isPending: isDeciding } = useDecideVisitor();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tableRef.current) {
      gsap.fromTo(
        tableRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  // Filter visitors
  const filteredVisitors = visitorList.filter((visitor) => {
    const matchesSearch =
      visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || visitor.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);
  const paginatedVisitors = filteredVisitors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDecide = async (visitorId: string, status: 'APPROVED' | 'REJECTED') => {
    await decideVisitor({
      visitorId,
      status,
      rejectionReason: status === 'REJECTED' ? 'Rejected' : undefined,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="badge-warning">Pending</span>;
      case 'approved':
        return <span className="badge-success">Approved</span>;
      case 'rejected':
        return <span className="badge-error">Rejected</span>;
      default:
        return <span className="badge-info">{status}</span>;
    }
  };

  // Stats
  const currentlyIn = (visitorList as Visitor[]).filter((v) => v.status === 'pending').length;
  const totalToday = (visitorList as Visitor[]).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visitor Management</h1>
          <p className="text-gray-500">Approve or reject student visitor requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Pending Requests', value: currentlyIn, color: '#d97706', icon: LogIn },
          { label: 'Total Today', value: totalToday, color: '#1a56db', icon: Calendar },
        ].map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by visitor or student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-sharp pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-sharp"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button className="btn-secondary">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div ref={tableRef} className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-sharp">
            <thead>
              <tr>
                <th>Visitor</th>
                <th>Visiting</th>
                <th>Purpose</th>
                <th>Requested</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVisitors.map((visitor) => (
                <tr key={visitor.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1a56db] flex items-center justify-center">
                        <span className="text-white font-semibold">{visitor.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">{visitor.name}</p>
                        <p className="text-gray-500 text-sm">{visitor.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p className="text-gray-900">{visitor.studentName}</p>
                      <p className="text-gray-500 text-sm">Room {visitor.roomNumber}</p>
                    </div>
                  </td>
                  <td className="text-gray-600">{visitor.purpose}</td>
                  <td className="text-gray-600">
                    {visitor.requestedAt ? new Date(visitor.requestedAt).toLocaleString() : '—'}
                  </td>
                  <td>{getStatusBadge(visitor.status)}</td>
                  <td>
                    {visitor.status === 'pending' ? (
                      <div className="flex justify-end gap-2">
                        <button
                          disabled={isDeciding}
                          onClick={() => handleDecide(visitor.id, 'REJECTED')}
                          className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                        <button
                          disabled={isDeciding}
                          onClick={() => handleDecide(visitor.id, 'APPROVED')}
                          className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
                        >
                          Approve
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredVisitors.length)} of {filteredVisitors.length} entries
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:text-gray-900 disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-[#1a56db] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-500 hover:text-gray-900 disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Students create visitor requests; admin approves/rejects in the table above */}
    </div>
  );
}
