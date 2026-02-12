'use client'

export default function WeatherWidget() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Weather Forecast</h2>
      <div className="space-y-3">
        <p className="text-gray-600">Location: [Your Farm Location]</p>
        <div className="text-4xl font-bold text-primary">25°C</div>
        <p className="text-gray-700">Partly Cloudy</p>
        <div className="mt-4 text-sm text-gray-600">
          <p>Humidity: 65%</p>
          <p>Wind: 12 km/h</p>
          <p>Precipitation: 20%</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-500">
        Weather API integration pending
      </p>
    </div>
  )
}
