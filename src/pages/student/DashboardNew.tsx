import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BedDouble, CreditCard, MessageSquare } from 'lucide-react';
import RoomSelectionView from '@/components/room-selection-view';
import PaymentView from '@/components/payment-view';
import { useCurrentUser } from '@/hooks/api';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('rooms');
  const { data: currentUser } = useCurrentUser();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, <span className="font-semibold">{currentUser?.name}</span>!
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="rooms" className="flex items-center gap-2">
            <BedDouble className="w-4 h-4" />
            <span className="hidden sm:inline">Room Allocation</span>
            <span className="sm:hidden">Rooms</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Payments</span>
            <span className="sm:hidden">Pay</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Messages</span>
            <span className="sm:hidden">Chat</span>
          </TabsTrigger>
        </TabsList>

        {/* Room Allocation Tab */}
        <TabsContent value="rooms" className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900 text-sm">
              📌 <strong>Select a room below:</strong> View available rooms by floor, check room conditions
              and amenities, then submit your request for admin approval.
            </p>
          </div>
          <RoomSelectionView />
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-900 text-sm">
              💳 <strong>Payment Management:</strong> View your payment history, pending amounts,
              and settle payments to avoid penalties.
            </p>
          </div>
          <PaymentView />
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-900 text-sm">
              💬 <strong>Chat & Messages:</strong> Group chat with hostel residents and private messaging.
              Coming soon!
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
