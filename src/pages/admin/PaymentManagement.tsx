import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Receipt,
  FileText,
  TrendingUp,
} from 'lucide-react';
import type { Payment } from '@/types';
import { useAllPayments, useDashboardStats, useReviewPayment } from '@/hooks/api';

export default function PaymentManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const { data: paymentList = [] } = useAllPayments(filterStatus === 'all' ? undefined : filterStatus.toUpperCase());
  const { data: stats } = useDashboardStats();
  const { mutateAsync: reviewPayment, isPending: isReviewing } = useReviewPayment();
  const [reviewError, setReviewError] = useState<string>('');
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

  // Filter payments
  const filteredPayments = paymentList.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
      case 'approved':
        return <span className="badge-success flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Approved</span>;
      case 'submitted':
        return <span className="badge-info flex items-center gap-1"><FileText className="w-3 h-3" /> Submitted</span>;
      case 'pending':
        return <span className="badge-warning flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case 'rejected':
        return <span className="badge-error flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Rejected</span>;
      case 'overdue':
        return <span className="badge-error flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Overdue</span>;
      default:
        return <span className="badge-info">{status}</span>;
    }
  };

  // Stats
  const totalPaid = (paymentList as Payment[]).filter((p) => ['paid', 'approved'].includes(p.status)).reduce((sum, p) => sum + p.amount, 0);
  const totalPending = (paymentList as Payment[]).filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = (paymentList as Payment[]).filter((p) => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-500">Track and manage hostel fee payments</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Receipt className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue (this month)', value: `${((stats?.monthlyRevenue || 0) / 1000000).toFixed(1)}M FCFA`, icon: TrendingUp, color: '#1a56db' },
          { label: 'Collected', value: `${(totalPaid / 1000).toFixed(0)}K FCFA`, icon: CheckCircle, color: '#059669' },
          { label: 'Pending', value: `${(totalPending / 1000).toFixed(0)}K FCFA`, icon: Clock, color: '#d97706' },
          { label: 'Overdue', value: `${(totalOverdue / 1000).toFixed(0)}K FCFA`, icon: AlertCircle, color: '#dc2626' },
        ].map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-lg font-bold" style={{ color: stat.color }}>
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
            placeholder="Search by student name or ID..."
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
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="overdue">Overdue</option>
          </select>
          <button className="btn-secondary">
            <Filter className="w-5 h-5" />
          </button>
          <button className="btn-secondary">
            <Download className="w-5 h-5" />
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
                <th>Type</th>
                <th>Period</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1a56db] flex items-center justify-center">
                        <span className="text-white font-semibold">{payment.studentName.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">{payment.studentName}</p>
                        <p className="text-gray-500 text-sm">ID: {payment.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-gray-600 capitalize">{payment.type.replace('_', ' ')}</td>
                  <td className="text-gray-600">
                    {payment.month} {payment.year}
                  </td>
                  <td>
                    <p className="text-gray-900 font-medium">{payment.amount.toLocaleString()} FCFA</p>
                  </td>
                  <td>{getStatusBadge(payment.status)}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedPayment(payment);
                        setIsReceiptModalOpen(true);
                      }}
                      className="p-2 text-gray-400 hover:text-[#1a56db] transition-colors"
                      title="View Receipt"
                    >
                      <FileText className="w-4 h-4" />
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
            {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length} entries
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

      {/* Receipt Modal */}
      {isReceiptModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 shadow-sharp-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-8 h-8 text-[#1a56db]" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Hostel Management System</h4>
                <p className="text-gray-500">Payment Receipt</p>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {reviewError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                  {reviewError}
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Receipt No:</span>
                <span className="text-gray-900 font-medium">RCP-{selectedPayment.id.padStart(6, '0')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Student:</span>
                <span className="text-gray-900">{selectedPayment.studentName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Payment Type:</span>
                <span className="text-gray-900 capitalize">{selectedPayment.type.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Period:</span>
                <span className="text-gray-900">{selectedPayment.month} {selectedPayment.year}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Date:</span>
                <span className="text-gray-900">
                  {selectedPayment.paidAt
                    ? new Date(selectedPayment.paidAt).toLocaleDateString()
                    : 'Not paid'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Method:</span>
                <span className="text-gray-900 capitalize">{((selectedPayment as any).method || '—').replace('_', ' ')}</span>
              </div>
              <div className="py-2 border-b border-gray-100">
                <p className="text-gray-500 mb-2">Proof:</p>
                {(selectedPayment as any).proofImageUrl ? (
                  <a
                    className="text-[#1a56db] hover:underline"
                    href={`http://localhost:8000${(selectedPayment as any).proofImageUrl}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open proof
                  </a>
                ) : (
                  <p className="text-gray-400">No proof uploaded</p>
                )}
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Amount:</span>
                  <span className="text-2xl font-bold text-[#1a56db]">
                    {selectedPayment.amount.toLocaleString()} FCFA
                  </span>
                </div>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Status:</span>
                {getStatusBadge(selectedPayment.status)}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2">
              {selectedPayment.status === 'submitted' && (
                <>
                  <button
                    className="flex-1 btn-secondary"
                    disabled={isReviewing}
                    onClick={async () => {
                      try {
                        setReviewError('');
                        await reviewPayment({
                          paymentId: selectedPayment.id,
                          status: 'REJECTED',
                          rejectionReason: 'Rejected',
                        });
                        setIsReceiptModalOpen(false);
                      } catch (e: any) {
                        setReviewError(e?.message || 'Failed to reject payment');
                      }
                    }}
                  >
                    Reject
                  </button>
                  <button
                    className="flex-1 btn-primary"
                    disabled={isReviewing}
                    onClick={async () => {
                      try {
                        setReviewError('');
                        await reviewPayment({ paymentId: selectedPayment.id, status: 'APPROVED' });
                        setIsReceiptModalOpen(false);
                      } catch (e: any) {
                        setReviewError(e?.message || 'Failed to approve payment');
                      }
                    }}
                  >
                    Approve
                  </button>
                </>
              )}
              <button className="flex-1 btn-primary" onClick={() => setIsReceiptModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
