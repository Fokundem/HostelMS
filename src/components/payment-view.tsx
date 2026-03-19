import { useMyPayments, usePaymentSummary } from '@/hooks/api';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Payment {
  id: string;
  amount: number;
  type: string;
  month: number;
  year: number;
  status: string;
  paidAt?: string;
  createdAt: string;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function getStatusColor(status: string) {
  switch (status) {
    case 'PAID':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'OVERDUE':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

export function PaymentView() {
  const { data: payments = [], isLoading: paymentsLoading } = useMyPayments();
  const { data: summary } = usePaymentSummary();

  if (paymentsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Due */}
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Due</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                ₦{summary?.totalDue.toLocaleString() || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">{summary?.pendingCount || 0} pending</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500 opacity-50" />
          </div>
        </Card>

        {/* Total Overdue */}
        <Card className={`p-4 ${summary?.totalOverdue > 0 ? 'bg-red-50 border-red-200' : ''}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className={`text-2xl font-bold mt-1 ${summary?.totalOverdue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                ₦{summary?.totalOverdue.toLocaleString() || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">{summary?.overdueCount || 0} overdue</p>
            </div>
            {summary?.totalOverdue > 0 ? (
              <AlertCircle className="w-8 h-8 text-red-500 opacity-50" />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-green-500 opacity-50" />
            )}
          </div>
        </Card>

        {/* Total Paid */}
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                ₦{summary?.totalPaid.toLocaleString() || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">{summary?.paidCount || 0} payments completed</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Payments Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Payment History
          </h3>
        </div>

        {payments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No payments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Month</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment: Payment) => (
                  <TableRow key={payment.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {monthNames[payment.month - 1]} {payment.year}
                    </TableCell>
                    <TableCell className="font-semibold">₦{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {payment.type === 'HOSTEL_FEE' ? 'Hostel Fee' : payment.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs border ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Payment Instructions */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>📌 Note:</strong> Payments can be made through the hostel office or online portal.
          Ensure all payments are made before the deadline to avoid penalties.
        </p>
      </Card>
    </div>
  );
}

export default PaymentView;
