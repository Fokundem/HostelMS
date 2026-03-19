import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  Save,
  Lock,
} from 'lucide-react';
import type { Student } from '@/types';
import { useCreateStudent, useDeleteStudent, useStudents, useUpdateStudent } from '@/hooks/api';

export default function StudentManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { data: studentsData = [] } = useStudents();
  const { mutateAsync: createStudent } = useCreateStudent();
  const { mutateAsync: updateStudent } = useUpdateStudent();
  const { mutateAsync: deleteStudent } = useDeleteStudent();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    matricule: '',
    department: '',
    level: '',
    phone: '',
    guardianContact: '',
    role: 'student' as NonNullable<Student['role']>,
    status: 'active' as Student['status'],
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

  // Filter students
  const filteredStudents = (studentsData as Student[]).filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAdd = async () => {
    await createStudent({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      matricule: formData.matricule,
      department: formData.department,
      level: formData.level,
      phone: formData.phone || undefined,
      guardianContact: formData.guardianContact || undefined,
    });
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEdit = async () => {
    if (selectedStudent) {
      await updateStudent({
        studentId: selectedStudent.id,
        data: {
          name: formData.name,
          phone: formData.phone || undefined,
          guardianContact: formData.guardianContact || undefined,
          department: formData.department,
          level: formData.level,
          status: formData.status.toUpperCase(),
          role: formData.role.toUpperCase(),
        },
      });
      setIsEditModalOpen(false);
      setSelectedStudent(null);
    }
  };

  const handleDelete = async () => {
    if (selectedStudent) {
      await deleteStudent(selectedStudent.id);
      setIsDeleteModalOpen(false);
      setSelectedStudent(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      matricule: '',
      department: '',
      level: '',
      phone: '',
      guardianContact: '',
      role: 'student',
      status: 'active',
    });
  };

  const openEditModal = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      password: '',
      matricule: student.matricule,
      department: student.department,
      level: student.level,
      phone: student.phone,
      guardianContact: student.guardianContact || '',
      role: student.role || 'student',
      status: student.status,
    });
    setIsEditModalOpen(true);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="badge-success">Active</span>;
      case 'inactive':
        return <span className="badge-warning">Inactive</span>;
      case 'suspended':
        return <span className="badge-error">Suspended</span>;
      default:
        return <span className="badge-info">{status}</span>;
    }
  };

  const renderForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter full name"
            className="input-sharp pl-10"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter email"
            className="input-sharp pl-10"
          />
        </div>
      </div>
      {isAddModalOpen && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Temporary Password *</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Set initial password"
              className="input-sharp pl-10"
            />
          </div>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Matricule *</label>
        <input
          type="text"
          value={formData.matricule}
          onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
          placeholder="HT2024001"
          className="input-sharp"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Department *</label>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="input-sharp pl-10 appearance-none"
          >
            <option value="">Select Department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Business Administration">Business Admin</option>
            <option value="Engineering">Engineering</option>
            <option value="Medicine">Medicine</option>
            <option value="Law">Law</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Level *</label>
        <div className="relative">
          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            className="input-sharp pl-10 appearance-none"
          >
            <option value="">Select Level</option>
            <option value="100">100 Level</option>
            <option value="200">200 Level</option>
            <option value="300">300 Level</option>
            <option value="400">400 Level</option>
            <option value="500">500 Level</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+237 677 888 888"
            className="input-sharp pl-10"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Guardian Contact</label>
        <input
          type="tel"
          value={formData.guardianContact}
          onChange={(e) => setFormData({ ...formData, guardianContact: e.target.value })}
          placeholder="+237 677 999 999"
          className="input-sharp"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as Student['status'] })}
          className="input-sharp"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as NonNullable<Student['role']> })}
          className="input-sharp"
        >
          <option value="student">Student</option>
          <option value="employee">Employee</option>
          <option value="hostel_manager">Hostel Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-500">Manage student records and room assignments</p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, matricule, or department..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
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
                <th>Matricule</th>
                <th>Department</th>
                <th>Level</th>
                <th>Room</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1a56db] flex items-center justify-center">
                        <span className="text-white font-semibold">{student.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">{student.name}</p>
                        <p className="text-gray-500 text-sm">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-gray-600">{student.matricule}</td>
                  <td className="text-gray-600">{student.department}</td>
                  <td className="text-gray-600">{student.level} Level</td>
                  <td className="text-gray-600">{student.assignedRoom || '-'}</td>
                  <td>{getStatusBadge(student.status)}</td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setIsViewModalOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-[#1a56db] transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(student)}
                        className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
            {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} entries
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

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 shadow-sharp-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Student</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {renderForm()}
            </div>
            <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setIsAddModalOpen(false)} className="flex-1 btn-secondary">
                Cancel
              </button>
              <button onClick={handleAdd} className="flex-1 btn-primary flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                Save Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 shadow-sharp-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Student</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {renderForm()}
            </div>
            <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setIsEditModalOpen(false)} className="flex-1 btn-secondary">
                Cancel
              </button>
              <button onClick={handleEdit} className="flex-1 btn-primary flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                Update Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 shadow-sharp-lg max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Student Details</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#1a56db] flex items-center justify-center">
                  <span className="text-2xl text-white font-bold">{selectedStudent.name.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{selectedStudent.name}</h4>
                  {getStatusBadge(selectedStudent.status)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="text-gray-900">{selectedStudent.email}</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <p className="text-gray-500 text-sm">Matricule</p>
                  <p className="text-gray-900">{selectedStudent.matricule}</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <p className="text-gray-500 text-sm">Department</p>
                  <p className="text-gray-900">{selectedStudent.department}</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <p className="text-gray-500 text-sm">Level</p>
                  <p className="text-gray-900">{selectedStudent.level} Level</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <p className="text-gray-500 text-sm">Phone</p>
                  <p className="text-gray-900">{selectedStudent.phone}</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <p className="text-gray-500 text-sm">Room</p>
                  <p className="text-gray-900">{selectedStudent.assignedRoom || 'Not assigned'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 shadow-sharp-lg max-w-sm w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Student</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete <span className="text-gray-900 font-medium">{selectedStudent.name}</span>? 
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
