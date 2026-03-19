import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  Wrench,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  X,
  Shield,
  Volume2,
  Sparkles,
} from 'lucide-react';
import type { Complaint } from '@/types';
import { useComplaints, useUpdateComplaint } from '@/hooks/api';

export default function ComplaintsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const { data: complaintList = [] } = useComplaints();
  const { mutateAsync: updateComplaint } = useUpdateComplaint();
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

  // Filter complaints
  const filteredComplaints = complaintList.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || complaint.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusUpdate = async (newStatus: Complaint['status']) => {
    if (selectedComplaint) {
      await updateComplaint({
        complaintId: selectedComplaint.id,
        data: {
          status: newStatus.toUpperCase(),
          adminResponse: responseText || undefined,
        },
      });
      setResponseText('');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <span className="badge-success">Resolved</span>;
      case 'in_progress':
        return <span className="badge-info">In Progress</span>;
      case 'pending':
        return <span className="badge-warning">Pending</span>;
      default:
        return <span className="badge-info">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="badge-error">High</span>;
      case 'medium':
        return <span className="badge-warning">Medium</span>;
      case 'low':
        return <span className="badge-info">Low</span>;
      default:
        return <span className="badge-info">{priority}</span>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'maintenance':
        return <Wrench className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'cleanliness':
        return <Sparkles className="w-4 h-4" />;
      case 'noise':
        return <Volume2 className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  // Stats
  const pendingCount = (complaintList as Complaint[]).filter((c) => c.status === 'pending').length;
  const inProgressCount = (complaintList as Complaint[]).filter((c) => c.status === 'in_progress').length;
  const resolvedCount = (complaintList as Complaint[]).filter((c) => c.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints & Maintenance</h1>
          <p className="text-gray-500">Manage student complaints and maintenance requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: pendingCount, color: '#d97706', icon: Clock },
          { label: 'In Progress', value: inProgressCount, color: '#1a56db', icon: Wrench },
          { label: 'Resolved', value: resolvedCount, color: '#059669', icon: CheckCircle },
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
            placeholder="Search by title or student name..."
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
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="input-sharp"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
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
                <th>Complaint</th>
                <th>Student</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedComplaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td>
                    <div>
                      <p className="text-gray-900 font-medium">{complaint.title}</p>
                      <p className="text-gray-500 text-sm truncate max-w-xs">{complaint.description}</p>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#1a56db] flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">{complaint.studentName.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-gray-900 text-sm">{complaint.studentName}</p>
                        {complaint.roomNumber && (
                          <p className="text-gray-500 text-xs">Room {complaint.roomNumber}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="flex items-center gap-2 text-gray-600 capitalize">
                      {getCategoryIcon(complaint.category)}
                      {complaint.category}
                    </span>
                  </td>
                  <td>{getPriorityBadge(complaint.priority)}</td>
                  <td>{getStatusBadge(complaint.status)}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setIsDetailModalOpen(true);
                      }}
                      className="text-[#1a56db] text-sm hover:underline font-medium"
                    >
                      View Details
                    </button>
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
            {Math.min(currentPage * itemsPerPage, filteredComplaints.length)} of {filteredComplaints.length} entries
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

      {/* Detail Modal */}
      {isDetailModalOpen && selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 shadow-sharp-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Complaint Details</h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Header Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 flex items-center justify-center">
                  {getCategoryIcon(selectedComplaint.category)}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">{selectedComplaint.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(selectedComplaint.status)}
                    {getPriorityBadge(selectedComplaint.priority)}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-gray-50 border border-gray-200">
                <p className="text-gray-500 text-sm mb-2">Description</p>
                <p className="text-gray-900">{selectedComplaint.description}</p>
              </div>

              {/* Student Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <p className="text-gray-500 text-sm">Submitted by</p>
                  <p className="text-gray-900">{selectedComplaint.studentName}</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <p className="text-gray-500 text-sm">Room</p>
                  <p className="text-gray-900">{selectedComplaint.roomNumber || 'N/A'}</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <p className="text-gray-500 text-sm">Submitted on</p>
                  <p className="text-gray-900">{new Date(selectedComplaint.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <p className="text-gray-500 text-sm">Category</p>
                  <p className="text-gray-900 capitalize">{selectedComplaint.category}</p>
                </div>
              </div>

              {/* Admin Response */}
              {selectedComplaint.adminResponse && (
                <div className="p-4 bg-blue-50 border border-blue-200">
                  <p className="text-[#1a56db] text-sm mb-2 font-medium">Admin Response</p>
                  <p className="text-gray-900">{selectedComplaint.adminResponse}</p>
                </div>
              )}

              {/* Response Input */}
              {selectedComplaint.status !== 'resolved' && (
                <div>
                  <p className="text-gray-500 text-sm mb-2">Add Response</p>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Type your response..."
                    className="input-sharp resize-none"
                    rows={3}
                  />
                </div>
              )}

              {/* Actions */}
              {selectedComplaint.status !== 'resolved' && (
                <div className="flex gap-3">
                  {selectedComplaint.status === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate('in_progress')}
                      className="flex-1 btn-primary"
                    >
                      Mark In Progress
                    </button>
                  )}
                  <button
                    onClick={() => handleStatusUpdate('resolved')}
                    className="flex-1 btn-primary bg-emerald-600 hover:bg-emerald-700"
                  >
                    Mark Resolved
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
