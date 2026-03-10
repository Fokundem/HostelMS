import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Download,
  Users,
  Building2,
  CreditCard,
  MessageSquare,
  TrendingUp,
  Printer,
  Share2,
} from 'lucide-react';
import { dashboardStats, monthlyRevenueData, roomOccupancyData, departmentData } from '@/data/mockData';

const reportTypes = [
  { id: 'occupancy', name: 'Occupancy Report', icon: Building2, description: 'Room occupancy statistics' },
  { id: 'payment', name: 'Payment Report', icon: CreditCard, description: 'Revenue and payment analysis' },
  { id: 'student', name: 'Student Report', icon: Users, description: 'Student demographics and data' },
  { id: 'complaint', name: 'Complaint Report', icon: MessageSquare, description: 'Complaint resolution metrics' },
];

export default function Reports() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.report-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500">Generate and download comprehensive reports</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: dashboardStats.totalStudents, icon: Users, color: '#1a56db' },
          { label: 'Total Rooms', value: dashboardStats.totalRooms, icon: Building2, color: '#059669' },
          { label: 'Total Revenue', value: `${(dashboardStats.totalRevenue / 1000000).toFixed(1)}M`, icon: CreditCard, color: '#7c3aed' },
          { label: 'Occupancy Rate', value: `${dashboardStats.occupancyRate}%`, icon: TrendingUp, color: '#d97706' },
        ].map((stat, index) => (
          <div key={index} className="report-card bg-white border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <span className="text-gray-500 text-sm">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="report-card bg-white border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
            <button className="text-[#1a56db] text-sm hover:underline font-medium flex items-center gap-1">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${value / 1000000}M`} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value: number) => [`${value.toLocaleString()} FCFA`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#1a56db" radius={0} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Room Occupancy Chart */}
        <div className="report-card bg-white border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Room Occupancy</h3>
            <button className="text-[#1a56db] text-sm hover:underline font-medium flex items-center gap-1">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={roomOccupancyData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={0}
                dataKey="value"
              >
                {roomOccupancyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            {roomOccupancyData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Distribution */}
      <div className="report-card bg-white border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Student Distribution by Department</h3>
          <button className="text-[#1a56db] text-sm hover:underline font-medium flex items-center gap-1">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={departmentData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} width={120} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Bar dataKey="students" fill="#60a5fa" radius={0} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Report Types */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Reports</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {reportTypes.map((report) => (
            <div
              key={report.id}
              className="report-card bg-white border border-gray-200 p-5 hover:shadow-sharp transition-shadow hover:border-gray-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 flex items-center justify-center">
                    <report.icon className="w-6 h-6 text-[#1a56db]" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-semibold">{report.name}</h4>
                    <p className="text-gray-500 text-sm">{report.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-[#1a56db] transition-colors" title="Print">
                    <Printer className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-[#1a56db] transition-colors" title="Download">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-[#1a56db] transition-colors" title="Share">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="report-card bg-gradient-to-r from-blue-50 to-white border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-500 text-sm mb-1">Available Rooms</p>
            <p className="text-2xl font-bold text-emerald-600">{dashboardStats.availableRooms}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Occupied Rooms</p>
            <p className="text-2xl font-bold text-[#1a56db]">{dashboardStats.occupiedRooms}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Pending Payments</p>
            <p className="text-2xl font-bold text-amber-600">{dashboardStats.pendingPayments}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Pending Complaints</p>
            <p className="text-2xl font-bold text-red-600">{dashboardStats.pendingComplaints}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
