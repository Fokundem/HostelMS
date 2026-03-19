import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { toast } from 'sonner';
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  BedDouble,
  Filter,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import type { RoomAllocation } from '@/types';
import { useAllocations, useApproveAllocation, useRejectAllocation } from '@/hooks/api';

export default function RoomAllocation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAllocation, setSelectedAllocation] = useState<RoomAllocation | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const { data: allocationList = [], isLoading: allocationsLoading } = useAllocations(
    filterStatus === 'all' ? undefined : filterStatus,
    undefined
  );
  const { mutateAsync: approveAllocation } = useApproveAllocation();
  const { mutateAsync: rejectAllocation } = useRejectAllocation();
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

  // Filter allocations
  const filteredAllocations = allocationList.filter((allocation: any) => {
    const studentName = allocation.student?.name || '';
    const roomNumber = allocation.room?.roomNumber || '';
    const matchesSearch =
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || allocation.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAllocations.length / itemsPerPage);
  const paginatedAllocations = filteredAllocations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApprove = async () => {
    if (selectedAllocation) {
      try {
        await approveAllocation(selectedAllocation.id);
        toast.success('Room allocation approved successfully');
        setIsApproveModalOpen(false);
        setSelectedAllocation(null);
      } catch (error: any) {
        toast.error(error?.message || 'Failed to approve allocation');
      }
    }
  };

  const handleReject = async () => {
    if (selectedAllocation) {
      const reason = rejectReason.trim() || 'Rejected by admin';
      try {
        await rejectAllocation({ allocationId: selectedAllocation.id, reason });
        toast.success('Room allocation rejected');
        setIsRejectModalOpen(false);
        setSelectedAllocation(null);
        setRejectReason('');
      } catch (error: any) {
        toast.error(error?.message || 'Failed to reject allocation');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="badge-success flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Approved</span>;
      case 'pending':
        return <span className="badge-warning flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case 'rejected':
        return <span className="badge-error flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="badge-info">{status}</span>;
    }
  };

  // Stats
  const pendingCount = (allocationList as RoomAllocation[]).filter((a) => a.status === 'pending').length;
  const approvedCount = (allocationList as RoomAllocation[]).filter((a) => a.status === 'approved').length;
  const rejectedCount = (allocationList as RoomAllocation[]).filter((a) => a.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Room Allocation</h1>
          <p className="text-gray-500">Manage student room requests and assignments</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: pendingCount, color: '#d97706', icon: Clock },
          { label: 'Approved', value: approvedCount, color: '#059669', icon: CheckCircle },
          { label: 'Rejected', value: rejectedCount, color: '#dc2626', icon: XCircle },
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
            placeholder="Search by student name or room number..."
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
                <th>Student</th>
                <th>Room</th>
                <th>Requested</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allocationsLoading && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Loading allocations...
                  </td>
                </tr>
              )}
              {!allocationsLoading && paginatedAllocations.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No allocations found.
                  </td>
                </tr>
              )}
              {!allocationsLoading && paginatedAllocations.map((allocation: any) => (
                <tr key={allocation.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1a56db] flex items-center justify-center">
                        <span className="text-white font-semibold">{(allocation.student?.name || '').charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">{allocation.student?.name || ''}</p>
                        <p className="text-gray-500 text-sm">ID: {allocation.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-[#1a56db]" />
                      <span className="text-gray-900">Room {allocation.room?.roomNumber || ''}</span>
                    </div>
                  </td>
                  <td className="text-gray-600">
                    {new Date(allocation.requestedAt).toLocaleDateString()}
                  </td>
                  <td>{getStatusBadge(allocation.status)}</td>
                  <td>
                    {allocation.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedAllocation(allocation);
                            setIsApproveModalOpen(true);
                          }}
                          className="p-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAllocation(allocation);
                            setIsRejectModalOpen(true);
                          }}
                          className="p-2 bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {allocation.status === 'approved' && (
                      <div className="text-right text-sm text-gray-500">
                        <p>Approved on {new Date(allocation.approvedAt!).toLocaleDateString()}</p>
                        <p>by {allocation.approvedByName || allocation.approvedBy || 'Unknown'}</p>
                      </div>
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
            {Math.min(currentPage * itemsPerPage, filteredAllocations.length)} of {filteredAllocations.length} entries
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

      {/* Approve Modal */}
      {isApproveModalOpen && selectedAllocation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 shadow-sharp-lg max-w-sm w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Approve Allocation</h3>
              <p className="text-gray-500 mb-6">
                Approve room allocation for{' '}
                <span className="text-gray-900 font-medium">{selectedAllocation.studentName}</span> to{' '}
                <span className="text-gray-900 font-medium">Room {selectedAllocation.roomNumber}</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsApproveModalOpen(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  className="flex-1 btn-primary bg-emerald-600 hover:bg-emerald-700"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && selectedAllocation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 shadow-sharp-lg max-w-sm w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reject Allocation</h3>
              <p className="text-gray-500 mb-4">
                Reject room allocation request from{' '}
                <span className="text-gray-900 font-medium">{selectedAllocation.studentName}</span>?
              </p>
              <div className="mb-6 text-left">
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason (optional)</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Room no longer available"
                  className="w-full input-sharp min-h-[80px] resize-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsRejectModalOpen(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 btn-danger"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
