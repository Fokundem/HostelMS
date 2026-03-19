// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'hostel_manager' | 'student';
  avatar?: string;
  phone?: string;
  department?: string;
  level?: string;
  matricule?: string;
  guardianContact?: string;
  assignedRoom?: string;
  status?: string;
  createdAt: string;
}

// Room Types
export interface Room {
  id: string;
  roomNumber: string;
  capacity: number;
  occupied: number;
  status: 'available' | 'full' | 'maintenance';
  floor: string;
  block: string;
  amenities: string[];
  price: number;
}

// Student Types
export interface Student {
  id: string;
  userId: string;
  name: string;
  email: string;
  matricule: string;
  department: string;
  level: string;
  phone: string;
  guardianContact: string;
  assignedRoom?: string;
  roomId?: string;
  role?: 'admin' | 'hostel_manager' | 'student' | 'employee';
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  createdAt: string;
}

// Payment Types
export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  status: 'pending' | 'submitted' | 'approved' | 'paid' | 'rejected' | 'overdue';
  type: 'hostel_fee' | 'maintenance' | 'other';
  month: string;
  year: number;
  method?: string;
  proofImageUrl?: string;
  rejectionReason?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  paidAt?: string;
  createdAt: string;
}

// Complaint Types
export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber?: string;
  title: string;
  description: string;
  category: 'maintenance' | 'security' | 'cleanliness' | 'noise' | 'other';
  status: 'pending' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  resolvedAt?: string;
  adminResponse?: string;
}

// Visitor Types
export interface Visitor {
  id: string;
  name: string;
  phone: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  entryTime?: string;
  exitTime?: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

// Room Allocation Types
export interface RoomAllocation {
  id: string;
  studentId: string;
  studentName: string;
  roomId: string;
  roomNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalStudents: number;
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  totalPayments: number;
  pendingPayments: number;
  pendingComplaints: number;
  totalRevenue: number;
  monthlyRevenue: number;
  occupancyRate: number;
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

// Notification Context Types
export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}
