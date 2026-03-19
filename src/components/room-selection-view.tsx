import { useState } from 'react';
import { useAvailableRooms, useRequestRoom, useMyAllocation, usePaymentSummary } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, MapPin, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Room {
  id: string;
  roomNumber: string;
  floor: string;
  block: string;
  capacity: number;
  occupied: number;
  status: string;
  amenities: string[];
  price: number;
}

export function RoomSelectionView() {
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // Queries
  const { data: rooms = [], isLoading: roomsLoading, error: roomsError } = useAvailableRooms(undefined, selectedFloor || undefined);
  const { data: myAllocation } = useMyAllocation();
  const { data: paymentSummary } = usePaymentSummary();

  // Mutations
  const { mutate: requestRoom, isPending: requestPending } = useRequestRoom();

  const uniqueFloors: string[] = Array.from(new Set(rooms.map((r: Room) => r.floor))).sort() as string[];

  const handleRequestRoom = (roomId: string) => {
    requestRoom(roomId, {
      onSuccess: () => {
        toast.success('Room request submitted successfully!');
        setSelectedRoomId(null);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to request room');
      },
    });
  };

  if (myAllocation && (myAllocation.status === 'APPROVED' || myAllocation.status === 'approved')) {
    return (
      <div className="space-y-6">
        <Card className="bg-green-50 border-green-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-green-900">Room Allocated</h3>
              <p className="text-green-800 mt-2">
                You have been allocated to <strong>Room {myAllocation.room.roomNumber}</strong> on{' '}
                <strong>Floor {myAllocation.room.floor}</strong>
              </p>
              <p className="text-sm text-green-700 mt-2">Price: ₦{myAllocation.room.price.toLocaleString()}</p>
            </div>
            <Badge className="bg-green-600">Approved</Badge>
          </div>
        </Card>
      </div>
    );
  }

  if (myAllocation && (myAllocation.status === 'PENDING' || myAllocation.status === 'pending')) {
    return (
      <div className="space-y-6">
        <Card className="bg-blue-50 border-blue-200 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-lg text-blue-900">Room Request Pending</h3>
              <p className="text-blue-800 mt-2">
                Your request for <strong>Room {myAllocation.room?.roomNumber}</strong> is pending admin approval.
              </p>
              <p className="text-sm text-blue-700 mt-2">
                Requested on: {myAllocation.requestedAt ? new Date(myAllocation.requestedAt).toLocaleDateString() : '—'}
              </p>
            </div>
            <Badge className="bg-blue-600">Pending</Badge>
          </div>
        </Card>
      </div>
    );
  }

  const showRejectedBanner = myAllocation && (myAllocation.status === 'REJECTED' || myAllocation.status === 'rejected');

  return (
    <div className="space-y-6">
      {/* Rejected banner - allow new request */}
      {showRejectedBanner && (
        <Card className="bg-amber-50 border-amber-200 p-4">
          <p className="text-amber-800 text-sm">
            Your previous room request was rejected. You may submit a new request below.
          </p>
        </Card>
      )}
      {/* Payment Status */}
      {paymentSummary && paymentSummary.totalOverdue > 0 && (
        <Card className="bg-red-50 border-red-200 p-4">
          <p className="text-red-800 text-sm">
            ⚠️ You have <strong>₦{paymentSummary.totalOverdue.toLocaleString()}</strong> in overdue payments.
            Please settle outstanding fees to request a room.
          </p>
        </Card>
      )}

      {/* Filters */}
      <div className="space-y-3">
        <h3 className="font-semibold">Filter by Floor</h3>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedFloor === null ? 'default' : 'outline'}
            onClick={() => setSelectedFloor(null)}
            size="sm"
          >
            All Floors
          </Button>
          {uniqueFloors.map((floor) => (
            <Button
              key={floor}
              variant={selectedFloor === floor ? 'default' : 'outline'}
              onClick={() => setSelectedFloor(floor)}
              size="sm"
            >
              Floor {floor}
            </Button>
          ))}
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Available Rooms ({rooms.length})</h3>
          {roomsLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-500" />}
        </div>

        {roomsError && (
          <Card className="bg-red-50 border-red-200 p-4">
            <p className="text-red-800 text-sm">Error loading rooms. Please try again.</p>
          </Card>
        )}

        {!roomsLoading && rooms.length === 0 && (
          <Card className="bg-yellow-50 border-yellow-200 p-6 text-center">
            <p className="text-yellow-800">No available rooms found for the selected filter.</p>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room: Room) => (
            <Card key={room.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                {/* Room Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg">Room {room.roomNumber}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      Floor {room.floor}, Block {room.block}
                    </div>
                  </div>
                  <Badge variant={room.status === 'AVAILABLE' ? 'default' : 'secondary'}>
                    {room.status}
                  </Badge>
                </div>

                {/* Room Details */}
                <div className="bg-gray-50 p-3 rounded space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-semibold">{room.capacity} persons</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Occupied:</span>
                    <span className="font-semibold">
                      {room.occupied} / {room.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Amenities */}
                {room.amenities.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-600">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="pt-2 border-t">
                  <p className="text-lg font-bold text-green-600">₦{room.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Per semester</p>
                </div>

                {/* Action Button */}
                <AlertDialog open={selectedRoomId === room.id} onOpenChange={(open) => !open && setSelectedRoomId(null)}>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-full"
                      disabled={requestPending || (paymentSummary && paymentSummary.totalOverdue > 0)}
                      onClick={() => setSelectedRoomId(room.id)}
                    >
                      {requestPending ? 'Requesting...' : 'Request Room'}
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Room Request</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to request <strong>Room {room.roomNumber}</strong> on{' '}
                        <strong>Floor {room.floor}</strong>?<br />
                        <br />
                        Payment: <strong className="text-green-600">₦{room.price.toLocaleString()}</strong>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        Once approved by admin, this amount will be charged to your account.
                      </p>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRequestRoom(room.id)}
                        disabled={requestPending}
                      >
                        {requestPending ? 'Requesting...' : 'Confirm Request'}
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RoomSelectionView;
