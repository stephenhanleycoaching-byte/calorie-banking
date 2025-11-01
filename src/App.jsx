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

  const cardStyle = {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    background: 'linear-gradient(to bottom right, #EBF4FF, #E0E7FF)',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  };

  const whiteCardStyle = {
    background: 'white',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    marginBottom: '24px'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px'
  };

  const inputGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 16px',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    fontSize: '16px'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  };

  return (
    <div style={cardStyle}>
      <div style={whiteCardStyle}>
        <div style={headerStyle}>
          <Calendar size={32} color="#4F46E5" />
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>Calorie Banking Calculator</h1>
        </div>
        
        <p style={{ color: '#4B5563', marginBottom: '24px' }}>
          Plan your calorie banking strategy by setting aside calories from multiple days to enjoy on a special event day.
        </p>

        <div style={inputGridStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              Daily Calorie Target
            </label>
            <input
              type="number"
              value={dailyCalories}
              onChange={(e) => setDailyCalories(e.target.value)}
              placeholder="e.g., 2000"
              style={inputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
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
              style={inputStyle}
            >
              {daysOfWeek.map((day, index) => (
                <option key={day} value={index + 1}>{day}</option>
              ))}
            </select>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              Banking Days: {bankingDays} {bankingDays === 1 ? 'day' : 'days'}
            </label>
            <input
              type="range"
              min="1"
              max={eventDay - 1}
              value={bankingDays}
              onChange={(e) => setBankingDays(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              Total Calories to Bank: {totalBank}
            </label>
            <input
              type="range"
              min="100"
              max="3000"
              step="50"
              value={totalBank}
              onChange={(e) => setTotalBank(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      {dailyCalories && parseFloat(dailyCalories) > 0 ? (
        <>
          <div style={whiteCardStyle}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937', marginBottom: '16px' }}>Your Calorie Plan</h2>
            <div style={statsGridStyle}>
              <div style={{ background: '#EFF6FF', padding: '16px', borderRadius: '8px' }}>
                <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '4px' }}>Banking Days Calories</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563EB' }}>{Math.round(bankingCalories)}</p>
                <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>({Math.round(dailyDeficit)} cal deficit per day)</p>
              </div>
              <div style={{ background: '#F0FDF4', padding: '16px', borderRadius: '8px' }}>
                <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '4px' }}>Event Day Calories</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#16A34A' }}>{Math.round(eventDayCalories)}</p>
                <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }>(+{totalBank} cal bonus)}</p>
              </div>
              <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '8px' }}>
                <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '4px' }}>Daily Baseline</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4B5563' }}>{Math.round(parseFloat(dailyCalories))}</p>
                <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }>(normal intake)</p>
              </div>
            </div>
          </div>

          <div style={whiteCardStyle}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937', marginBottom: '16px' }}>Calorie Banking Timeline</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis label={{ value: 'Calories', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px' }}
                  formatter={(value) => [value, 'Daily Intake']}
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
        <div style={{ background: 'white', borderRadius: '8px', padding: '48px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
          <p style={{ color: '#6B7280', fontSize: '18px' }}>Enter your daily calorie target above to see your banking plan</p>
        </div>
      )}
    </div>
  );
}
