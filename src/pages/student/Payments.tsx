import { useMemo, useState } from 'react';
import { CreditCard, Plus, Save, AlertCircle } from 'lucide-react';
import { useMyPayments, usePaymentSummary, useSubmitPayment, useMyAllocation } from '@/hooks/api';

export default function StudentPayments() {
  const { data: payments = [] } = useMyPayments();
  const { data: summary } = usePaymentSummary();
  const { data: allocation } = useMyAllocation();
  const { mutateAsync: submitPayment, isPending } = useSubmitPayment();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>('');
  const [form, setForm] = useState({
    amount: '',
    type: 'HOSTEL_FEE',
    month: String(new Date().getMonth() + 1),
    year: String(new Date().getFullYear()),
    method: 'BANK_TRANSFER',
    proof: null as File | null,
  });

  const canSubmit = useMemo(() => {
    const amount = Number(form.amount);
    return amount > 0 && form.proof && form.month && form.year;
  }, [form.amount, form.proof, form.month, form.year]);

  const onSubmit = async () => {
    if (!canSubmit) return;
    try {
      setError('');
      const fd = new FormData();
      fd.append('amount', String(Number(form.amount)));
      fd.append('type', form.type);
      fd.append('month', String(Number(form.month)));
      fd.append('year', String(Number(form.year)));
      fd.append('method', form.method);
      if (form.proof) fd.append('proof', form.proof);
      await submitPayment(fd);
      setOpen(false);
      setForm({
        amount: '',
        type: 'HOSTEL_FEE',
        month: String(new Date().getMonth() + 1),
        year: String(new Date().getFullYear()),
        method: 'BANK_TRANSFER',
        proof: null,
      });
    } catch (e: any) {
      setError(e?.message || 'Failed to submit payment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500">Submit payment proof and track admin approval.</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" />
          Submit Payment
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 p-4">
          <p className="text-gray-500 text-sm">Total Due</p>
          <p className="text-xl font-bold text-gray-900">{(summary?.totalDue || 0).toLocaleString()} FCFA</p>
        </div>
        <div className="bg-white border border-gray-200 p-4">
          <p className="text-gray-500 text-sm">Total Paid</p>
          <p className="text-xl font-bold text-gray-900">{(summary?.totalPaid || 0).toLocaleString()} FCFA</p>
        </div>
        <div className="bg-white border border-gray-200 p-4">
          <p className="text-gray-500 text-sm">Total Overdue</p>
          <p className="text-xl font-bold text-gray-900">{(summary?.totalOverdue || 0).toLocaleString()} FCFA</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-sharp">
            <thead>
              <tr>
                <th>Period</th>
                <th>Type</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Proof</th>
              </tr>
            </thead>
            <tbody>
              {(payments as any[]).map((p) => (
                <tr key={p.id}>
                  <td className="text-gray-900 font-medium">
                    {p.month} {p.year}
                  </td>
                  <td className="text-gray-600 capitalize">
                    {(p.type || '').replace('_', ' ')}
                  </td>
                  <td className="text-gray-600 capitalize">{(p.method || '').replace('_', ' ')}</td>
                  <td className="text-gray-900">{Number(p.amount).toLocaleString()} FCFA</td>
                  <td className="text-gray-600">{p.status}</td>
                  <td className="text-gray-600">
                    {p.proofImageUrl ? (
                      <a
                        className="text-[#1a56db] hover:underline"
                        href={`http://localhost:8000${p.proofImageUrl}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {(payments as any[]).length === 0 && (
                <tr>
                  <td colSpan={6} className="text-gray-500 p-6">
                    No payments yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-200 p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1a56db] flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-gray-900 font-medium">Online payments</p>
            <p className="text-gray-500 text-sm">If you want card/mobile-money payments, we can integrate a gateway next.</p>
          </div>
        </div>
      </div>

      {(!allocation || allocation.status !== 'APPROVED') && (
        <div className="bg-red-50 border border-red-200 p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-red-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-red-800 font-semibold mb-1">Room Allocation Not Approved</p>
            <p className="text-red-600 text-sm">
              You must have an approved room allocation before you can submit payments. 
              Please request a room or wait for admin approval.
            </p>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 shadow-sharp-lg max-w-lg w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Submit Payment Proof</h3>
              <button onClick={() => setOpen(false)} className="btn-secondary">
                Close
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (FCFA) *</label>
                  <input
                    className="input-sharp"
                    value={form.amount}
                    onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                    placeholder="e.g. 50000"
                    inputMode="numeric"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
                  <select
                    className="input-sharp"
                    value={form.type}
                    onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                  >
                    <option value="HOSTEL_FEE">Hostel fee</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Month *</label>
                  <select
                    className="input-sharp"
                    value={form.month}
                    onChange={(e) => setForm((p) => ({ ...p, month: e.target.value }))}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={String(m)}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Year *</label>
                  <input
                    className="input-sharp"
                    value={form.year}
                    onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
                    placeholder="e.g. 2026"
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment method</label>
                <select
                  className="input-sharp"
                  value={form.method}
                  onChange={(e) => setForm((p) => ({ ...p, method: e.target.value }))}
                >
                  <option value="BANK_TRANSFER">Bank transfer</option>
                  <option value="MOBILE_MONEY">Mobile money</option>
                  <option value="POS">POS</option>
                  <option value="CASH">Cash</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Proof screenshot *</label>
                <input
                  className="input-sharp"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setForm((p) => ({ ...p, proof: e.target.files?.[0] || null }))}
                />
                <p className="text-xs text-gray-500 mt-1">Upload a screenshot or PDF receipt.</p>
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <button className="flex-1 btn-secondary" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button
                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canSubmit || isPending || !allocation || allocation.status !== 'APPROVED'}
                onClick={onSubmit}
                title={!allocation || allocation.status !== 'APPROVED' ? 'Room allocation must be approved' : !canSubmit ? 'Provide amount, month/year, and proof file.' : undefined}
              >
                <Save className="w-4 h-4" />
                {isPending ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

