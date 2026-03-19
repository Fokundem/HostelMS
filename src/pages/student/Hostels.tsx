import { Building2, BedDouble } from 'lucide-react';
import { useHostels } from '@/hooks/api';
import { Link } from 'react-router-dom';

export default function StudentHostels() {
  const { data: hostels = [], isLoading } = useHostels();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-[#1a56db] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hostels</h1>
        <p className="text-gray-500">Browse available hostels and facilities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(hostels as any[]).map((hostel) => (
          <div key={hostel.id} className="bg-white border border-gray-200 overflow-hidden group hover:border-[#1a56db] hover:shadow-sharp transition-all">
            {hostel.imageUrl && (
              <div className="h-48 overflow-hidden">
                <img
                  src={`http://localhost:8000${hostel.imageUrl}`}
                  alt={hostel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{hostel.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Building2 className="w-4 h-4" />
                    <span>{hostel.code}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center w-10 h-10 bg-blue-50 text-[#1a56db] font-semibold">
                  M
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {hostel.description || 'A modern and comfortable residence.'}
              </p>
              
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex gap-2">
                  {(hostel.features || []).slice(0, 2).map((feat: string, i: number) => (
                    <span key={i} className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1">
                      {feat}
                    </span>
                  ))}
                  {(hostel.features || []).length > 2 && (
                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1">
                      +{(hostel.features.length - 2)}
                    </span>
                  )}
                </div>
                <Link to="/student/room" className="text-sm font-semibold text-[#1a56db] hover:text-[#1e40af] flex items-center gap-1">
                  View Rooms <BedDouble className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
        {(hostels as any[]).length === 0 && (
          <div className="col-span-full bg-white border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Hostels Found</h3>
            <p className="text-gray-500">There are currently no hostels available in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
}
