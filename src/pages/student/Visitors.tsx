import { useMemo, useState } from 'react';
import { Plus, Save, Users, Trash2 } from 'lucide-react';
import { useMyVisitorRequests, useRequestVisitor, useDeleteVisitor } from '@/hooks/api';
import { toast } from 'sonner';

export default function StudentVisitors() {
  const { data: requests = [] } = useMyVisitorRequests();
  const { mutateAsync: requestVisitor, isPending } = useRequestVisitor();
  const { mutateAsync: deleteVisitor, isPending: isDeleting } = useDeleteVisitor();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>('');
  const [form, setForm] = useState({ name: '', phone: '', purpose: '' });

  const canSubmit = useMemo(() => {
    return form.name.trim().length >= 2 && form.phone.trim().length >= 6 && form.purpose.trim().length >= 2;
  }, [form]);

  const submit = async () => {
    if (!canSubmit) return;
    try {
      setError('');
      await requestVisitor({
        name: form.name.trim(),
        phone: form.phone.trim(),
        purpose: form.purpose.trim(),
      });
      toast.success('Visitor request submitted!');
      setForm({ name: '', phone: '', purpose: '' });
      setOpen(false);
    } catch (e: any) {
      const msg = e?.message || 'Failed to submit visitor request';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visitors</h1>
          <p className="text-gray-500">Request approval for a visitor and track status.</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" />
          Request Visitor
        </button>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-sharp">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Purpose</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {(requests as any[]).map((r) => (
                <tr key={r.id}>
                  <td className="text-gray-900 font-medium">{r.name}</td>
                  <td className="text-gray-600">{r.phone}</td>
                  <td className="text-gray-600">{r.purpose}</td>
                  <td className="text-gray-600">{r.status}</td>
                  <td className="text-right">
                    <button
                      disabled={isDeleting}
                      onClick={async () => {
                        try {
                          await deleteVisitor(r.id);
                          toast.success('Visitor request removed');
                        } catch (e: any) {
                          toast.error(e.message || 'Failed to delete visitor');
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {(requests as any[]).length === 0 && (
                <tr>
                  <td colSpan={5} className="text-gray-500 p-6">
                    No visitor requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 shadow-sharp-lg max-w-lg w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#1a56db]" />
                Visitor Request
              </h3>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Visitor name *</label>
                <input
                  className="input-sharp"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
                <input
                  className="input-sharp"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="e.g. +237..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Purpose *</label>
                <input
                  className="input-sharp"
                  value={form.purpose}
                  onChange={(e) => setForm((p) => ({ ...p, purpose: e.target.value }))}
                  placeholder="e.g. Family visit"
                />
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <button className="flex-1 btn-secondary" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button
                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={!canSubmit || isPending}
                onClick={submit}
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

