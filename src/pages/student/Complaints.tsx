import { useMemo, useState } from 'react';
import { MessageSquare, Plus, Save } from 'lucide-react';
import { useCreateComplaint, useMyComplaints } from '@/hooks/api';
import { toast } from 'sonner';

export default function StudentComplaints() {
  const { data: complaints = [] } = useMyComplaints();
  const { mutateAsync: createComplaint, isPending } = useCreateComplaint();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'OTHER',
    priority: 'MEDIUM',
  });

  const canSubmit = useMemo(() => {
    // Must match backend validation (hostel-ms-svr/schemas/complaints.py)
    return form.title.trim().length >= 3 && form.description.trim().length >= 5;
  }, [form]);

  const submit = async () => {
    if (!canSubmit) return;
    try {
      setError('');
      await createComplaint({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        priority: form.priority,
      });
      toast.success('Complaint submitted successfully!');
      setForm({ title: '', description: '', category: 'OTHER', priority: 'MEDIUM' });
      setOpen(false);
    } catch (e: any) {
      const msg = e?.message || 'Failed to submit complaint';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
          <p className="text-gray-500">Submit and track issues in your hostel.</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" />
          New Complaint
        </button>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-sharp">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(complaints as any[]).map((c) => (
                <tr key={c.id}>
                  <td className="text-gray-900 font-medium">{c.title}</td>
                  <td className="text-gray-600 capitalize">{(c.category || '').toLowerCase()}</td>
                  <td className="text-gray-600 capitalize">{(c.priority || '').toLowerCase()}</td>
                  <td className="text-gray-600">{c.status}</td>
                </tr>
              ))}
              {(complaints as any[]).length === 0 && (
                <tr>
                  <td colSpan={4} className="text-gray-500 p-6">
                    No complaints yet.
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
                <MessageSquare className="w-5 h-5 text-[#1a56db]" />
                New Complaint
              </h3>
              <button onClick={() => setOpen(false)} className="btn-secondary">Close</button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                <input
                  className="input-sharp"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Water leakage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                <textarea
                  className="input-sharp resize-none"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Describe the issue clearly..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select
                    className="input-sharp"
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  >
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="SECURITY">Security</option>
                    <option value="CLEANLINESS">Cleanliness</option>
                    <option value="NOISE">Noise</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                  <select
                    className="input-sharp"
                    value={form.priority}
                    onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <button className="flex-1 btn-secondary" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <div className="flex-1">
                <button
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                  disabled={!canSubmit || isPending}
                  onClick={submit}
                  title={!canSubmit ? 'Title must be at least 3 characters and description at least 5.' : undefined}
                >
                  <Save className="w-4 h-4" />
                  {isPending ? 'Submitting…' : 'Submit'}
                </button>
                {!canSubmit && (
                  <p className="mt-2 text-xs text-gray-500">
                    Title must be at least 3 characters and description at least 5.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

