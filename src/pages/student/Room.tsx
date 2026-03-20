import { BedDouble, Building2, Users, CheckCircle, X, Info } from 'lucide-react';
import { useAvailableRooms, useMyAllocation, useRequestRoom } from '@/hooks/api';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function StudentRoom() {
  const { data: myAllocation } = useMyAllocation();
  const { data: rooms = [] } = useAvailableRooms();
  const { mutateAsync: requestRoom, isPending } = useRequestRoom();
  const [error, setError] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const room = myAllocation?.room;

  // Handle deep linking
  useEffect(() => {
    const roomId = searchParams.get('room');
    if (roomId && rooms.length > 0) {
      const targetRoom = (rooms as any[]).find(r => r.id === roomId);
      if (targetRoom) {
        setSelectedRoom(targetRoom);
        setIsModalOpen(true);
      }
    }
  }, [searchParams, rooms]);

  const handleOpenDetails = (targetRoom: any) => {
    setSelectedRoom(targetRoom);
    setIsModalOpen(true);
    setSearchParams({ room: targetRoom.id });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
    setSearchParams({});
    setError('');
  };

  const handleRequest = async (roomId: string) => {
    try {
      setError('');
      await requestRoom(roomId);
      toast.success('Room request submitted successfully!');
      handleCloseModal();
    } catch (e: any) {
      const msg = e?.message || 'Failed to submit room request';
      setError(msg);
      toast.error(msg);
    }
  };

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
                      onClick={() => handleOpenDetails(r)}
                      className="text-[#1a56db] hover:text-[#1e40af] text-sm font-semibold flex items-center gap-1 ml-auto"
                    >
                      <Info className="w-4 h-4" />
                      View Details
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

      {/* Room Details Modal */}
      {isModalOpen && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-gray-200 shadow-sharp-lg max-w-lg w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-[#1a56db]" />
                Room Details
              </h3>
              <button onClick={handleCloseModal} className="p-1 hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-[#1a56db] flex items-center justify-center shrink-0">
                  <span className="text-white text-2xl font-bold">{selectedRoom.roomNumber}</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-500 text-sm">Room Number</p>
                  <p className="text-xl font-bold text-gray-900">Room {selectedRoom.roomNumber}</p>
                  <p className="text-gray-500">Block {selectedRoom.block}, {selectedRoom.floor} Floor</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Status</p>
                  <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase">
                    {selectedRoom.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 border border-gray-200">
                  <span className="text-gray-500 text-xs font-medium uppercase block mb-1">Capacity</span>
                  <p className="text-gray-900 font-bold flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    {selectedRoom.capacity} Bed Shared
                  </p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200">
                  <span className="text-gray-500 text-xs font-medium uppercase block mb-1">Monthly Price</span>
                  <p className="text-[#1a56db] font-bold text-lg">
                    {Number(selectedRoom.price).toLocaleString()} FCFA
                  </p>
                </div>
              </div>

              <div>
                <span className="text-gray-500 text-xs font-medium uppercase block mb-3">Amenities & Features</span>
                <div className="flex flex-wrap gap-2">
                  {(selectedRoom.amenities || []).map((amenity: string) => (
                    <span
                      key={amenity}
                      className="px-3 py-1.5 bg-blue-50 text-[#1a56db] text-xs font-bold border border-blue-100 flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3 h-3" />
                      {amenity}
                    </span>
                  ))}
                  {(selectedRoom.amenities || []).length === 0 && (
                    <span className="text-gray-400 text-sm italic">No amenities listed for this room</span>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 flex gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-amber-800 text-sm leading-relaxed">
                  By requesting this room, you agree to the hostel terms and conditions. Your request will be reviewed by the admin.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button 
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                onClick={() => handleRequest(selectedRoom.id)}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 bg-[#1a56db] text-white font-bold hover:bg-[#1e40af] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? 'Submitting...' : 'Request Room'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

