import { BedDouble, Building2 } from 'lucide-react';
import { useAvailableRooms, useMyAllocation, useRequestRoom } from '@/hooks/api';
import { useState } from 'react';

export default function StudentRoom() {
  const { data: myAllocation } = useMyAllocation();
  const { data: rooms = [] } = useAvailableRooms();
  const { mutateAsync: requestRoom, isPending } = useRequestRoom();
  const [error, setError] = useState<string>('');

  const room = myAllocation?.room;

  if (myAllocation && room) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Room</h1>
          <p className="text-gray-500">Your current hostel allocation.</p>
        </div>

        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#1a56db] flex items-center justify-center">
              <BedDouble className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Room</p>
              <p className="text-2xl font-bold text-gray-900">{room.roomNumber}</p>
              <p className="text-gray-500 text-sm">Block {room.block}, Floor {room.floor}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-gray-50 border border-gray-200">
              <p className="text-gray-500 text-sm">Capacity</p>
              <p className="text-gray-900 font-medium">{room.capacity}</p>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200">
              <p className="text-gray-500 text-sm">Monthly Fee</p>
              <p className="text-gray-900 font-medium">{room.price.toLocaleString()} FCFA</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm mb-2">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {(room.amenities || []).map((a: string) => (
                <span key={a} className="px-3 py-1 bg-blue-50 text-[#1a56db] text-sm font-medium">
                  {a}
                </span>
              ))}
              {(room.amenities || []).length === 0 && <span className="text-gray-400">No amenities listed</span>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Room</h1>
        <p className="text-gray-500">Request an available room.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[#1a56db]" />
          </div>
          <div>
            <p className="text-gray-900 font-medium">No allocation yet</p>
            <p className="text-gray-500 text-sm">Choose a room below to submit a request.</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-sharp">
            <thead>
              <tr>
                <th>Room</th>
                <th>Block</th>
                <th>Floor</th>
                <th>Capacity</th>
                <th>Occupied</th>
                <th>Price</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {(rooms as any[]).map((r) => (
                <tr key={r.id}>
                  <td className="text-gray-900 font-medium">{r.roomNumber}</td>
                  <td className="text-gray-600">{r.block}</td>
                  <td className="text-gray-600">{r.floor}</td>
                  <td className="text-gray-600">{r.capacity}</td>
                  <td className="text-gray-600">{r.occupied}</td>
                  <td className="text-gray-900">{Number(r.price).toLocaleString()} FCFA</td>
                  <td className="text-right">
                    <button
                      disabled={isPending}
                      onClick={async () => {
                        try {
                          setError('');
                          await requestRoom(r.id);
                        } catch (e: any) {
                          setError(e?.message || 'Failed to submit room request');
                        }
                      }}
                      className="btn-primary text-sm disabled:opacity-50"
                    >
                      Request
                    </button>
                  </td>
                </tr>
              ))}
              {(rooms as any[]).length === 0 && (
                <tr>
                  <td colSpan={7} className="text-gray-500 p-6">
                    No available rooms.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

