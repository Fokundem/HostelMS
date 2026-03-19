import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Eye,
  BedDouble,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Save,
  Wifi,
  Wind,
  Droplets,
  Zap,
} from 'lucide-react';
import type { Room } from '@/types';
import { useAllRooms, useCreateRoom, useDeleteRoom, useHostels, useUpdateRoom } from '@/hooks/api';

const amenityOptions = [
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'fan', label: 'Fan', icon: Wind },
  { id: 'ac', label: 'AC', icon: Droplets },
  { id: 'desk', label: 'Desk', icon: Zap },
  { id: 'wardrobe', label: 'Wardrobe', icon: CheckCircle },
  { id: 'private_bathroom', label: 'Private Bathroom', icon: Droplets },
];

export default function RoomManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { data: roomList = [] } = useAllRooms();
  const { data: hostels = [] } = useHostels();
  const { mutateAsync: createRoom } = useCreateRoom();
  const { mutateAsync: updateRoom } = useUpdateRoom();
  const { mutateAsync: deleteRoom } = useDeleteRoom();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Form state
  const [formData, setFormData] = useState({
    roomNumber: '',
    block: 'A',
    floor: '1',
    capacity: 4,
    price: 50000,
    status: 'available' as Room['status'],
    amenities: [] as string[],
    hostelId: '' as string,
  });

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.room-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, []);

  // Filter rooms
  const filteredRooms = roomList.filter((room) => {
    const matchesSearch =
      room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.block.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAdd = async () => {
    await createRoom({
      hostelId: formData.hostelId || undefined,
      data: {
        roomNumber: formData.roomNumber,
        block: formData.block,
        floor: formData.floor,
        capacity: formData.capacity,
        price: formData.price,
        amenities: formData.amenities,
      },
    });
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEdit = async () => {
    if (selectedRoom) {
      await updateRoom({
        roomId: selectedRoom.id,
        data: {
          roomNumber: formData.roomNumber,
          block: formData.block,
          floor: formData.floor,
          capacity: formData.capacity,
          price: formData.price,
          amenities: formData.amenities,
          status: formData.status.toUpperCase(),
        },
      });
      setIsEditModalOpen(false);
      setSelectedRoom(null);
    }
  };

  const handleDelete = async () => {
    if (selectedRoom) {
      await deleteRoom(selectedRoom.id);
      setIsDeleteModalOpen(false);
      setSelectedRoom(null);
    }
  };

  const resetForm = () => {
    setFormData({
      roomNumber: '',
      block: 'A',
      floor: '1',
      capacity: 4,
      price: 50000,
      status: 'available',
      amenities: [],
      hostelId: (hostels as any[])?.[0]?.id || '',
    });
  };

  const openEditModal = (room: Room) => {
    setSelectedRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      block: room.block,
      floor: room.floor,
      capacity: room.capacity,
      price: room.price,
      status: room.status,
      amenities: room.amenities,
      hostelId: (room as any).hostelId || (hostels as any[])?.[0]?.id || '',
    });
    setIsEditModalOpen(true);
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="badge-success">Available</span>;
      case 'full':
        return <span className="badge-error">Full</span>;
      case 'maintenance':
        return <span className="badge-warning">Maintenance</span>;
      default:
        return <span className="badge-info">{status}</span>;
    }
  };

  const renderForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Hostel *</label>
        <select
          value={formData.hostelId}
          onChange={(e) => setFormData({ ...formData, hostelId: e.target.value })}
          className="input-sharp"
          required
        >
          <option value="" disabled>
            Select hostel
          </option>
          {(hostels as any[]).map((h) => (
            <option key={h.id} value={h.id}>
              {h.name} ({h.code})
            </option>
          ))}
        </select>
        {(hostels as any[]).length === 0 && (
          <p className="text-sm text-red-600 mt-2">
            No hostels found. Create one first in Admin → Hostels.
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Room Number *</label>
        <input
          type="text"
          value={formData.roomNumber}
          onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
          placeholder="A12"
          className="input-sharp"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Block *</label>
        <select
          value={formData.block}
          onChange={(e) => setFormData({ ...formData, block: e.target.value })}
          className="input-sharp"
        >
          <option value="A">Block A</option>
          <option value="B">Block B</option>
          <option value="C">Block C</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Floor *</label>
        <select
          value={formData.floor}
          onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
          className="input-sharp"
        >
          <option value="0">Ground Floor</option>
          <option value="1">First Floor</option>
          <option value="2">Second Floor</option>
          <option value="3">Third Floor</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Capacity *</label>
        <input
          type="number"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
          min={1}
          max={8}
          className="input-sharp"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (FCFA) *</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
          min={10000}
          step={5000}
          className="input-sharp"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Status *</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as Room['status'] })}
          className="input-sharp"
        >
          <option value="available">Available</option>
          <option value="full">Full</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {amenityOptions.map((amenity) => (
            <button
              key={amenity.id}
              type="button"
              onClick={() => toggleAmenity(amenity.label)}
              className={`flex items-center gap-2 px-3 py-2 border transition-colors ${
                formData.amenities.includes(amenity.label)
                  ? 'bg-[#1a56db] border-[#1a56db] text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              <amenity.icon className="w-4 h-4" />
              {amenity.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-500">Manage hostel rooms and allocations</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Room
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Rooms', value: roomList.length, color: '#1a56db' },
          { label: 'Available', value: roomList.filter((r) => r.status === 'available').length, color: '#059669' },
          { label: 'Occupied', value: roomList.filter((r) => r.status === 'full').length, color: '#dc2626' },
          { label: 'Maintenance', value: roomList.filter((r) => r.status === 'maintenance').length, color: '#d97706' },
        ].map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 p-4">
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by room number or block..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-sharp pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-sharp"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="full">Full</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <button className="btn-secondary">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Room Grid */}
      <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedRooms.map((room) => (
          <div
            key={room.id}
            className="room-card bg-white border border-gray-200 p-5 hover:shadow-sharp transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Room {room.roomNumber}</h3>
                <p className="text-gray-500 text-sm">
                  Block {room.block}, Floor {room.floor}
                </p>
              </div>
              {getStatusBadge(room.status)}
            </div>

            {/* Occupancy Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-500">Occupancy</span>
                <span className="text-gray-900 font-medium">
                  {room.occupied}/{room.capacity}
                </span>
              </div>
              <div className="h-2 bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-[#1a56db] transition-all"
                  style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2 mb-4">
              {room.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs"
                >
                  {amenity}
                </span>
              ))}
              {room.amenities.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs">
                  +{room.amenities.length - 3}
                </span>
              )}
            </div>

            {/* Price & Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <p className="text-gray-500 text-sm">Price</p>
                <p className="text-[#1a56db] font-semibold">{room.price.toLocaleString()} FCFA</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setSelectedRoom(room);
                    setIsViewModalOpen(true);
                  }}
                  className="p-2 text-gray-400 hover:text-[#1a56db] transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openEditModal(room)}
                  className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedRoom(room);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredRooms.length)} of {filteredRooms.length} entries
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 text-gray-500 hover:text-gray-900 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-[#1a56db] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-500 hover:text-gray-900 disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 shadow-sharp-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Room</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {renderForm()}
            </div>
            <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setIsAddModalOpen(false)} className="flex-1 btn-secondary">
                Cancel
              </button>
              <button onClick={handleAdd} className="flex-1 btn-primary flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                Save Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 shadow-sharp-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Room</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {renderForm()}
            </div>
            <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setIsEditModalOpen(false)} className="flex-1 btn-secondary">
                Cancel
              </button>
              <button onClick={handleEdit} className="flex-1 btn-primary flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                Update Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 shadow-sharp-lg max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Room Details</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#1a56db] flex items-center justify-center">
                  <BedDouble className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">Room {selectedRoom.roomNumber}</h4>
                  {getStatusBadge(selectedRoom.status)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <p className="text-gray-500 text-sm">Block</p>
                  <p className="text-gray-900">{selectedRoom.block}</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <p className="text-gray-500 text-sm">Floor</p>
                  <p className="text-gray-900">{selectedRoom.floor}</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <p className="text-gray-500 text-sm">Capacity</p>
                  <p className="text-gray-900">{selectedRoom.capacity} beds</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <p className="text-gray-500 text-sm">Occupied</p>
                  <p className="text-gray-900">{selectedRoom.occupied}</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200">
                <p className="text-gray-500 text-sm mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedRoom.amenities.map((amenity, index) => (
                    <span key={index} className="px-3 py-1 bg-[#1a56db] text-white text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200">
                <p className="text-gray-500 text-sm">Price</p>
                <p className="text-[#1a56db] text-xl font-bold">{selectedRoom.price.toLocaleString()} FCFA</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 shadow-sharp-lg max-w-sm w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Room</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete <span className="text-gray-900 font-medium">Room {selectedRoom.roomNumber}</span>? 
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
