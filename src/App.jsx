import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Calendar } from 'lucide-react';

export default function App() {
  const [dailyCalories, setDailyCalories] = useState('');
  const [eventDay, setEventDay] = useState(7);
  const [bankingDays, setBankingDays] = useState(6);
  const [totalBank, setTotalBank] = useState(1000);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const chartData = useMemo(() => {
    if (!dailyCalories || isNaN(dailyCalories) || dailyCalories <= 0) {
      return [];
    }

    const baseline = parseFloat(dailyCalories);
    const dailyDeficit = totalBank / bankingDays;
    const bankingStart = eventDay - bankingDays;
    
    const data = [];
    for (let day = 1; day <= 7; day++) {
      let calories;
      let label;
      
      if (day < bankingStart) {
        calories = baseline;
        label = 'Baseline';
      } else if (day < eventDay) {
        calories = baseline - dailyDeficit;
        label = 'Banking';
      } else if (day === eventDay) {
        calories = baseline + totalBank;
        label = 'Event Day';
      } else {
        calories = baseline;
        label = 'Baseline';
      }
      
      data.push({
        day: daysOfWeek[day - 1],
        calories: Math.round(calories),
        baseline: baseline,
        type: label
      });
    }
    
    return data;
  }, [dailyCalories, eventDay, bankingDays, totalBank, daysOfWeek]);

  const dailyDeficit = totalBank / bankingDays;
  const bankingCalories = dailyCalories ? parseFloat(dailyCalories) - dailyDeficit : 0;
  const eventDayCalories = dailyCalories ? parseFloat(dailyCalories) + totalBank : 0;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg">
      <div className="bg-white rounded-lg p-6 shadow-md mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-800">Calorie Banking Calculator</h1>
        </div>
        
        <p className="text-gray-600 mb-6">
          Plan your calorie banking strategy by setting aside calories from multiple days to enjoy on a special event day.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Daily Calorie Target
            </label>
            <input
              type="number"
              value={dailyCalories}
              onChange={(e) => setDailyCalories(e.target.value)}
              placeholder="e.g., 2000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Event Day: {daysOfWeek[eventDay - 1]}
            </label>
            <select
              value={eventDay}
              onChange={(e) => {
                const newEventDay = parseInt(e.target.value);
                setEventDay(newEventDay);
                if (bankingDays >= newEventDay) {
                  setBankingDays(newEventDay - 1);
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {daysOfWeek.map((day, index) => (
                <option key={day} value={index + 1}>{day}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Banking Days
            </label>
            <select
              value={bankingDays}
              onChange={(e) => setBankingDays(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {Array.from({ length: eventDay - 1 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'day' : 'days'}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Total Calories to Bank
            </label>
            <input
              type="number"
              min="100"
              max="3000"
              step="50"
              value={totalBank}
              onChange={(e) => setTotalBank(parseInt(e.target.value) || 0)}
              placeholder="e.g., 1000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {dailyCalories && parseFloat(dailyCalories) > 0 ? (
        <>
          <div className="bg-white rounded-lg p-6 shadow-md mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Calorie Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Banking Days Calories</p>
                <p className="text-2xl font-bold text-blue-600">{Math.round(bankingCalories)}</p>
                <p className="text-xs text-gray-500 mt-1">({Math.round(dailyDeficit)} cal deficit/day)</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Event Day Calories</p>
                <p className="text-2xl font-bold text-green-600">{Math.round(eventDayCalories)}</p>
                <p className="text-xs text-gray-500 mt-1">(+{totalBank} cal bonus)</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Daily Baseline</p>
                <p className="text-2xl font-bold text-gray-600">{Math.round(parseFloat(dailyCalories))}</p>
                <p className="text-xs text-gray-500 mt-1">(normal intake)</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Calorie Banking Timeline</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis label={{ value: 'Calories', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px' }}
                  formatter={(value, name) => [value, name === 'calories' ? 'Daily Intake' : 'Baseline']}
                />
                <Legend />
                <ReferenceLine y={parseFloat(dailyCalories)} stroke="#9CA3AF" strokeDasharray="5 5" label="Baseline" />
                <Bar 
                  dataKey="calories" 
                  fill="#4F46E5"
                  name="Daily Intake"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg p-12 shadow-md text-center">
          <p className="text-gray-500 text-lg">Enter your daily calorie target above to see your banking plan</p>
        </div>
      )}
    </div>
  );
}
