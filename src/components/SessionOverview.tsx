'use client'

export default function SessionOverview() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Today's Sessions</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center border-b pb-2">
          <div>
            <p className="font-medium">John Doe</p>
            <p className="text-sm text-gray-600">Individual Therapy</p>
          </div>
          <div className="text-right">
            <p className="text-primary font-semibold">2:00 PM</p>
            <p className="text-xs text-gray-500">50 min</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center border-b pb-2">
          <div>
            <p className="font-medium">Jane Smith</p>
            <p className="text-sm text-gray-600">Couples Therapy</p>
          </div>
          <div className="text-right">
            <p className="text-primary font-semibold">3:30 PM</p>
            <p className="text-xs text-gray-500">60 min</p>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-500">
        Connect to Supabase to see live session data
      </p>
    </div>
  )
}
