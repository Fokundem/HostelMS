import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Phone,
  Home,
  LogIn,
  Calendar,
  Save,
} from 'lucide-react';
import { visitors } from '@/data/mockData';
import type { Visitor } from '@/types';

export default function VisitorManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [visitorList, setVisitorList] = useState<Visitor[]>(visitors);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    studentId: '',
    purpose: '',
  });

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

  const handleCheckOut = (visitorId: string) => {
    setVisitorList(
      visitorList.map((v) =>
        v.id === visitorId
          ? { ...v, status: 'out', exitTime: new Date().toISOString() }
          : v
      )
    );
  };

  const handleAdd = () => {
    const newVisitor: Visitor = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      phone: formData.phone,
      studentId: formData.studentId,
      studentName: 'John Doe', // Would be fetched from student list
      roomNumber: 'A12',
      purpose: formData.purpose,
      entryTime: new Date().toISOString(),
      status: 'in',
    };
    setVisitorList([...visitorList, newVisitor]);
    setIsAddModalOpen(false);
    setFormData({ name: '', phone: '', studentId: '', purpose: '' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in':
        return <span className="badge-success">Currently In</span>;
      case 'out':
        return <span className="badge-info">Checked Out</span>;
      default:
        return <span className="badge-info">{status}</span>;
    }
  };

  // Stats
  const currentlyIn = visitorList.filter((v) => v.status === 'in').length;
  const totalToday = visitorList.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visitor Management</h1>
          <p className="text-gray-500">Track and manage hostel visitors</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Register Visitor
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Currently In', value: currentlyIn, color: '#059669', icon: LogIn },
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
            <option value="in">Currently In</option>
            <option value="out">Checked Out</option>
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
                <th>Entry Time</th>
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
                    {new Date(visitor.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>{getStatusBadge(visitor.status)}</td>
                  <td>
                    {visitor.status === 'in' && (
                      <button
                        onClick={() => handleCheckOut(visitor.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200 transition-colors"
                      >
                        Check Out
                      </button>
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

      {/* Add Visitor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 shadow-sharp-lg max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Register Visitor</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Visitor Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter visitor name"
                    className="input-sharp pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                    className="input-sharp pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Student to Visit *</label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="input-sharp pl-10"
                  >
                    <option value="">Select student</option>
                    <option value="1">John Doe (A12)</option>
                    <option value="2">Mary Johnson (B04)</option>
                    <option value="3">Peter Smith (A15)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Purpose *</label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Enter purpose of visit"
                  className="input-sharp"
                />
              </div>
            </form>
            <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setIsAddModalOpen(false)} className="flex-1 btn-secondary">
                Cancel
              </button>
              <button onClick={handleAdd} className="flex-1 btn-primary flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                Register Visitor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
