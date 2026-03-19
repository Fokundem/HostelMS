import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  Home,
  CreditCard,
  MessageSquare,
  Bell,
  CheckCircle,
  Clock,
  BedDouble,
  Calendar,
  Plus,
} from 'lucide-react';
import { useMyAllocation, useMyComplaints, useMyPayments } from '@/hooks/api';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Tabbed UI can be reintroduced when student sub-pages exist.
  const { user } = useAuth();
  const { data: myAllocation } = useMyAllocation();
  const { data: myPayments = [] } = useMyPayments();
  const { data: myComplaints = [] } = useMyComplaints();

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.dashboard-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, []);

  const studentRoom = user?.assignedRoom || myAllocation?.room?.roomNumber || '-';
  const studentPayments = myPayments as any[];
  const studentComplaints = myComplaints as any[];
  const pendingPayment = studentPayments.find((p) => p.status === 'pending');
  const paidCount = studentPayments.filter((p) => p.status === 'paid').length;

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's your hostel overview.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'My Room', value: studentRoom, icon: BedDouble, color: '#1a56db' },
          { label: 'Payments Made', value: paidCount, icon: CheckCircle, color: '#059669' },
          { label: 'Complaints', value: studentComplaints.length, icon: MessageSquare, color: '#d97706' },
          { label: 'Notifications', value: '-', icon: Bell, color: '#7c3aed' },
        ].map((stat, index) => (
          <div
            key={index}
            className="dashboard-card bg-white border border-gray-200 p-5 hover:shadow-sharp transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <span className="text-gray-500 text-sm">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Room Info */}
        <div className="dashboard-card lg:col-span-2 bg-white border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">My Room</h3>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium">
              Active
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#1a56db] flex items-center justify-center">
                <Home className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{studentRoom}</p>
                <p className="text-gray-500">
                  {myAllocation?.room ? `Block ${myAllocation.room.block}, Floor ${myAllocation.room.floor}` : 'Not allocated yet'}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 border border-gray-200">
                <span className="text-gray-500">Room Type</span>
                <span className="text-gray-900 font-medium">
                  {myAllocation?.room ? `${myAllocation.room.capacity}-Bed Shared` : '-'}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 border border-gray-200">
                <span className="text-gray-500">Monthly Fee</span>
                <span className="text-[#1a56db] font-medium">
                  {myAllocation?.room ? `${myAllocation.room.price.toLocaleString()} FCFA` : '-'}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm mb-3">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {(myAllocation?.room?.amenities || []).map((amenity: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-[#1a56db] text-sm font-medium"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="dashboard-card bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Status</h3>
          {pendingPayment ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <p className="text-gray-900 font-medium mb-1">Payment Pending</p>
              <p className="text-2xl font-bold text-[#1a56db] mb-2">
                {pendingPayment.amount.toLocaleString()} FCFA
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Due by {pendingPayment.month} {pendingPayment.year}
              </p>
              <button className="w-full btn-primary">
                Pay Now
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-gray-900 font-medium mb-1">All Payments Up to Date</p>
              <p className="text-gray-500 text-sm">No pending payments</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="dashboard-card bg-white border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
            <button className="text-[#1a56db] text-sm hover:underline font-medium">View All</button>
          </div>
          <div className="divide-y divide-gray-100">
            {studentPayments.slice(0, 3).map((payment) => (
              <div key={payment.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                <div
                  className={`w-10 h-10 flex items-center justify-center ${
                    payment.status === 'paid' ? 'bg-emerald-100' : 'bg-amber-100'
                  }`}
                >
                  <CreditCard
                    className={`w-5 h-5 ${
                      payment.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{payment.month} {payment.year}</p>
                  <p className="text-gray-500 text-sm capitalize">{payment.type.replace('_', ' ')}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 font-medium">{payment.amount.toLocaleString()}</p>
                  <span
                    className={`text-xs ${
                      payment.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="dashboard-card bg-white border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">My Complaints</h3>
            <button className="text-[#1a56db] text-sm hover:underline font-medium flex items-center gap-1">
              <Plus className="w-4 h-4" />
              New
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {studentComplaints.length > 0 ? (
              studentComplaints.slice(0, 3).map((complaint) => (
                <div key={complaint.id} className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors">
                  <div
                    className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${
                      complaint.status === 'resolved'
                        ? 'bg-emerald-100'
                        : complaint.status === 'in_progress'
                        ? 'bg-blue-100'
                        : 'bg-amber-100'
                    }`}
                  >
                    <MessageSquare
                      className={`w-5 h-5 ${
                        complaint.status === 'resolved'
                          ? 'text-emerald-600'
                          : complaint.status === 'in_progress'
                          ? 'text-blue-600'
                          : 'text-amber-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{complaint.title}</p>
                    <p className="text-gray-500 text-sm">{complaint.category}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium ${
                      complaint.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : complaint.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {complaint.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No complaints submitted</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-card bg-gradient-to-r from-blue-50 to-white border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 bg-white border border-gray-200 hover:shadow-sharp transition-shadow text-left">
            <div className="w-10 h-10 bg-[#1a56db] flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-900 font-medium">Make Payment</p>
              <p className="text-gray-500 text-sm">Pay hostel fees</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 bg-white border border-gray-200 hover:shadow-sharp transition-shadow text-left">
            <div className="w-10 h-10 bg-[#1a56db] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-900 font-medium">Submit Complaint</p>
              <p className="text-gray-500 text-sm">Report an issue</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 bg-white border border-gray-200 hover:shadow-sharp transition-shadow text-left">
            <div className="w-10 h-10 bg-[#1a56db] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-900 font-medium">View Schedule</p>
              <p className="text-gray-500 text-sm">Check events</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
