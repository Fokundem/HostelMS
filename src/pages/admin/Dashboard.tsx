import { useEffect, useRef, useState } from 'react';
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
  Users,
  Building2,
  CreditCard,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  BedDouble,
  AlertCircle,
} from 'lucide-react';
import { dashboardStats, monthlyRevenueData, roomOccupancyData, students, payments, complaints } from '@/data/mockData';
import { useDashboardStats } from '@/hooks/api';

export default function AdminDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeRange, setTimeRange] = useState('7d');
  const { data: stats, isLoading } = useDashboardStats();

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.dashboard-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#1a56db] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: Users,
      change: '+0%',
      trend: 'up',
      color: '#1a56db',
    },
    {
      title: 'Total Rooms',
      value: stats?.totalRooms || 0,
      icon: Building2,
      change: '+0%',
      trend: 'up',
      color: '#059669',
    },
    {
      title: 'Occupancy Rate',
      value: `${stats?.occupancyRate || 0}%`,
      icon: BedDouble,
      change: '+0%',
      trend: 'up',
      color: '#d97706',
    },
    {
      title: 'Monthly Revenue',
      value: `${(stats?.monthlyRevenue || 0).toLocaleString()} FCFA`,
      icon: CreditCard,
      change: '+0%',
      trend: 'up',
      color: '#7c3aed',
    },
  ];

  const recentStudents = stats?.recentStudents || [];
  const recentPayments = stats?.recentPayments || [];
  const pendingComplaints = stats?.pendingComplaints || [];

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#1a56db]"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="btn-primary text-sm">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="dashboard-card bg-white border border-gray-200 p-5 hover:shadow-sharp transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{ backgroundColor: `${card.color}15` }}
              >
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              {card.trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-600" />
              )}
              <span className={card.trend === 'up' ? 'text-emerald-600 text-sm font-medium' : 'text-red-600 text-sm font-medium'}>
                {card.change}
              </span>
              <span className="text-gray-400 text-sm">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="dashboard-card bg-white border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>+23.5%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.revenueData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${value / 1000}k`} tickLine={false} axisLine={false} />
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
        <div className="dashboard-card bg-white border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Room Occupancy</h3>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Building2 className="w-4 h-4" />
              <span>{stats?.occupiedRooms || 0}/{stats?.totalRooms || 0} Occupied</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats?.roomOccupancyData || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={0}
                dataKey="value"
              >
                {(stats?.roomOccupancyData || []).map((entry: any, index: number) => (
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
            {(stats?.roomOccupancyData || []).map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Students */}
        <div className="dashboard-card bg-white border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Students</h3>
            <button className="text-[#1a56db] text-sm hover:underline font-medium">View All</button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentStudents.map((student) => (
              <div key={student.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-[#1a56db] flex items-center justify-center">
                  <span className="text-white font-semibold">{student.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium truncate">{student.name}</p>
                  <p className="text-gray-500 text-sm">{student.matricule}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium ${student.status === 'active'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                    }`}
                >
                  {student.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="dashboard-card bg-white border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
            <button className="text-[#1a56db] text-sm hover:underline font-medium">View All</button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                <div
                  className={`w-10 h-10 flex items-center justify-center ${payment.status === 'paid' ? 'bg-emerald-100' : 'bg-amber-100'
                    }`}
                >
                  <CreditCard
                    className={`w-5 h-5 ${payment.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium truncate">{payment.studentName}</p>
                  <p className="text-gray-500 text-sm">{payment.month} {payment.year}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 font-medium">{payment.amount.toLocaleString()}</p>
                  <span
                    className={`text-xs ${payment.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                  >
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Complaints */}
        <div className="dashboard-card bg-white border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Pending Complaints</h3>
            <button className="text-[#1a56db] text-sm hover:underline font-medium">View All</button>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingComplaints.length > 0 ? (
              pendingComplaints.map((complaint) => (
                <div key={complaint.id} className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-red-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium truncate">{complaint.title}</p>
                    <p className="text-gray-500 text-sm">{complaint.studentName}</p>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium ${complaint.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : complaint.priority === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                        }`}
                    >
                      {complaint.priority}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No pending complaints</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
