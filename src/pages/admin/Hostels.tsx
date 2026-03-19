import { useMemo, useState } from 'react';
import { Building2, Plus, Save } from 'lucide-react';
import { useCreateHostel, useHostels } from '@/hooks/api';

export default function Hostels() {
  const { data: hostels = [] } = useHostels();
  const { mutateAsync: createHostel } = useCreateHostel();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', totalRooms: 0 });

  const canSubmit = useMemo(() => {
    return form.name.trim().length >= 2 && form.code.trim().length >= 2;
  }, [form]);

  const onSubmit = async () => {
    if (!canSubmit) return;
    await createHostel({
      name: form.name.trim(),
      code: form.code.trim(),
      totalRooms: Number(form.totalRooms) || 0,
    });
    setForm({ name: '', code: '', totalRooms: 0 });
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hostels</h1>
          <p className="text-gray-500">Create at least one hostel before adding rooms.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Hostel
        </button>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-sharp">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Total Rooms</th>
              </tr>
            </thead>
            <tbody>
              {(hostels as any[]).map((h) => (
                <tr key={h.id}>
                  <td className="text-gray-900 font-medium">
                    <span className="inline-flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#1a56db]" />
                      {h.name}
                    </span>
                  </td>
                  <td className="text-gray-600">{h.code}</td>
                  <td className="text-gray-600">{h.totalRooms}</td>
                </tr>
              ))}
              {(hostels as any[]).length === 0 && (
                <tr>
                  <td colSpan={3} className="text-gray-500 p-6">
                    No hostels yet. Create one to begin adding rooms.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 shadow-sharp-lg max-w-lg w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add Hostel</h3>
              <button onClick={() => setIsAddOpen(false)} className="btn-secondary">
                Close
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                <input
                  className="input-sharp"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Main Campus Hostel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Code *</label>
                <input
                  className="input-sharp"
                  value={form.code}
                  onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                  placeholder="e.g. MCH"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Rooms</label>
                <input
                  className="input-sharp"
                  type="number"
                  min={0}
                  value={form.totalRooms}
                  onChange={(e) => setForm((p) => ({ ...p, totalRooms: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setIsAddOpen(false)} className="flex-1 btn-secondary">
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={!canSubmit}
                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Save Hostel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

